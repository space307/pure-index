# 🌿 Pure Index

Pure Index is utility for packages. It helps to clean your packages of unused exports with ease.

## Motivation

We will use the `@my/ui-kit` package as an example.

```ts title="ui-kit/index.ts"
export { Button } from './components/button';
export { Text } from './components/text';

export { ThemeProvider, useTheme, type Theme } from './themes';
...
```

All of its exportable code requires support. But is all of it actually being used?

You can check this manually by just looping through the exports. It's time consuming and there is a chance of error. What if it's code is used by multiple repositories?

Let's automate this process!

## Installation

> You can use any package manager

```sh
npm install -D @space307/pure-index
```

## Documentation

For additional information, guides and api reference visit [our documentation site](https://space307.github.io/pure-index)
