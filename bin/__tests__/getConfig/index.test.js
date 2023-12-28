import { expect, test } from 'vitest'

import { getConfig } from '../../getConfig.js'
import { CONFIG } from './constants.js'

test('default value', async () => {
  const config = await getConfig()

  expect(config).toStrictEqual(CONFIG)
})
