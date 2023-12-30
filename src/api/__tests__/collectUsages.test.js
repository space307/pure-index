import { join } from 'node:path'
import { expect, test } from 'vitest'

import { collectUsages } from '../collectUsages.js'
import { Result } from '../../utils/index.js'

test.each([
  ['package-a', Result.Ok({ usages: new Set(['T', 'Value']) })],
  ['package-b', Result.Ok({ usages: new Set(['Component']) })],
  ['package-c', Result.Err({ usages: new Set() })],
  ['package-d', Result.Ok({ usages: new Set(['getRoot', 'unusedFn']) })]
])('collect usages js api for %s', async (name, result) => {
  const usages = await collectUsages(name, [
    {
      dir: join(process.cwd(), '..')
    }
  ])

  expect(usages).toStrictEqual(result)
})
