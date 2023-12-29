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
          extensions: ['js', 'jsx'],
          dir: 'dir-from-config'
        }
      })
    })
  }))

  const config = await getConfig()

  expect(config).toStrictEqual({
    ...CONFIG,
    babelPlugins: ['jsx'],
    batch: 500,
    entry: 'src/index.ts',
    extensions: ['js', 'jsx'],
    exclude: new Set([...CONFIG.exclude, 'build']),
    dir: 'dir-from-config'
  })

  vi.resetAllMocks()
})
