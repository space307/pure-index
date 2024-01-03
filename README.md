# 🌿 Pure Index

Pure Index is utility for packages. It helps to find all unused exports or collect used imports of a package. For any local repository.

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

Pure Index can be used either through a command line interface with an optional configuration file, or else through its JavaScript API.

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

It may be necessary to configure Pure Index.

## Config

Pure Index supports three ways to define config.

1. `.pure-index.json` config file:

```json
{
  "entry": "index.ts",
  "exclude": ["node_modules"],
  "extensions": ["ts", "tsx"],
  "dir": "my-path",
  "batch": 100
}
```

<!-- Use the `pure-index` call to search within a monorepo and JS API to search across repositories. -->

<!-- ## Monorepos

## Various repositories

## How to

### Find unused exports within a monorepo

### Collect usages within a monorepo

### Find unused exports in various repositories

### Collect usages in various repositories -->
