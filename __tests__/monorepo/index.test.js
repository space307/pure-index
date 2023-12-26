import cp from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { expect, it, test } from 'vitest'

const exec = promisify(cp.exec)

const filename = importMeta =>
  importMeta.url ? fileURLToPath(importMeta.url) : ''

const dirname = importMeta => path.dirname(filename(importMeta))

test.each([['package-a'], ['package-b'], ['package-c']])(
  'run check-exports in %s',
  async name => {
    const prefix = path.join(dirname(import.meta), 'packages', name)

    try {
      const { stdout, stderr } = await exec(
        `npm -prefix ${prefix} run check-exports`
      )
      expect(stdout).toMatchSnapshot()
      expect(stderr).toMatchSnapshot()
    } catch (e) {
      expect(e.stdout).toMatchSnapshot()
    }
  }
)
