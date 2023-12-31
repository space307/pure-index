import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'

import { getExports } from '../'

test('getExports', async () => {
  const result = await getExports({
    pkg: {
      name: '_',
      path: join(fileURLToPath(import.meta.url), '..', 'pkg', 'index.ts')
    }
  })

  expect([...result]).toStrictEqual([
    'aFn',
    'Foo',
    'fn2',
    'F',
    'Truthly',
    'iDeNtItY',
    'Falsy',
    'NIIIIIL',
    'fn',
    'boba',
    'bFn'
  ])
})
