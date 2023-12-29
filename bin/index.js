#!/usr/bin/env node

import { collectUsages } from '../src/collectUsages.js'
import { getConfig } from '../src/getConfig.js'
import { baseFlow } from '../src/baseFlow.js'
import {
  createStatusAPI,
  printSet,
  printError,
  createSpinner
} from '../src/utils/index.js'

const config = await getConfig()

if (config.collectUsages) {
  const pkgName = config.collectUsages
  const spinner = createSpinner(`Collecting usages of ${pkgName}`)

  const result = await collectUsages({ config })

  if (result.success) {
    spinner.success()
    printSet(result.value.usages)
    process.exit(0)
  }

  spinner.error()
  printError(`Nothing is used from ${pkgName}. Remove it.`)
  process.exit(1)
}

await baseFlow({ config })
