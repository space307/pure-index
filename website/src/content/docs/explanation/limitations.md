---
title: Limitations
---

## export \*

Pure Index when getting a list of exports does not parse `export *` to find out what is exported from there. For projects with this syntax, it may result in an inability to use the library. But Pure Index can help with replacing `export *`. Just run it with the [--collect-usages flag](/pure-index/intro/cli) and replace `export *` with named exports.

## Dynamic Imports

At the moment Pure Index does not handle dynamic imports.
