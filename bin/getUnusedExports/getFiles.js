import { execSync } from 'node:child_process'
import { join } from 'node:path'
import FastGlob from 'fast-glob'

const getRepoRoot = () =>
  execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim()

/**
 * @param {{
 *   config: {
 *      exclude: Set<string>,
 *   },
 *   pkg: {
 *      name: string,
 *      path: string
 *   },
 * }}
 *
 * @returns {Promise<Array.<string>>}
 */
const getFiles = ({ config, pkg }) => {
  const repoRoot = getRepoRoot()
  const source = join(repoRoot, '**', '*.{ts,tsx}')
  const ignore = [
    ...[...config.exclude].map(x => join('**', x, '**')),
    join(pkg.path, '**')
  ]

  return FastGlob(source, { ignore })
}

export { getFiles }
