import { processBatch } from './processBatch'
import { getFiles } from './getFiles'
import type { Config } from 'getConfig'

type Params = Omit<
  Parameters<typeof processBatch>[0],
  'config' | 'files' | 'tokens'
> & {
  config: Pick<
    Config,
    'babelPlugins' | 'dir' | 'batch' | 'exclude' | 'extensions'
  >
}

const fileTraversal = async ({ config, pkg, cmd }: Params) => {
  const files = await getFiles({ config, pkg })
  const tokens = [`from '${pkg.name}'`, `from "${pkg.name}"`]
  let batch = []

  for (const file of files) {
    batch.push(file)

    if (batch.length >= config.batch) {
      await processBatch({ config, cmd, files: batch, pkg, tokens })
      batch = []
    }
  }

  if (batch.length > 0) {
    await processBatch({ config, cmd, files: batch, pkg, tokens })
  }
}

export { fileTraversal }
