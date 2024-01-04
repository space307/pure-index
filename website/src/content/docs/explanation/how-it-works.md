---
title: How It Works
description: How Pure Index works
---

In fact, the task is to compare all exports and imports of the package. Anything not imported but exported are unused exports.

#### Algorithm

1. collect all package exports into _exports Set_
2. traverse all files where package import may occur
3. if import is found, remove it from _exports Set_
4. if the size of exports _exports Set_ became equal to 0, then exit with success
5. if _exports Set_ size is not equal to 0, then exit with an error

### How It Optimized

1. file reading is divided into batches
2. file is not immediately converted to AST. First the import of the package is searched for in the file. _createReadStream_ is used
3. there is an instant exit with success as soon as the size of _exports Set_ is equal to zero
4. [swc](https://swc.rs/) is used to parse the AST
