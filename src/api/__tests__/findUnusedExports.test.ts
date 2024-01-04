import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect } from 'vitest';

import { findUnusedExports } from '../findUnusedExports.js';

const monorepoPath = join(dirname(fileURLToPath(import.meta.url)), 'monorepo');

test.each([
  [{ name: 'package-a', entry: 'index.ts' }, { exports: [] }],
  [
    { name: 'package-b', entry: 'index.tsx' },
    { exports: ['Component'], reason: 'no_imports' },
  ],
  [{ name: 'package-c', entry: 'index.ts' }, { exports: [] }],
  [
    { name: 'package-d', entry: 'index.ts' },
    { exports: ['createDomain'], reason: 'unused_exports' },
  ],
  [
    { name: 'package-e', entry: 'index.ts' },
    { exports: [], reason: 'no_exports' },
  ],
])('find unused exports in %s', async ({ name, entry }, expected) => {
  const res = await findUnusedExports(
    {
      location: join(monorepoPath, name),
      entry,
    },
    [
      {
        dir: monorepoPath,
      },
    ],
  );

  if (res.ok) {
    expect([...res.val.exports]).toEqual(expected.exports);
  } else {
    expect([...res.err.exports]).toEqual(expected.exports);
    // @ts-expect-error
    expect(res.err.reason).toEqual(expected.reason);
  }
});
