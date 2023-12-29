import fs from 'node:fs/promises'
import { createSpinner } from 'nanospinner'
import pc from 'picocolors'

const { bgRed, bold } = pc

const readFile = async filePath =>
  await fs.readFile(filePath, { encoding: 'utf-8' })

const readJSON = async filePath => JSON.parse(await readFile(filePath))

const printError = text =>
  process.stdout.write(`\n${bold(bgRed(' Failed '))} ${text}\n\n`)

const printSet = set =>
  process.stdout.write(`${JSON.stringify([...set], undefined, 2)} \n\n`)

const createStatusAPI = ({ title }) => {
  const spinner = createSpinner(title)

  const succeed = (params = {}) => {
    const { set } = params

    spinner.success()

    if (set) {
      printSet(set)
    }

    process.exit(0)
  }

  const failed = ({ msg, set }) => {
    spinner.error()
    printError(msg)

    if (set) {
      printSet(set)
    }

    process.exit(1)
  }

  return { succeed, failed }
}

export { readFile, readJSON, createStatusAPI }
export { getRepoRoot } from './getRepoRoot.js'
export { ObservableSet } from './observableSet.js'
export { Result } from './result.js'
