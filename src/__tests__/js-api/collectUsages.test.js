import { join } from 'node:path'
import { expect, test } from 'vitest'

import { collectUsages } from '../../index.js'

test.each([
  ['package-a', new Set(['T', 'Value'])],
  ['package-b', new Set(['Component'])],
  ['package-c', new Set()],
  ['package-d', new Set(['getRoot', 'unusedFn'])]
])('collect usages js api for %s', async (name, result) => {
  const usages = await collectUsages(name, [
    {
      dir: join(process.cwd(), '..')
    }
  ])

  expect(usages).toStrictEqual(result)
})
