---
title: Configuration
description: Pure Index Configuration
---

Pure Index will read your root `.pure-index.json` when it is present.

All options are not required.

```json title=".pure-index.json"
{
  "entry": "src/index.ts",
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

## Options

### entry

- **Type**: `string`
- **Default**: `src/index.ts`

Path to the package index file. Relative to the package directory.

### extensions

- **Type**: `string[]`
- **Default**: `['ts', 'tsx']`

List of file extensions to be considered during the search.

### exclude

- **Type**: `string[]`
- **Default**: `['node_modules']`

List of directories that will be excluded when searching for imports.

### parserConfig

- **Type**: `object`
- **Default**: `{"syntax": "typescript", "tsx": true}`

Object with <a href="https://swc.rs/docs/configuration/compilation#jscparser" target="_blank">swc parser parameters</a>

### dir

- **Type**: `string`
- **Default**: `repository root`

Path to the directory where imports should be searched for.

### batch

- **Type**: `number`
- **Default**: `200`

Number of files to be traversed in parallel. Changing the value may speed up or slow down the script. Choose the value yourself.
