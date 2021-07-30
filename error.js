const NO_FILE_NAME = 'File name not provided.';
const CANT_READ_FILE = 'Cannot read file or file does not exist.';
const INCORRECT_FORMAT = 'File is not formatted correctly.';
const CANNOT_CREATE_RESULTS_DIR = 'Cannot create results directory.';
const CANNOT_CREATE_RESULTS_FILE = 'Cannot create results file.';
const CANNOT_REMOVE_RESULTS_LOG = 'Cannot remove results log file.';

function errorMessage(message) {
  console.log(formatMessage(message));
}

function formatMessage(message) {
  return `❌ Error: ${message}`;
}

exports.NO_FILE_NAME = NO_FILE_NAME;
exports.CANT_READ_FILE = CANT_READ_FILE;
exports.INCORRECT_FORMAT = INCORRECT_FORMAT;
exports.CANNOT_CREATE_RESULTS_DIR = CANNOT_CREATE_RESULTS_DIR;
exports.CANNOT_CREATE_RESULTS_FILE = CANNOT_CREATE_RESULTS_FILE;
exports.CANNOT_REMOVE_RESULTS_LOG = CANNOT_REMOVE_RESULTS_LOG;
exports.errorMessage = errorMessage;
exports.formatMessage = formatMessage;
