---
title: Command Line Interface
---

## Commands

`pure-index`

Start Pure Index in the current directory.

```sh
pure-index
```

## Options

Calling the Pure Index with options allows you to override the [configuration](pure-index/reference/configuration) or change its behavior.

<!-- prettier-ignore -->
| <div style="width:250px">property</div> |                                                   |
| --------------------------------------- | ------------------------------------------------- |
| `--entry, -e <path>`                    | Overrides the package entry                       |
| `--collect-usages, -u <name>`           | Outputs a list of all unique uses of the package. Useful if the package index file contains `export *` syntax. Or to search for all uses of an external package. [More info](/pure-index/explanation/limitations) |
