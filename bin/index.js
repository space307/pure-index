#!/usr/bin/env node

import { collectUsages } from '../src/collectUsages.js'
import { getConfig } from '../src/getConfig.js'
import { baseFlow } from '../src/baseFlow.js'

const config = await getConfig()

if (config.collectUsages) {
  await collectUsages({ config })
}

await baseFlow({ config })
