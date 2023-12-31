import fs from 'node:fs/promises'
import pc from 'picocolors'

import type { ObservableSet } from './observableSet'

const { bgRed, bold } = pc

const isNil = <T>(x: T | undefined | null): x is undefined | null =>
  x === null || x === undefined
const notNil = <T>(x: T): x is Exclude<typeof x, undefined | null> => !isNil(x)

const readFile = async (filePath: string) =>
  await fs.readFile(filePath, { encoding: 'utf-8' })

const readJSON = async (filePath: string) =>
  JSON.parse(await readFile(filePath))

const printError = (opts: { text: string; set?: ObservableSet }) => {
  process.stdout.write(`\n${bold(bgRed(' Failed '))} ${opts.text}\n\n`)

  if (notNil(opts.set)) {
    process.stdout.write(`${JSON.stringify([...opts.set], undefined, 2)} \n\n`)
  }
}

const Ok = <T>(val: T) => ({ ok: true, val }) as const

const Err = <E>(err: E) => ({ ok: false, err }) as const

type Result<T, E> = ReturnType<typeof Ok<T>> | ReturnType<typeof Err<E>>

type Pkg = {
  name: string
  path: string
}

type NonEmptyArray<T> = [T, ...T[]]

export { readFile, readJSON, printError, notNil, Ok, Err }
export { getRepoRoot } from './getRepoRoot'
export { ObservableSet } from './observableSet'
export { createSpinner } from 'nanospinner'
export type { Pkg, NonEmptyArray, Result }
