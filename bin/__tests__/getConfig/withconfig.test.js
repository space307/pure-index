import { expect, test, mock, vi } from 'vitest'

import { getConfig } from '../../getConfig.js'
import { CONFIG } from './constants.js'

test('default value', async () => {
  vi.mock('lilconfig', () => ({
    lilconfig: () => ({
      search: () => ({
        config: {
          babelPlugins: ['jsx'],
          batch: { default: 500 },
          entry: 'src/index.ts',
          exclude: ['build'],
          extensions: ['.js', '.jsx']
        }
      })
    })
  }))

  const config = await getConfig()

  expect(config).toStrictEqual({
    ...CONFIG,
    babelPlugins: new Set([...CONFIG.babelPlugins, 'jsx']),
    batch: { default: 500 },
    entry: 'src/index.ts',
    extensions: ['.js', '.jsx'],
    exclude: new Set([...CONFIG.exclude, 'build'])
  })

  vi.resetAllMocks()
})
