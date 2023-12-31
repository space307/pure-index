import { join } from 'node:path'
import { fdir } from 'fdir'

import type { Config } from 'getConfig'
import type { Pkg } from 'shared'

const formattedExtensions = (list: Config['extensions']) =>
  list.reduce((acc, ext) => acc + (acc ? ',' : '') + ext, '')

type Params = {
  config: Pick<Config, 'extensions' | 'exclude' | 'dir'>
  pkg: Pkg
}

const getFiles = async ({ config, pkg }: Params) => {
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
