import { join } from 'node:path'
import { expect, test } from 'vitest'

import { exec } from '../exec.js'

test.each([['package-a'], ['package-b'], ['package-c']])(
  'run check-exports in %s',
  async name => {
    try {
      const { stdout, stderr } = await exec({
        cmd: 'npm run check-exports',
        path: join('monorepo', 'packages', name)
      })
      expect(stdout).toMatchSnapshot()
      expect(stderr).toMatchSnapshot()
    } catch (e) {
      expect(e.stdout).toMatchSnapshot()
    }
  }
)
