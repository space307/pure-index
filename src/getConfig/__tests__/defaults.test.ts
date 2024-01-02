import { expect, test, vi } from 'vitest';

import { getConfig, BASE_CONFIG } from '../index.js';

test('default value', async () => {
  vi.mock('../../shared/getRepoRoot', () => ({
    getRepoRoot: () => 'repo-root',
  }));

  const config = await getConfig();

  expect(config).toStrictEqual({ ...BASE_CONFIG, dir: 'repo-root' });
  vi.resetAllMocks();
});
