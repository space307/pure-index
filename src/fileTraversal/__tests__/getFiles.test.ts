import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from 'vitest';

import { getFiles } from '../getFiles.js';

test('getExports', async () => {
  const dir = dirname(fileURLToPath(import.meta.url));

  const files = await getFiles({
    config: {
      extensions: ['ts'],
      exclude: new Set(['components']),
      dir,
    },
  });

  const result = files.map((x) => x.replace(dir, ''));

  expect([...result]).toStrictEqual(['/files/a.ts', '/files/b.ts', '/getFiles.test.ts', '/pkg/index.ts']);
});
