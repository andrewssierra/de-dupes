const { start, deduplicate } = require('../index');
const { getJSON, removeLogsFile } = require('../fileIo');
const {
  formatMessage,
  NO_FILE_NAME,
  CANT_READ_FILE,
  INCORRECT_FORMAT,
} = require('../error');

const TEST_FILE = './test/leads.json';
const WRONG_TEST_FILE = './test/test123';
const EMPTY_FILE = './test/empty.json';
const INCORRECT_FORMAT_FILE = './test/incorrectFormat.json';
const MISSING_LEADS_FILE = './test/missingLeads.json';
const SAME_DATE_FILE = './test/sameDate.json';
const DIFFERENT_DATE_FILE = './test/differentDate.json';

const TEST_NAME = 'John';

beforeEach(() => {
  jest.spyOn(console, 'log');
  removeLogsFile();
});

afterEach(() => {
  console.log.mockRestore();
});

describe('start', () => {
  test('start function is defined', () => {
    expect(typeof start).toEqual('function');
  });

  test('If no file is provided error is logged', async () => {
    await start();
    expect(console.log.mock.calls[0][0]).toEqual(formatMessage(NO_FILE_NAME));
  });
});

describe('getJSON', () => {
  test('If file cannot be opened error is logged', async () => {
    await getJSON(WRONG_TEST_FILE);
    expect(console.log.mock.calls[0][0]).toEqual(formatMessage(CANT_READ_FILE));
  });

  test('If file exists data is parsed', async () => {
    let test = await getJSON(TEST_FILE);
    expect(test[0].firstName).toEqual(TEST_NAME);
  });

  test('If file is empty error is logged', async () => {
    await getJSON(EMPTY_FILE);
    expect(console.log.mock.calls[0][0]).toEqual(
      formatMessage(INCORRECT_FORMAT)
    );
  });

  test('If file is not proper JSON error logged', async () => {
    await getJSON(INCORRECT_FORMAT_FILE);
    expect(console.log.mock.calls[0][0]).toEqual(
      formatMessage(INCORRECT_FORMAT)
    );
  });

  test('If file is missing leads key error is logged', async () => {
    await getJSON(MISSING_LEADS_FILE);
    expect(console.log.mock.calls[0][0]).toEqual(
      formatMessage(INCORRECT_FORMAT)
    );
  });
});

describe('deduplicate', () => {
  test('The data from the newest date should be preferred.', async () => {
    const deduplicatedData = deduplicate(await getJSON(DIFFERENT_DATE_FILE));
    expect(deduplicatedData[0].email).toEqual('foo@bar.com');
    expect(deduplicatedData.length).toEqual(1);
  });
  test('If the dates are identical the record provided last in the list should be preferred.', async () => {
    const deduplicatedData = deduplicate(await getJSON(SAME_DATE_FILE));
    expect(deduplicatedData[0].email).toEqual('coo@bar.com');
    expect(deduplicatedData.length).toEqual(1);
  });
});
