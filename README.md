# Pure Index

Describe problem.

## Usage

## Config

Pure Index supports two ways to define config.

1. `.pure-index.json` config file:

```json
{
  "exclude": ["node_modules", "dist"],
  "indexFilePath": "./src/index.ts",
  "babelPlugins": ["typescript", "jsx"],
  "batch": {
    "default": 307
  }
}
```

2. or `pure-index` section in `package.json`:

```json
  "pure-index": {
    "exclude": ["node_modules", "dist"],
    "indexFilePath": "./src/index.ts",
    "babelPlugins": ["typescript", "jsx"],
    "batch": {
      "default": 307
    }
  }
```

### Arguments

- **exclude (Array<string>)** — list of directories that will be excluded when searching for imports. _Default_: _['node_modules']_
- `indexFilePath (String)` — path to the package index file. relative to the package directory. _Default_: _index.ts_
- `babelPlugins (Array<string>)` — list of babel plugins that will be used when parsing files. _Default_: _['typescript']_
- `batch.default (Number)` — number of files to be traversed in parallel. changing the value may speed up or slow down the script. choose the value yourself. _Default_: _100_

## Explanation

### How It Works

In fact, the task is to compare all exports and imports of the package. Anything not imported but exported are unused exports.

#### Base algorithm:

1. collect all package exports into _exports Set_
2. traverse all files where package import may occur
3. if import is found, remove it from _exports Set_
4. if the size of exports _exports Set_ became equal to 0, then exit with success
5. if _exports Set_ size is not equal to 0, then exit with an error

### How the algorithm is optimized

1. file reading is divided into batches
2. file is not immediately converted to AST. First the import of the package is searched for in the file. _createReadStream_ is used
3. there is an instant exit with success as soon as the size of _exports Set_ is equal to zero

## Limitations
