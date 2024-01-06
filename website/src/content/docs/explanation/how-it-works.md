---
title: How Does It Work
description: How Pure Index works
---

The task is to compare all exports and imports of the package. Anything not imported but exported is an unused export.

#### Algorithm

1. collect all package exports into _exports Set_
2. traverse all files where package import may occur
3. if the import is found, remove it from _exports Set_
4. if the size of the _exports Set_ became equal to 0, then exit with success
5. if the _exports Set_ size is not equal to 0, then exit with an error

### How It Optimized

1. file reading is divided into batches
2. file is not immediately converted to AST. First the import of the package is searched for in the file. _createReadStream_ is used
3. there is an instant exit with success as soon as the size of _exports Set_ is equal to zero
4. [swc](https://swc.rs/) is used to parse the AST
5. [fdir](https://thecodrr.github.io/fdir/) is used as project crawler
