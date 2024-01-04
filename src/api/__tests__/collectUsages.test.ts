import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect } from 'vitest';

import { collectUsages } from '../collectUsages.js';

const monorepoPath = join(dirname(fileURLToPath(import.meta.url)), 'monorepo');

test.each([
  ['package-a', ['reset', 'Store']],
  ['package-b', []],
  ['package-c', ['$list']],
  ['package-d', ['createStore']],
  ['package-e', []],
])('collect usages in %s', async (name, expected) => {
  const res = await collectUsages(name, [
    {
      dir: monorepoPath,
    },
  ]);

  if (res.ok) {
    expect([...res.val.usages]).toStrictEqual(expected);
  } else {
    expect([...res.err.usages]).toStrictEqual(expected);
  }
});
