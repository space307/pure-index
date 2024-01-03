# 🌿 Pure Index

Pure Index is utility for packages. It helps to clean your packages of unused exports with ease.

## Motivation

We will use the `ui-kit` package as an example. Its _index.ts_ file looks like this

```ts
export { Button } from './components/button';
export { Text } from './components/text';

export { ThemeProvider, useTheme, type Theme } from './themes';
...
```

All of its exportable code requires support. But is all of it actually being used?

You can check this manually by just looping through the exports. It's time consuming and there is a chance of error. What if it's code is used by multiple repositories?

Pure Index automates this process!

## Installation

```sh
npm install --save-dev pure-index
```

## Quick Start

Pure Index can be used either through a command line interface with an optional [configuration file](#config), or else through its JavaScript API.

1. Add the `check-exports` script in the `package.json` of each package that needs to be checked

```diff
    "scripts": {
      "build": "webpack ./webpack.config.js",
+     "check-exports": "pure-index --entry ./src/index.ts",
      "test": "vitest"
    }
```

2. Run

```sh
npm run check-exports
```

## Configuration

Pure Index will read your root `.pure-index.json` when it is present.

```json title=".pure-index.json"
{
  "entry": "index.ts",
  "exclude": ["node_modules"],
  "extensions": ["ts", "tsx"],
  "dir": "repository-root",
  "batch": 100,
  "parserConfig": {
    "syntax": "typescript",
    "tsx": true
  }
}
```

### Options

#### entry

- **Type**: `string`
- **Default**: `index.ts`

Path to the package index file. Relative to the package directory.

#### extensions

- **Type**: `string[]`
- **Default**: `['ts', 'tsx']`

List of file extensions to be considered during the search.

#### exclude

- **Type**: `string[]`
- **Default**: `['node_modules']`

List of directories that will be excluded when searching for imports.

#### parserConfig

- **Type**: `object`
- **Default**: `{"syntax": "typescript", "tsx": true}`

Object with [swc parser parameters](https://swc.rs/docs/configuration/compilation#jscparser)

#### dir

- **Type**: `string`
- **Default**: `repository root`

Path to the directory where imports should be searched for.

#### batch

- **Type**: `number`
- **Default**: `200`

Number of files to be traversed in parallel. Changing the value may speed up or slow down the script. Choose the value yourself.
