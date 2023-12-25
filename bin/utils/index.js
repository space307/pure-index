import { join } from 'node:path'
import fs from 'node:fs/promises'
import { createSpinner } from 'nanospinner'
import pc from 'picocolors'

const { bgRed, bold } = pc

const readFile = async filePath =>
  await fs.readFile(filePath, { encoding: 'utf-8' })

const readJSON = async filePath =>
  JSON.parse(await readFile(join(process.cwd(), filePath)))

const printError = text =>
  process.stdout.write(`\n${bold(bgRed(' Failed '))} ${text}\n\n`)

const createStatusAPI = ({ pkg }) => {
  const spinner = createSpinner(
    `I'm checking exports from the ${pkg.name} package`
  )

  const succeed = () => {
    spinner.success()
    process.exit(0)
  }

  const failed = ({ msg, exports }) => {
    spinner.error()
    printError(msg)

    if (exports) {
      process.stdout.write(`${JSON.stringify([...exports], undefined, 2)} \n\n`)
    }

    process.exit(1)
  }

  return { succeed, failed }
}

export { readFile, readJSON, createStatusAPI }
export { ObservableSet } from './observableSet.js'
