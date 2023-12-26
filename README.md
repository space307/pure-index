# 🌿 Pure Index

Pure Index is utility for monorepos. It helps to find unused exports from packages.

## Motivation

There is a package `a` which exports 2 functions

```ts
// "a" package index.ts file

export const T = () => true

export { myFn } from './myFn'
```

only 1 function from the package is used in the project

```ts
// some file

import { T } from 'a'
```

This means that package `a` exports `myFn` for nothing, so we can remove its export and possibly remove all the code.
As the code base develops, a large number of such unnecessary exports may accumulate in the monorepo. Pure Index allows you to find such exports.

## Usage

1. Install

```sh
npm install --save-dev pure-index
```

2. Add the `check-exports` script in the `package.json` of each package that needs to be checked

```diff
    "scripts": {
      "build": "webpack ./webpack.config.js",
+     "check-exports": "pure-index",
      "test": "vitest"
    }
```

3. Configure

4. Use flags if you need to specifically override the config.

## Config

Pure Index supports two ways to define config.

1. `.pure-index.json` config file:

```json
{
  "entry": "index.ts",
  "exclude": ["node_modules"],
  "babelPlugins": ["typescript"],
  "batch": {
    "default": 100
  }
}
```

2. or `pure-index` section in `package.json`:

```json
  "pure-index": {
    "entry": "index.ts",
    "exclude": ["node_modules"],
    "babelPlugins": ["typescript"],
    "batch": {
      "default": 100
    }
  }
```

### Arguments

- `entry (String)` — path to the package index file. relative to the package directory.
- `exclude (Array<string>)` — list of directories that will be excluded when searching for imports.
- `babelPlugins (Array<string>)` — list of babel plugins that will be used when parsing files.
- `batch.default (Number)` — number of files to be traversed in parallel. changing the value may speed up or slow down the script. choose the value yourself.

## CLI usage

- `--entry, -e`

123

## Explanation

### How It Works

In fact, the task is to compare all exports and imports of the package. Anything not imported but exported are unused exports.

#### Base algorithm:

1. collect all package exports into _exports Set_
2. traverse all files where package import may occur
3. if import is found, remove it from _exports Set_
4. if the size of exports _exports Set_ became equal to 0, then exit with success
5. if _exports Set_ size is not equal to 0, then exit with an error

### How It Optimized

1. file reading is divided into batches
2. file is not immediately converted to AST. First the import of the package is searched for in the file. _createReadStream_ is used
3. there is an instant exit with success as soon as the size of _exports Set_ is equal to zero
