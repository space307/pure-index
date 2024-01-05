---
title: How to speed up the checking of exports
---

1. Specify in [exclude](/pure-index/reference/configuration#exclude) all directories where your package cannot be found (dist, build, .cache, toolchain, etc).

2. If you have multiple packages inside a monorepository, use tools that can run scripts in parallels and cache the result. Like [nx](https://nx.dev)
