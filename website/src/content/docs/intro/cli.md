---
title: Command Line Interface
description: Pure Index Command Line Interface Intro
---

Pure Index should typically be used from the command line. You can provide an optional [configuration file](/pure-index/reference/configuration) to simplify command line usage and enable advanced functionality.

## Commands

### pure-index

Start Pure Index in the current directory.

```sh
pure-index
```

## Command line flags

Calling the Pure Index with flags allows you to override the [configuration](/pure-index/reference/configuration) or change its behavior.

<!-- prettier-ignore -->
| <div style="width:270px">property</div> |                                                   |
| --------------------------------------- | ------------------------------------------------- |
| `--entry, -e <path>`                    | Overrides the package entry                       |
| `--collect-usages, -u <pkg-name>`           | Outputs a list of unique package uses. It is helpful if the package index file contains `export *` syntax. Or to search for all uses of an external package. [More info](/pure-index/explanation/limitations) |
| `--help`                                | Display available CLI options                     |

### Example

```sh
pure-index --entry ./src/index.tsx

pure-index -u @my/ui-kit
```
