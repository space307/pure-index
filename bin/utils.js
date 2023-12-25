import path from 'node:path'
import fs from 'node:fs/promises'
import { createSpinner as _createSpinner } from 'nanospinner'
import pc from 'picocolors'

const { bgRed, bold } = pc

const readFile = async filePath =>
  await fs.readFile(filePath, { encoding: 'utf-8' })

const readJSON = async filePath =>
  JSON.parse(await readFile(path.join(process.cwd(), filePath)))

const createSpinner = ({ name }) =>
  _createSpinner(`I'm checking exports from the ${name} package`)

const printError = text =>
  process.stdout.write(`\n${bold(bgRed(' Failed '))} ${text}\n\n`)

export { readFile, readJSON, createSpinner, printError }
