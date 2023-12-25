import { execSync } from 'node:child_process'
import { join } from 'node:path'
import FastGlob from 'fast-glob'

import { getFilesWithImport } from './getFilesWithImport.js'
import { getSpecifiers } from './getSpecifiers.js'

const getRepoRoot = () =>
  execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim()

/**
 * @param {{
 *   config: {
 *      exclude: Set<string>,
 *      babelPlugins: Set<string>,
 *   },
 *   pkg: {
 *      name: string,
 *      path: string
 *   },
 * }}
 *
 * @returns {Promise<Set.<string>>}
 */
const getImports = async ({ config, pkg }) => {
  const repoRoot = getRepoRoot()
  const source = join(repoRoot, '**', '*.{ts,tsx}')
  const ignore = [
    ...[...config.exclude].map(x => join('**', x, '**')),
    join(pkg.path, '**')
  ]

  const entries = await FastGlob(source, { ignore })
  const files = await getFilesWithImport({ entries, pkg })

  const specifiers = []

  for (const file of files) {
    const fileSpecifiers = await getSpecifiers({ file, pkg, config })

    specifiers.push(fileSpecifiers)
  }

  return new Set(specifiers.flat())
}

export { getImports }
