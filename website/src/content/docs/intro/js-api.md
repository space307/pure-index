---
title: JavaScript API
---

Pure Index provides a JavaScript API which is usable from Node.js. You only have to use this if the use of Pure Index goes beyond the monorepository.

:::tip
It is most convenient to use them on CI where you can clone all the repositories of interest and run the script.
:::

## findUnusedExports

This function allows you to find all unused package exports by checking imports in different repositories.
Function call must come from the repository that contains the package being tested.

### Formulae

```ts
const result = await findUnusedExports(entry, repositories);
```

### Arguments

#### entry

- **Type**: `string`

Path to the package index file. Relative to the package directory.

#### repositories

- **Type**: `Item[]`

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

The description of each field can be found in the [configuration section](/pure-index/reference/configuration)

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

## Example

```js
import { findUnusedExports } from 'pure-index';

const result = await findUnusedExports('./src/index.ts', [
  {
    dir: '/Users/me/my-awesome-repo',
    exclude: ['build'],
  },
  {
    dir: '/Users/me/my-another-awesome-repo',
  },
]);

if (!result.ok) {
  process.stout.write(result.err.reason);
  process.stout.write(JSON.stringify(result.err.exports, undefined, 2));
  process.exit(1);
}

process.exit(0);
```

## collectUsages
