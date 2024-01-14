# Contributing to Cal-Heatmap

## About the code

* The source code is located in the `src` folder
* All tests are locacted in the  `test` folder
* Code is written in Typescript

## Getting started

Clone/Download the repository, then run `npm install`
to insure you have all the required dev dependencies.
  
## Code formatting

* Code is formatted with ESLint/Prettier. See `.eslintrc.json` and `prettierrc`

You can also trigger:

* the lint with `npm run lint`
* an auto-formatting with `npm run format`

Ensure your code is formatted correctly before opening a pull request

## Building bundle

As a developer, you should use `npm run dev` while developing,
as it produces a slimer and faster bundle.

The code is built with Rollup, with `npm run build`. This command is run
from the CI when releasing a new tag, as the bundle are not versioned.

## Tests

Cal-Heatmap is tested with Jest.

Tests are run with `npm run test`
