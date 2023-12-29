import { expect, test, mock, vi } from 'vitest'

import { getConfig } from '../../getConfig.js'
import { CONFIG } from './constants.js'

test('default value', async () => {
  vi.mock('../../utils/getRepoRoot.js', () => ({
    getRepoRoot: () => 'repo-root'
  }))

  const config = await getConfig()

  expect(config).toStrictEqual(CONFIG)
})
