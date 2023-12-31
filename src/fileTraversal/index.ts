import { processBatch } from './processBatch'
import { getFiles } from './getFiles'
import type { Config } from 'getConfig'
import type { Cmd, Pkg } from 'shared'

type Params = {
  pkg: Pkg
  config: Pick<Config, 'dir' | 'batch' | 'exclude' | 'extensions'>
  cmd: Cmd
}

const fileTraversal = async ({ config, pkg, cmd }: Params) => {
  const files = await getFiles({ config, pkg })
  const tokens = [`from '${pkg.name}'`, `from "${pkg.name}"`]
  let batch = []

  for (const file of files) {
    batch.push(file)

    if (batch.length >= config.batch) {
      await processBatch({ cmd, files: batch, pkg, tokens })
      batch = []
    }
  }

  if (batch.length > 0) {
    await processBatch({ cmd, files: batch, pkg, tokens })
  }
}

export { fileTraversal }
