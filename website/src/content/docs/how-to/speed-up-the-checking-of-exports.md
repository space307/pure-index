---
title: How to speed up the checking of exports
---

1. [Exclude](/pure-index/reference/configuration#exclude) all directories where your package cannot be found (dist, build, .cache, toolchain, etc).

2. If you have multiple packages inside a monorepo, use tools to run scripts in parallel and cache the result like <a href="https://nx.dev" target="_blank">nx</a>, <a href="https://turbo.build/repo" target="_blank">turborepo</a> or similar.

3. Customize the [batch](/pure-index/reference/configuration#batch) value for your project.
