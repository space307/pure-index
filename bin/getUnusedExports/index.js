import { execSync } from 'node:child_process'
import { join } from 'node:path'
import fg from 'fast-glob'

import { processBatch } from './processBatch/index.js'

const getRepoRoot = () =>
  execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim()

/**
 * @param {{
 *   cmd: {function(_: string): void}
 *   config: {
 *      exclude: Set<string>
 *      babelPlugins: Set<string>
 *      batch: {
 *        default: number
 *      },
 *   },
 *   pkg: {
 *      name: string
 *      path: string
 *   },
 * }}
 *
 * @returns {Promise<Set.<string>>}
 */
const getUnusedExports = async ({ config, pkg, cmd }) => {
  const tokens = [`from '${pkg.name}'`, `from "${pkg.name}"`]

  const repoRoot = getRepoRoot()
  const source = join(repoRoot, '**', '*.{ts,tsx}')
  const ignore = [
    ...[...config.exclude].map(x => join('**', x, '**')),
    join(pkg.path, '**')
  ]

  let batch = []

  for await (const entry of fg.stream(source, { ignore })) {
    batch.push(entry)

    if (batch.length >= config.batch.default) {
      await processBatch({ config, cmd, files: batch, pkg, tokens })
      batch = []
    }
  }

  if (batch.length > 0) {
    await processBatch({ config, cmd, files: batch, pkg, tokens })
  }
}

export { getUnusedExports }
