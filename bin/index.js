#!/usr/bin/env node

import { getConfig } from './getConfig.js'
import { getExports } from './getExports.js'
import { getImports } from './imports/index.js'
import { createSpinner, printError, readJSON } from './utils.js'

const config = await getConfig()

const { name } = await readJSON('package.json')
const pkg = { name, path: process.cwd() }

const spinner = createSpinner({ name: pkg.name })

const imports = await getImports({ config, pkg })

if (imports.size === 0) {
  spinner.error()
  printError(`Nothing is imported from ${pkg.name}. Remove it.`)
  process.exit(1)
}

const exports = await getExports({ config, pkg })

const unusedExports = [...exports].filter(element => !imports.has(element))

if (unusedExports.length === 0) {
  spinner.success()
  process.exit(0)
}

spinner.error()
printError(`Unused exports in ${pkg.name} package found`)
process.stdout.write(`${JSON.stringify(unusedExports, undefined, 2)} \n\n`)
process.exit(1)
