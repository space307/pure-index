---
title: How to precisely override a package's entry
description: How to precisely override a package's entry with Pure Index
---

Sometimes, it may be necessary to override the path to the package index file precisely. For example, all packages have `./src/index.ts` and only one has `./src/index.tsx`.

You can use the --entry flag to complete this task swiftly.

It's easy to do with the [`--entry`](/pure-index/intro/cli#command-line-flags) flag.

```diff title="Example"
    "scripts": {
-     "check-exports": "pure-index"
+     "check-exports": "pure-index --entry ./src/index.tsx"
    }
```
