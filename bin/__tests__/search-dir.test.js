import { join } from 'node:path'
import { expect, test } from 'vitest'

import { exec } from './monorepo/exec.js'

test('package-d', async () => {
  try {
    const { stdout, stderr } = await exec({
      cmd: 'npm run check-exports',
      path: '../package-d'
    })
    expect(stdout).toMatchSnapshot()
    expect(stderr).toMatchSnapshot()
  } catch (e) {
    expect(e.stdout).toMatchSnapshot()
  }
})

test('package-d unhappy', async () => {
  try {
    const { stdout, stderr } = await exec({
      cmd: 'npm run check-exports-unhappy',
      path: '../package-d'
    })
    expect(stdout).toMatchSnapshot()
    expect(stderr).toMatchSnapshot()
  } catch (e) {
    expect(e.stdout).toMatchSnapshot()
  }
})

test('package-d happy', async () => {
  try {
    const { stdout, stderr } = await exec({
      cmd: 'npm run check-exports-happy',
      path: '../package-d'
    })
    expect(stdout).toMatchSnapshot()
    expect(stderr).toMatchSnapshot()
  } catch (e) {
    expect(e.stdout).toMatchSnapshot()
  }
})
