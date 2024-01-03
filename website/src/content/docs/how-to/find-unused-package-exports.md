---
title: How to find unused package exports
description: How to find unused package exports with Pure Index
---

## In a monorepository

1. Add the `check-exports` script in the `package.json` of package that needs to be checked

```diff
    "scripts": {
+     "check-exports": "pure-index"
    }
```

2. Run

```sh
npm run check-exports
```

3. Depending on the project, you may need to [configure](/pure-index/reference/configuration) Pure Index.

:::tip
Use [nx](https://nx.dev) (or any other monorepo manager) to run a script for checking multiple packages with a single command.

```bash title="Example"
nx run-many --target=check-usage --parallel=12
```

:::

## In different repositories

1. Use [findUnusedExports](/pure-index/intro/js-api#findunusedexports) function from [JavaScript API](/pure-index/intro/js-api).
