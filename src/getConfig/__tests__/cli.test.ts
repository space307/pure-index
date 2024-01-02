import { expect, test, vi } from 'vitest';

import { getConfig, BASE_CONFIG } from '../index.js';

test('default value', async () => {
  vi.mock('../../shared/getRepoRoot', () => ({
    getRepoRoot: () => 'repo-root',
  }));

  vi.mock('meow', () => ({
    default: vi.fn(() => ({
      flags: {
        entry: 'src/index.tsx',
        collectUsages: 'package-a',
      },
    })),
  }));

  const config = await getConfig();

  expect(config).toStrictEqual({
    ...BASE_CONFIG,
    dir: 'repo-root',
    entry: 'src/index.tsx',
    collectUsages: 'package-a',
  });

  vi.resetAllMocks();
});
