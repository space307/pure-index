---
title: JavaScript API
description: Pure Index JavaScript API Intro
---

Pure Index provides a JavaScript API which is usable from Node.js. You only have to use this if the use of Pure Index goes beyond the monorepository.

:::tip
It is most convenient to use them on CI where you can clone all the repositories of interest and run the script.
:::

## findUnusedExports

This function allows you to find all unused package exports by checking imports in different repositories.

### Formulae

```ts
const result = await findUnusedExports({ entry, location }, repositories);
```

### Arguments

#### entry

- **Type**: `string`
- **Required**: `true`

Path to the package index file. Relative to the package location.

#### location

- **Type**: `string`
- **Required**: `false`
- **Default**: `''`

Path to the directory containing `package.json` of the package. Relative to the directory of the script call.

#### repositories

- **Type**: `Item[]`
- **Required**: `true`

List of repositories where to look for package imports.

```ts title="Item"
type Item = {
  dir: Config['dir']; // full path to the repository
  batch?: Config['batch'];
  exclude?: Config['exclude'];
  extensions?: Config['extensions'];
  parserConfig?: Config['parserConfig'];
};
```

The description of each field can be found in the [configuration section](/pure-index/reference/configuration).
Values for optional parameters will be taken from `.pure-index.json` or by default.

:::caution
`Item['dir']` should contains full path to the repository
:::

### Returns

Promise with `Result` object.

```ts
type Result =
  | {
      ok: true;
      val: { exports: Set<void> };
    }
  | {
      ok: false;
      err: {
        exports: Set<string>;
        reason: 'no_exports' | 'no_imports' | 'unused_exports';
      };
    };
```

- if no unused exports were found, `result.ok = true`
- if unused exports were found, `result.ok = false`

### Example

```js
import { findUnusedExports } from 'pure-index';

const result = await findUnusedExports(
  {
    entry: './src/index.ts',
    // location: '../../', // or using `dirname(fileURLToPath(import.meta.url))`
  },
  [
    {
      dir: '/Users/me/my-awesome-repo',
      exclude: ['build'],
    },
    {
      dir: '/Users/me/my-another-awesome-repo',
    },
  ],
);

if (!result.ok) {
  process.stout.write(result.err.reason);
  process.stout.write(JSON.stringify(result.err.exports, undefined, 2));
  process.exit(1);
}

process.exit(0);
```

## collectUsages

This function allows you to collect all usages of the package in different repositories.
A function call can be made from anywhere.

### Formulae

```ts
const result = await collectUsages(name, repositories);
```

### Arguments

#### name

- **Type**: `string`
- **Required**: `true`

The name of the package to look for.

#### repositories

- **Type**: `Item[]`
- **Required**: `true`

List of repositories where to look for package imports.

```ts title="Item"
type Item = {
  dir: Config['dir']; // full path to the repository
  batch?: Config['batch'];
  exclude?: Config['exclude'];
  extensions?: Config['extensions'];
  parserConfig?: Config['parserConfig'];
};
```

The description of each field can be found in the [configuration section](/pure-index/reference/configuration).
Values for optional parameters will be taken from `.pure-index.json` or by default.

:::caution
`Item['dir']` should contains full path to the repository
:::

### Returns

Promise with `Result` object.

```ts
type Result =
  | {
      ok: true;
      val: { usages: Set<string> };
    }
  | {
      ok: false;
      err: { usages: Set<void> };
    };
```

- if imports were found, `result.ok = true`
- if no imports were found, `result.ok = false`

### Example

```js
import { findUnusedExports } from 'pure-index';

const result = await collectUsages('@my/ui-kit', [
  {
    dir: '/Users/me/my-awesome-repo',
    exclude: ['build'],
  },
  {
    dir: '/Users/me/my-another-awesome-repo',
  },
]);

if (result.ok) {
  process.stout.write(JSON.stringify(result.val.usages, undefined, 2));
  process.exit(0);
}

process.exit(1);
```
