import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from 'vitest';

import { getExports } from '../index.js';

test('getExports', async () => {
  const result = await getExports({
    pkg: {
      name: '_',
      path: join(fileURLToPath(import.meta.url), '..', 'file.ts'),
    },
    config: {
      parserConfig: { syntax: 'typescript' },
    },
  });

  expect([...result]).toStrictEqual([
    'aFn',
    'Foo',
    'fn2',
    'b',
    'createEvent',
    'Event',
    'cReAtEsToRe',
    'Store',
    'EFFECT',
    'fn',
    'boba',
    'bFn',
    'i',
    'ba',
    'def',
  ]);
});
