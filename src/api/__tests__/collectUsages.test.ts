import path, { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect } from 'vitest';

import { collectUsages } from '../collectUsages.js';

const filename = (importMeta: ImportMeta) => (importMeta.url ? fileURLToPath(importMeta.url) : '');

const dirname = (importMeta: ImportMeta) => path.dirname(filename(importMeta));

test.each([
  ['package-a', ['reset', 'Store']],
  ['package-b', []],
  ['package-c', ['$list']],
  ['package-d', ['createStore']],
])('collect usages in %s', async (name, expected) => {
  const res = await collectUsages(name, [
    {
      dir: join(dirname(import.meta), 'monorepo'),
    },
  ]);

  if (res.ok) {
    expect([...res.val.usages]).toStrictEqual(expected);
  } else {
    expect([...res.err.usages]).toStrictEqual(expected);
  }
});
