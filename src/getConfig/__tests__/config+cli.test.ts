import { expect, test, vi } from 'vitest';

import { getConfig, BASE_CONFIG } from '../index.js';

test('default value', async () => {
  vi.mock('lilconfig', () => ({
    lilconfig: () => ({
      search: () => ({
        config: {
          batch: 500,
          entry: 'src/index.ts',
          exclude: ['build'],
          extensions: ['.js', '.jsx'],
          dir: 'dir-from-config',
        },
      }),
    }),
  }));

  vi.mock('meow', () => ({
    default: vi.fn(() => ({
      flags: {
        entry: 'src/main.js',
        collectUsages: 'package-a',
      },
    })),
  }));

  const config = await getConfig();

  expect(config).toStrictEqual({
    ...BASE_CONFIG,
    batch: 500,
    collectUsages: 'package-a',
    entry: 'src/main.js',
    extensions: ['.js', '.jsx'],
    exclude: ['node_modules', 'build'],
    dir: 'dir-from-config',
  });

  vi.resetAllMocks();
});
