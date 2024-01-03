---
title: How to precisely override a package's entry
description: How to precisely override a package's entry with Pure Index
---

Sometimes it may be necessary to precisely override the path to the package index file. For example, all packages have `./index.ts` and only one has `./src/index.tsx`.

This is easily done with the [`--entry`](/pure-index/intro/cli#command-line-flags) flag.

```diff title="Example"
    "scripts": {
-     "check-exports": "pure-index"
+     "check-exports": "pure-index --entry ./src/index.tsx"
    }
```
