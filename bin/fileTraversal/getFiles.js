import { execSync } from 'node:child_process'
import { join } from 'node:path'
import { fdir } from 'fdir'

const getRepoRoot = () =>
  execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim()

const formattedExtensions = list =>
  list.reduce((acc, ext) => acc + (acc ? ',' : '') + ext.slice(1), '')

/**
 * @param {{
 *   config: {
 *      exclude: Set<string>
 *      extensions: Array<string>
 *   }
 *   pkg: {
 *      name: string
 *      path?: string
 *   }
 * }}
 *
 * @returns {Array<string>}
 */
const getFiles = async ({ config, pkg }) => {
  if (pkg.path) {
    config.exclude.add(pkg.path)
  }

  const exclude = [...config.exclude]
    .map(item =>
      item.replace(/(^\/|\/$)/g, '').replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    )
    .join('|')
  const excludeRegExp = new RegExp(exclude)
  const repoRoot = getRepoRoot()
  const source = join(
    repoRoot,
    '**',
    `*.{${formattedExtensions(config.extensions)}}`
  )

  const files = new fdir()
    .exclude(dirName => excludeRegExp.test(dirName))
    .globWithOptions([source], { dot: false })
    .withFullPaths()
    .crawl(repoRoot)
    .sync()

  return files
}

export { getFiles }
