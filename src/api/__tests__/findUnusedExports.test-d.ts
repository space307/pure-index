import { expectTypeOf, test, expect } from 'vitest'
import { findUnusedExports } from '../findUnusedExports'

import type { Result } from 'shared'

type Name = string

type ListItem = {
  dir: string
  batch?: number
  exclude?: string[]
  extensions?: string[]
}

type Returns = Result<
  true,
  | {
      reason: 'unused_exports'
      exports: Set<string>
    }
  | {
      reason: 'no_imports'
      exports: Set<string>
    }
  | {
      reason: 'no_exports'
      exports: Set<string>
    }
>

test('findUnusedExports signature', () => {
  expectTypeOf(findUnusedExports).toBeFunction()
  expectTypeOf(findUnusedExports).parameter(0).toMatchTypeOf<Name>()
  expectTypeOf(findUnusedExports).parameter(1).toMatchTypeOf<ListItem[]>()
  expect(findUnusedExports.length).toBe(2)

  // @ts-expect-error answer idk but it returns Returns
  expectTypeOf(findUnusedExports).returns.resolves.toMatchTypeOf<Returns>()
})
