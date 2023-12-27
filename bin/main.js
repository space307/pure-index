import { getExports } from './getExports.js'
import { getUnusedExports } from './getUnusedExports/index.js'
import { createStatusAPI, readJSON } from './utils/index.js'

/**
 * @param {{
 *   config: {
 *      entry: string
 *      exclude: Set<string>
 *      babelPlugins: Set<string>
 *      batch: {
 *        default: number
 *      }
 *   },
 * }}
 *
 * @returns {Promise<void>}
 */
const main = async ({ config }) => {
  const { name } = await readJSON('package.json')
  const pkg = { name, path: process.cwd() }
  const statusApi = createStatusAPI({ pkg })
  const exports = await getExports({ config, pkg })
  const originalExportsSize = exports.size

  exports.onEmpty(statusApi.succeed)

  if (originalExportsSize === 0) {
    statusApi.failed({
      msg: `Nothing is exported from ${pkg.name}. Remove it.`
    })
  }

  await getUnusedExports({ config, pkg, cmd: exports.delete.bind(exports) })

  if (exports.size === 0) {
    statusApi.succeed()
  }

  if (exports.size === originalExportsSize) {
    statusApi.failed({
      msg: `Nothing is imported from ${pkg.name}. Remove it.`
    })
  }

  statusApi.failed({
    msg: `Unused exports in ${pkg.name} package found`,
    exports
  })
}

export { main }
