import { filterExports } from './filter.js'
import { findImport } from './findImport.js'

/**
 * @param {{
 *   config: {
 *      babelPlugins: Set<string>,
 *   },
 *   exports: Set<string>
 *   files: Array<string>,
 *   pkg: {
 *      name: string,
 *   },
 *   tokens: Array<string>,
 * }}
 *
 */
const processBatch = async ({ config, exports, files, pkg, tokens }) => {
  const filesPromise = files.map(async file => {
    const found = await findImport({ file, tokens })
    return found ? file : null
  })

  const filterPromise = (await Promise.all(filesPromise))
    .filter(x => x !== null)
    .map(file => filterExports({ config, exports, file, pkg }))

  await Promise.all(filterPromise)
}

export { processBatch }
