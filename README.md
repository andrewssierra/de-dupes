# de-dupes

de-dupes is a Node.js application that deduplicates JSON data.

## Installation

Use the [yarn](https://yarnpkg.com/) installer to install dependencies.

```bash
yarn install
```

## Usage

To start application provide file name as a command line argument.

```bash
yarn run start ./TEST_FILE.json
```

To run unit tests run yarn run test

```powershell
yarn run test
```

de-dupes will create a results directory containing the deduplicated output data in results.json and the program logs in resultsLog.txt.

## Dependencies

de-dupes utilizes [jest](https://jestjs.io/) and [moment](https://momentjs.com/).
