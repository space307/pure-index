import { join } from 'node:path'
import { fdir } from 'fdir'

const formattedExtensions = list =>
  list.reduce((acc, ext) => acc + (acc ? ',' : '') + ext, '')

/**
 * @param {{
 *   config: {
 *      exclude: Set<string>
 *      extensions: Array<string>
 *      dir: string
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
  const source = join('**', `*.{${formattedExtensions(config.extensions)}}`)

  const files = new fdir()
    .exclude(dirName => excludeRegExp.test(dirName))
    .globWithOptions([source], { dot: false })
    .withFullPaths()
    .crawl(config.dir)
    .sync()

  return files
}

export { getFiles }
