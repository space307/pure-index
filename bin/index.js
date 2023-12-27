#!/usr/bin/env node

import { collectUsages } from './collectUsages.js'
import { getConfig } from './getConfig.js'
import { main } from './main.js'

const config = await getConfig()

if (config.collectUsages) {
  await collectUsages({ config })
}

await main({ config })
