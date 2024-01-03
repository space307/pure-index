---
title: How to collect package usages
---

:::tip
You can collect usages not only of your own packages, but also of any others. For example, [effector](https://effector.dev).

```sh
pure-index --collect-usages effector
```

:::

## In a monorepository

1. Run Pure Index with [`--collect-usages`](/pure-index/intro/cli#command-line-flags) flag

```sh title="Example"
pure-index --collect-usages @my/ui-kit
```

2. Depending on the project, you may need to [configure](/pure-index/reference/configuration) Pure Index.

## In different repositories

1. Use [collectUsages](/pure-index/intro/js-api#collectusages) function from [JavaScript API](/pure-index/intro/js-api).
