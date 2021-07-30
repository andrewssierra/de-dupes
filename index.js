const { errorMessage, NO_FILE_NAME } = require('./error');
const {
  getJSON,
  logMerge,
  createResultsFolder,
  writeFile,
  removeLogsFile,
} = require('./fileIo');
fs = require('fs');
moment = require('moment');

const RESULTS_FILE = 'results/results.json';

function mergeDuplicates(records, index, duplicateIndex) {
  let duplicate = records[duplicateIndex];
  let record = records[index];

  const recordDate = moment(record.entryDate).startOf('day');
  const duplicateDate = moment(duplicate.entryDate).startOf('day');

  if (duplicateDate > recordDate) {
    replaceRecord(records, index, duplicate);
  } else if (recordDate > duplicateDate) {
    logMerge(duplicate, record);
  } else if (duplicateIndex > index) {
    replaceRecord(records, index, duplicate);
  } else {
    logMerge(duplicate, record);
  }

  records.splice(duplicateIndex, 1);
}

function findDuplicateIndex(record, records, index) {
  return records.findIndex(
    (otherRecord, currentIndex) =>
      (otherRecord._id === record._id || otherRecord.email === record.email) &&
      currentIndex !== index
  );
}

function replaceRecord(records, index, duplicate) {
  logMerge(records[index], duplicate);
  records[index] = duplicate;
}

function deduplicate(records) {
  for (let i = 0; i < records.length; i++) {
    let duplicateIndex = findDuplicateIndex(records[i], records, i);
    if (duplicateIndex > -1) {
      mergeDuplicates(records, i, duplicateIndex);
      i--;
    }
  }
  return records;
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
