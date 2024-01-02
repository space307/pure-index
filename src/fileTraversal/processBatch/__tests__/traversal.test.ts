import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from 'vitest';

import { traversal } from '../traversal.js';

test('traversal', async () => {
  const result = new Set<string>();

  await traversal({
    path: join(fileURLToPath(import.meta.url), '..', 'file.ts'),
    cmd: result.add.bind(result),
    pkg: { name: 'effector' },
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
    'NoInfer',
    'UnitValue',
    'is',
    'forward',
  ]);
});
