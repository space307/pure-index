#!/usr/bin/env node

import { getConfig } from './getConfig.js'
import { getUnusedExports } from './getUnusedExports/index.js'
import { main } from './main.js'

const config = await getConfig()

if (config.collectUsages) {
  const usages = new Set()

  await getUnusedExports({
    config,
    pkg: { name: config.collectUsages, path: '' },
    cmd: usages.add.bind(usages)
  })

  console.log(usages)

  process.exit(0)
}

await main({ config })
