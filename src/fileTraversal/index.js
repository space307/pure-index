import { processBatch } from './processBatch/index.js'
import { getFiles } from './getFiles.js'

const fileTraversal = async ({ config, pkg, cmd }) => {
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
