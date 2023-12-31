import { join } from 'node:path'
import { expect, test } from 'vitest'

import { collectUsages } from '../collectUsages'
import { Ok, Err } from 'shared'

test.each([
  ['package-a', Ok({ usages: new Set(['T', 'Value']) })],
  ['package-b', Ok({ usages: new Set(['Component']) })],
  ['package-c', Err({ usages: new Set() })],
  ['package-d', Ok({ usages: new Set(['getRoot', 'unusedFn']) })]
])('collect usages js api for %s', async (name, result) => {
  const usages = await collectUsages(name, [
    {
      dir: join(process.cwd(), '..')
    }
  ])

  expect(usages).toStrictEqual(result)
})
