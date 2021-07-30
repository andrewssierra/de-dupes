const { errorMessage, NO_FILE_NAME } = require('./error');
const {
  getJSON,
  logMerge,
  createResultsFolder,
  writeFile,
  removeLogsFile,
  RESULTS_FILE,
} = require('./fileIo');
fs = require('fs');
moment = require('moment');

function createRecordBins(records) {
  let recordBins = [];
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    let foundDupe = false;

    for (const recordBin of recordBins) {
      if (recordBin.ids.includes(record._id)) {
        recordBin.records.push({ ...record, order: i });
        if (!recordBin.emails.includes(record.email)) {
          recordBin.emails.push(record.email);
        }
        foundDupe = true;
      } else if (recordBin.emails.includes(record.email)) {
        recordBin.records.push({ ...record, order: i });
        if (!recordBin.ids.includes(record._id)) {
          recordBin.ids.push(record._id);
        }
        foundDupe = true;
      }
    }
    // Record is not a dupe yet, add a new bin
    if (!foundDupe) {
      recordBins.push({
        ids: [record._id],
        emails: [record.email],
        records: [{ ...record, order: i }],
      });
    }
  }
  return recordBins;
}

function selectUnique(dupeRecords) {
  let unique = null;
  dupeRecords.sort((a, b) => moment(a.entryDate).diff(moment(b.entryDate)));
  const first = dupeRecords[0];
  const last = dupeRecords[dupeRecords.length - 1];

  if (moment(first.entryDate) !== moment(last.entryDate)) {
    unique = last;
  } else {
    unique = dupeRecords.reduce((a, b) => Math.max(a.order, b.order), 0);
  }

  return unique;
}

function deduplicate(records) {
  const recordBins = createRecordBins(records);
  const newRecords = [];

  for (const recordBin of recordBins) {
    const dupeRecords = recordBin.records;
    // If only record in bin, it is unique
    if (dupeRecords.length === 1) {
      newRecords.push(dupeRecords[0]);
    } else {
      let unique = selectUnique(dupeRecords);
      newRecords.push(unique);
      // Log all dupe changes
      for (const dupeRecord of dupeRecords) {
        if (dupeRecord.order !== unique.order)
          logMerge({ ...dupeRecord }, { ...unique });
      }
    }
  }

  newRecords.sort((a, b) => a.order - b.order);
  newRecords.forEach((newRecord) => delete newRecord.order);
  return newRecords;
}

async function start(file) {
  if (!file) {
    return errorMessage(NO_FILE_NAME);
  }
  const parseData = await getJSON(file);
  if (!parseData) {
    return;
  }
  createResultsFolder();
  removeLogsFile();
  const deduplicated = deduplicate(parseData);
  return writeFile(
    JSON.stringify({ leads: deduplicated }, null, 2),
    RESULTS_FILE
  );
}

if (process.env.NODE_ENV !== 'test') {
  start(process.argv[2]);
}

exports.start = start;
exports.deduplicate = deduplicate;
