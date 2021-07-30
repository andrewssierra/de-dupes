const {
  errorMessage,
  CANT_READ_FILE,
  CANNOT_CREATE_RESULTS_DIR,
  CANNOT_CREATE_RESULTS_FILE,
  INCORRECT_FORMAT,
  CANNOT_REMOVE_RESULTS_LOG,
} = require('./error');
fs = require('fs');

const path = require('path');
const RESULTS_FOLDER = 'results';
const RESULTS_LOG_FILE = 'results/resultsLog.txt';

function getJSON(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) =>
      err ? reject(CANT_READ_FILE) : resolve(data)
    );
  })
    .then((data) => parseData(data))
    .catch((message) => errorMessage(message));
}

function parseData(data) {
  let parseData;
  try {
    parseData = JSON.parse(data);
  } catch (err) {
    return errorMessage(INCORRECT_FORMAT);
  }
  if (typeof parseData !== 'object' || !parseData.leads) {
    return errorMessage(INCORRECT_FORMAT);
  }
  return parseData.leads;
}

function logMerge(from, to) {
  let logMessage = `Record: \n${JSON.stringify(from, null, 2)} \n`;
  logMessage += `Changed to: \n ${JSON.stringify(to, null, 2)} \n`;

  let individualFields = 'Individual field changes: \n';
  for (let property in from) {
    let fromProperty = from[property];
    let toProperty = to[property];
    if (fromProperty !== toProperty) {
      individualFields +=
        `${property}`.padEnd(15, ' ') +
        `---"${fromProperty}"`.padEnd(35, ' ') +
        `+++"${toProperty}" \n`;
    }
  }
  logMessage += individualFields + ' \n';
  writeFile(logMessage, RESULTS_LOG_FILE, { flag: 'a' });
}

function writeFile(data, file, options) {
  return fs.writeFile(path.join(__dirname, file), data, options, (err) => {
    if (err) {
      return errorMessage(CANNOT_CREATE_RESULTS_FILE);
    }
  });
}

function removeLogsFile() {
  return fs.unlink(RESULTS_LOG_FILE, (err) => {
    if (err) {
      return errorMessage(CANNOT_REMOVE_RESULTS_LOG);
    }
  });
}

function createResultsFolder() {
  return fs.mkdir(path.join(__dirname, RESULTS_FOLDER), (err) => {
    if (err && err.code !== 'EEXIST') {
      return errorMessage(CANNOT_CREATE_RESULTS_DIR);
    }
  });
}

exports.logMerge = logMerge;
exports.createResultsFolder = createResultsFolder;
exports.getJSON = getJSON;
exports.writeFile = writeFile;
exports.removeLogsFile = removeLogsFile;
