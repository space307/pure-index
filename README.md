# 🌿 Pure Index

Pure Index is utility for monorepos. It helps to find unused exports from packages or get a list of all unique uses of any package.

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

4. Use flags if you need to [override](#cli) the config values for package

## Config

Pure Index supports three ways to define config.

1. `.pure-index.json` config file:

```json
{
  "entry": "index.ts",
  "exclude": ["node_modules"],
  "extensions": ["ts", "tsx"],
  "babelPlugins": ["typescript"],
  "batch": 100
}
```

2. or `pure-index` section in `package.json`:

```json
  "pure-index": {
    "entry": "index.ts",
    "exclude": ["node_modules"],
    "extensions": ["ts", "tsx"],
    "babelPlugins": ["typescript"],
    "batch": 100
  }
```

3. or a more flexible `.pure-index.js` or `.pure-index.cjs` config file:

```js
module.exports = {
  entry: 'index.ts',
  exclude: ['node_modules'],
  extensions: ['ts', 'tsx'],
  babelPlugins: ['typescript'],
  batch: 100
}
```

### Arguments

- `entry (String)` — path to the package index file. relative to the package directory.
- `extensions (Array<string>)` — list of file extensions to be considered during the search.
- `exclude (Array<string>)` — list of directories that will be excluded when searching for imports.
- `babelPlugins (Array<string>)` — list of babel plugins that will be used when parsing files.
- `batch (Number)` — number of files to be traversed in parallel. Changing the value may speed up or slow down the script. Choose the value yourself.

## CLI

Allows to override the config values for package.

### `--entry, -e`

```diff
    "scripts": {
      "build": "webpack ./webpack.config.js",
-     "check-exports": "pure-index",
+     "check-exports": "pure-index --entry ./src/index.ts",
      "test": "vitest"
    }
```

### `--extensions, -x`

```diff
    "scripts": {
      "build": "webpack ./webpack.config.js",
-     "check-exports": "pure-index",
+     "check-exports": "pure-index --extensions js,jsx,ts,tsx",
      "test": "vitest"
    }
```

### `--exclude, -i`

```diff
    "scripts": {
      "build": "webpack ./webpack.config.js",
-     "check-exports": "pure-index",
+     "check-exports": "pure-index --exclude .cache,www/assets",
      "test": "vitest"
    }
```

### `--babel-plugins, -p`

```diff
    "scripts": {
      "build": "webpack ./webpack.config.js",
-     "check-exports": "pure-index",
+     "check-exports": "pure-index --babel-plugins typescript,classPrivateProperties",
      "test": "vitest"
    }
```

### `--batch, -b`

```diff
    "scripts": {
      "build": "webpack ./webpack.config.js",
-     "check-exports": "pure-index",
+     "check-exports": "pure-index --batch 500",
      "test": "vitest"
    }
```

### `--collect-usages, -u`

Outputs a list of all unique uses of the package.

```sh
npx pure-index --collect-usages my-package
npx pure-index -u my-package

npx pure-index --collect-usages react-spring
npx pure-index -u react-spring
```

Useful if the package index file contains `export *` syntax. Or to search for all uses of an external package. [More info](#export-)

## Tips

- Use [knip](https://github.com/webpro/knip) or [ts-prune](https://github.com/nadeesha/ts-prune) to clean up unused code inside packages

## Explanation

### How It Works

In fact, the task is to compare all exports and imports of the package. Anything not imported but exported are unused exports.

#### Algorithm

1. collect all package exports into _exports Set_
2. traverse all files where package import may occur
3. if import is found, remove it from _exports Set_
4. if the size of exports _exports Set_ became equal to 0, then exit with success
5. if _exports Set_ size is not equal to 0, then exit with an error

### How It Optimized

1. file reading is divided into batches
2. file is not immediately converted to AST. First the import of the package is searched for in the file. _createReadStream_ is used
3. there is an instant exit with success as soon as the size of _exports Set_ is equal to zero

## Limitations

### export \*

Pure Index when getting a list of exports does not parse `export *` to find out what is exported from there. For projects with this syntax, it may result in an inability to use the library. But Pure Index can help with replacing `export *`. Just run it with the [--collect-usages flag](#--collect-usages--u) and replace `export *` with named exports.
