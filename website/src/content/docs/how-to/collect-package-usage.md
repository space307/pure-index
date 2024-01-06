---
title: How to collect package usage
description: How to collect package usage with Pure Index
---

:::tip
You can collect usage from your and external packages — for example, an [effector](https://effector.dev).

```sh
pure-index --collect-usages effector
```

:::

## In a monorepo

1. Run Pure Index with the [`--collect-usages`](/pure-index/intro/cli#command-line-flags) flag

```sh title="Example"
pure-index --collect-usages @my/ui-kit
```

2. Depending on the project, you may need to [configure](/pure-index/reference/configuration) Pure Index.

## In different repositories

1. Use the [collectUsages](/pure-index/intro/js-api#collectusages) function from [JavaScript API](/pure-index/intro/js-api).
