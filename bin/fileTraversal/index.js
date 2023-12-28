import { processBatch } from './processBatch/index.js'
import { getFiles } from './getFiles.js'

/**
 * @param {{
 *   cmd: {function(_: string): void}
 *   config: {
 *      babelPlugins: Set<string>
 *      batch: {
 *        default: number
 *      }
 *      exclude: Set<string>
 *      extensions: Array<string>
 *   }
 *   pkg: {
 *      name: string
 *      path?: string
 *   }
 * }}
 *
 * @returns {Promise<Set.<string>>}
 */
const fileTraversal = async ({ config, pkg, cmd }) => {
  const files = await getFiles({ config, pkg })
  const tokens = [`from '${pkg.name}'`, `from "${pkg.name}"`]
  let batch = []

  for (const file of files) {
    batch.push(file)

    if (batch.length >= config.batch.default) {
      await processBatch({ config, cmd, files: batch, pkg, tokens })
      batch = []
    }
  }

  if (batch.length > 0) {
    await processBatch({ config, cmd, files: batch, pkg, tokens })
  }
}

export { fileTraversal }
