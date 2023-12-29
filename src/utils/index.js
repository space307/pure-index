import fs from 'node:fs/promises'
import pc from 'picocolors'

const { bgRed, bold } = pc

const readFile = async filePath =>
  await fs.readFile(filePath, { encoding: 'utf-8' })

const readJSON = async filePath => JSON.parse(await readFile(filePath))

const printError = text =>
  process.stdout.write(`\n${bold(bgRed(' Failed '))} ${text}\n\n`)

const printSet = set =>
  process.stdout.write(`${JSON.stringify([...set], undefined, 2)} \n\n`)

export { readFile, readJSON, printSet, printError }
export { getRepoRoot } from './getRepoRoot.js'
export { ObservableSet } from './observableSet.js'
export { Result } from './result.js'
export { createSpinner } from 'nanospinner'
