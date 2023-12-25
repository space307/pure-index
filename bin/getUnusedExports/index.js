import { findImport } from './findImport.js'
import { getFiles } from './getFiles.js'
import { filterExports } from './filter.js'

/**
 * @param {{
 *   config: {
 *      exclude: Set<string>,
 *      babelPlugins: Set<string>,
 *      filesBatchSize: number
 *   },
 *   pkg: {
 *      name: string,
 *      path: string
 *   },
 *   exports: Set<string>
 * }}
 *
 * @returns {Promise<Set.<string>>}
 */
const getUnusedExports = async ({ config, pkg, exports }) => {
  const tokens = [`from '${pkg.name}'`, `from "${pkg.name}"`]
  const files = await getFiles({ config, pkg })

  for (let i = 0; i < files.length; i += config.filesBatchSize) {
    const batch = files.slice(i, i + config.filesBatchSize)

    const filesPromise = batch.map(async file => {
      const found = await findImport({ file, tokens })
      return found ? file : null
    })

    const filterPromise = (await Promise.all(filesPromise))
      .filter(x => x !== null)
      .map(file => filterExports({ file, pkg, config, exports }))

    await Promise.all(filterPromise)
  }

  return exports
}

export { getUnusedExports }
