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

- `exclude (Array<string>)` — description. _Default_: `['node_modules']`
- `indexFilePath (String)` — description. _Default_: `index.ts`
- `babelPlugins (Array<string>)` — description. _Default_: `['typescript']`
- `batch.default (Number)` — description. _Default_: `100`

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
