import { expectTypeOf, test, expect } from 'vitest'
import { collectUsages } from '../collectUsages'

import type { Result } from 'shared'

type Name = string

type ListItem = {
  dir: string
  batch?: number | undefined
  exclude?: string[]
  extensions?: string[]
}

type Returns = Result<{ usages: Set<string> }, { usages: Set<void> }>

test('collectUsages signature', () => {
  expectTypeOf(collectUsages).toBeFunction()
  expectTypeOf(collectUsages).parameter(0).toMatchTypeOf<Name>()
  expectTypeOf(collectUsages).parameter(1).toMatchTypeOf<ListItem[]>()
  expect(collectUsages.length).toBe(2)

  expectTypeOf(collectUsages).returns.resolves.toMatchTypeOf<Returns>()
})
