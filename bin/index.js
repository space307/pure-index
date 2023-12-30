#!/usr/bin/env node

import { collectUsages } from '../src/collectUsages.js'
import { getConfig } from '../src/getConfig.js'
import { baseFlow } from '../src/baseFlow.js'
import {
  printSet,
  printError,
  createSpinner,
  readJSON
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

const { name } = await readJSON('package.json')
const pkg = { name, path: config.entry }
const spinner = createSpinner(`Checking exports from the ${pkg.name} package`)

const result = await baseFlow({ pkg, config, onEmpty: spinner.success })

if (result.success) {
  spinner.success()
  process.exit(0)
}

spinner.error()

switch (result.error.reason) {
  case 'no_exports':
    printError(`Nothing is exported from ${pkg.name}. Remove it.`)
    break
  case 'no_imports':
    printError(`Nothing is imported from ${pkg.name}. Remove it.`)
    break
  case 'unused_exports':
    printError(`Unused exports in ${pkg.name} package found`)
    printSet(result.error.exports)
}

process.exit(1)
