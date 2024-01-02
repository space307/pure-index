import { expect, test, vi } from 'vitest';

import { getConfig, BASE_CONFIG } from '../index.js';

test('default value', async () => {
  vi.mock('meow', () => ({
    default: vi.fn(() => ({
      flags: {
        entry: 'src/index.tsx',
        extensions: 'js,jsx',
        collectUsages: 'package-a',
        exclude: 'biba,boba,.cache,www/assets,__tests__',
        dir: 'dir-from-cli',
      },
    })),
  }));

  const config = await getConfig();

  expect(config).toStrictEqual({
    ...BASE_CONFIG,
    entry: 'src/index.tsx',
    extensions: ['js', 'jsx'],
    collectUsages: 'package-a',
    exclude: new Set(['node_modules', 'biba', 'boba', '.cache', 'www/assets', '__tests__']),
    dir: 'dir-from-cli',
  });

  vi.resetAllMocks();
});
