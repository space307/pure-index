import { expect, test, mock, vi } from 'vitest'

import { getConfig } from '../../getConfig.js'
import { CONFIG } from './constants.js'

test('default value', async () => {
  vi.mock('meow', () => ({
    default: vi.fn(() => ({
      flags: {
        entry: 'src/index.tsx',
        extensions: 'js,jsx',
        collectUsages: 'package-a'
      }
    }))
  }))

  const config = await getConfig()

  expect(config).toStrictEqual({
    ...CONFIG,
    entry: 'src/index.tsx',
    extensions: ['.js', '.jsx'],
    collectUsages: 'package-a'
  })

  vi.resetAllMocks()
})
