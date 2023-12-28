import { join } from 'node:path'
import { expect, test } from 'vitest'

import { exec } from './exec.js'

test.each([['package-a'], ['package-b'], ['package-c']])(
  '--collect-usages in %s',
  async name => {
    try {
      const { stdout, stderr } = await exec({
        cmd: `node ./bin/index.js --collect-usages ${name}`,
        path: process.cwd(),
        noPrefix: true
      })

      expect(stdout).toMatchSnapshot()
      expect(stderr).toMatchSnapshot()
    } catch (e) {
      expect(e.stdout).toMatchSnapshot()
    }
  }
)
