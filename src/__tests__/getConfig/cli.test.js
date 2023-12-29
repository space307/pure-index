import { expect, test, mock, vi } from 'vitest'

import { getConfig } from '../../getConfig.js'
import { CONFIG } from './constants.js'

test('default value', async () => {
  vi.mock('meow', () => ({
    default: vi.fn(() => ({
      flags: {
        entry: 'src/index.tsx',
        extensions: 'js,jsx',
        collectUsages: 'package-a',
        batch: 1,
        babelPlugins: 'decorators-legacy,classPrivateProperties',
        exclude: 'biba,boba,.cache,www/assets,__tests__',
        dir: 'dir-from-cli'
      }
    }))
  }))

  const config = await getConfig()

  expect(config).toStrictEqual({
    ...CONFIG,
    entry: 'src/index.tsx',
    extensions: ['js', 'jsx'],
    collectUsages: 'package-a',
    batch: 1,
    babelPlugins: ['decorators-legacy', 'classPrivateProperties'],
    exclude: new Set([
      'node_modules',
      'biba',
      'boba',
      '.cache',
      'www/assets',
      '__tests__'
    ]),
    dir: 'dir-from-cli'
  })

  vi.resetAllMocks()
})
