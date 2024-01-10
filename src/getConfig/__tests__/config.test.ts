import { expect, test, vi } from 'vitest';

import { getConfig, BASE_CONFIG } from '../index.js';

test('default value', async () => {
  vi.mock('lilconfig', () => ({
    lilconfig: () => ({
      search: () => ({
        config: {
          batch: 500,
          entry: 'src/index.ts',
          exclude: ['**/build/**'],
          extensions: ['.js', '.jsx'],
          dir: 'dir-from-config',
        },
      }),
    }),
  }));

  const config = await getConfig();

  expect(config).toStrictEqual({
    ...BASE_CONFIG,
    batch: 500,
    entry: 'src/index.ts',
    extensions: ['.js', '.jsx'],
    exclude: [...BASE_CONFIG.exclude, '**/build/**'],
    dir: 'dir-from-config',
  });

  vi.resetAllMocks();
});
