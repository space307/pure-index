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
          extensions: ['js', 'jsx'],
          dir: 'dir-from-config',
        },
      }),
    }),
  }));

  vi.mock('meow', () => ({
    default: vi.fn(() => ({
      flags: {
        entry: 'src/main.js',
        extensions: 'js,jsx,ts,tsx',
        collectUsages: 'package-a',
        exclude: 'biba,boba,.cache,www/assets,__tests__',
        dir: 'dir-from-cli',
      },
    })),
  }));

  const config = await getConfig();

  expect(config).toStrictEqual({
    ...BASE_CONFIG,
    batch: 500,
    collectUsages: 'package-a',
    entry: 'src/main.js',
    extensions: ['js', 'jsx', 'ts', 'tsx'],
    exclude: new Set(['node_modules', 'biba', 'boba', '.cache', 'www/assets', '__tests__']),
    dir: 'dir-from-cli',
  });

  vi.resetAllMocks();
});
