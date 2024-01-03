import { readFile } from 'node:fs/promises';
import pc from 'picocolors';

import type { ObservableSet } from './observableSet.js';

const { bgRed, bold } = pc;

const readJSON = async (filePath: string) => JSON.parse(await readFile(filePath, { encoding: 'utf-8' }));

const printSet = (x: Set<unknown>) => process.stdout.write(`${JSON.stringify([...x], undefined, 2)} \n\n`);

const printError = (opts: { text: string; set?: ObservableSet }) => {
  process.stdout.write(`\n${bold(bgRed(' Failed '))} ${opts.text}\n\n`);

  if (opts.set) {
    printSet(opts.set);
  }
};

const Ok = <T>(val: T) => ({ ok: true, val }) as const;

const Err = <E>(err: E) => ({ ok: false, err }) as const;

type Result<T, E> = ReturnType<typeof Ok<T>> | ReturnType<typeof Err<E>>;

type Pkg = {
  name: string;
  path: string;
};

type NonEmptyArray<T> = [T, ...T[]];
type Cmd = (_: string) => unknown;

export { readJSON, printError, Ok, Err, printSet };
export { getRepoRoot } from './getRepoRoot.js';
export { ObservableSet } from './observableSet.js';
export { createSpinner } from 'nanospinner';
export type { Pkg, NonEmptyArray, Result, Cmd };
