#!/usr/bin/env node

import { fileTraversal } from './fileTraversal/index.js'
import { getConfig } from './getConfig.js'
import { main } from './main.js'

const config = await getConfig()

if (config.collectUsages) {
  const usages = new Set()

  await fileTraversal({
    config,
    pkg: { name: config.collectUsages, path: '' },
    cmd: usages.add.bind(usages)
  })

  console.log(usages)

  process.exit(0)
}

await main({ config })
