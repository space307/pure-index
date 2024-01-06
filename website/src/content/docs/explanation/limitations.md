---
title: Limitations
description: Limitations of Pure Index
---

## export \*

When getting a list of exports, Pure Index does not parse `export *` to find out what is exported from there. For projects with this syntax, it may result in an inability to use the library. But Pure Index can help with replacing `export *`. Run it with the [`--collect-usages`](/pure-index/intro/cli/#command-line-flags) flag and replace `export *` with named exports.

## Dynamic Imports

At the moment, Pure Index does not handle dynamic imports.
