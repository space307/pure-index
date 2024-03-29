import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from 'vitest';

import { traversal } from '../index.js';

test('traversal', async () => {
  const result = new Set<string>();

  await traversal({
    path: join(fileURLToPath(import.meta.url), '..', 'file.ts'),
    cmd: result.add.bind(result),
    pkg: { name: 'effector' },
    config: {
      parserConfig: { syntax: 'typescript' },
    },
  });

  expect([...result]).toStrictEqual([
    'createStore',
    'Event',
    'createEvent',
    'StoreValue',
    'Effect',
    'Unit',
    'Domain',
    'EffectError',
    'effector',
    'createDomain',
    'NoInfer',
    'UnitValue',
    'is',
    'forward',
  ]);
});
