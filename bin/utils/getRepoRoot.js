import { execSync } from 'node:child_process'

export const getRepoRoot = () =>
  execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim()
