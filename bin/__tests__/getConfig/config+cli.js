import { expect, test, mock, vi } from 'vitest'

import { getConfig } from '../../getConfig.js'
import { CONFIG } from './constants.js'

test('default value', async () => {
  vi.mock('lilconfig', () => ({
    lilconfig: () => ({
      search: () => ({
        config: {
          babelPlugins: ['jsx'],
          batch: 500,
          entry: 'src/index.ts',
          exclude: ['build'],
          extensions: ['js', 'jsx']
        }
      })
    })
  }))

  vi.mock('meow', () => ({
    default: vi.fn(() => ({
      flags: {
        entry: 'src/main.js',
        extensions: 'js,jsx,ts,tsx',
        collectUsages: 'package-a'
      }
    }))
  }))

  const config = await getConfig()

  expect(config).toStrictEqual({
    ...CONFIG,
    babelPlugins: new Set([...CONFIG.babelPlugins, 'jsx']),
    batch: 500,
    collectUsages: 'package-a',
    entry: 'src/main.js',
    extensions: ['js', 'jsx', 'ts', 'tsx'],
    exclude: new Set([...CONFIG.exclude, 'build'])
  })

  vi.resetAllMocks()
})
