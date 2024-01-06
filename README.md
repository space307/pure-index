# 🌿 Pure Index

Pure Index is a tool for packages. It helps to clean your packages of unused exports with ease.<br />
And it’s also speedy ⚡️

## Motivation

We will use the `@my/ui-kit` package as an example.

```ts title="ui-kit/src/index.ts"
export { Button } from './components/button';
export { Text } from './components/text';

export { ThemeProvider, useTheme, type Theme } from './themes';
...
```

The number of exports increases over time. All of its exportable code requires support. But is all of it being used?

You can check this manually by just looping through the exports. It’s time-consuming, and there is a chance of error. What if multiple repositories use its code?

Let's automate this process!

## Installation

> You can use any package manager

```sh
npm install -D pure-index
```

## Quick Start

Pure Index can be used either through a [command line interface](https://space307.github.io/pure-index/intro/cli) with an optional [configuration file](https://space307.github.io/pure-index/reference/configuration) or its [JavaScript API](https://space307.github.io/pure-index/intro/js-api).

1. Add the `check-exports` script in the `package.json` of packages that require checking.

```diff
    "scripts": {
+     "check-exports": "pure-index"
    }
```

2. Run

```sh
npm run check-exports
```

3. Depending on the project, you may need to [configure](https://space307.github.io/pure-index/reference/configuration) Pure Index.

## Documentation

Visit [our documentation site](https://space307.github.io/pure-index) for additional information, guides, and API references.
