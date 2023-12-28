import { findImport } from './findImport.js'
import { traversal } from './traversal.js'

/**
 * @param {{
 *   files: Array<string>
 *   cmd: {function(_: string): void}
 *   config: {
 *      babelPlugins: Set<string>
 *   }
 *   pkg: {
 *      name: string
 *   }
 *   tokens: Array<string>
 * }}
 *
 */
const processBatch = async ({ config, cmd, files, pkg, tokens }) => {
  const filesPromise = files.map(async file => {
    const found = await findImport({ file, tokens })
    return found ? file : null
  })

  const filterPromise = (await Promise.all(filesPromise))
    .filter(x => x !== null)
    .map(file => traversal({ config, cmd, file, pkg }))

  await Promise.all(filterPromise)
}

export { processBatch }
