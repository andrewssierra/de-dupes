# de-dupes

de-dupes is a Node.js application that deduplicates JSON data.

## Installation

Prior to running the de-dupes application install the following

- [Node](https://nodejs.org/en/download/)
- [Yarn](https://yarnpkg.com/)
- [Visual Studio Code](https://code.visualstudio.com/download) (optional IDE)

Change into src directory

```bash
cd src
```

Use [yarn](https://yarnpkg.com/) to install dependencies

```bash
yarn install
```

## Usage

To start application provide file name as a command line argument

```bash
yarn run start PATH_TO_YOUR_JSON_FILE
```

To run unit tests

```powershell
yarn run test
```

## Result Data

de-dupes will create a results directory in src

- Deduplicated output data will be in **src/results/results.json**
- Program logs in **src/results/resultsLog.txt**

## Dependencies

de-dupes utilizes [jest](https://jestjs.io/) and [moment](https://momentjs.com/).
