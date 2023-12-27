#!/usr/bin/env node

import { getConfig } from './getConfig.js'
import { main } from './main.js'

const config = await getConfig()

if (config.collectUsages) {
  process.exit(0)
}

await main({ config })
