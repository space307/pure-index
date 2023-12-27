import { getExports } from './getExports.js'
import { getUnusedExports } from './getUnusedExports/index.js'
import { createStatusAPI, readJSON } from './utils/index.js'

/**
 * @param {{
 *   config: {
 *      entry: string,
 *      exclude: Set<string>,
 *      babelPlugins: Set<string>,
 *      batch: {
 *        default: number
 *      },
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
  const exportsSize = exports.size

  exports.onEmpty(statusApi.succeed)

  if (exportsSize === 0) {
    statusApi.failed({
      msg: `Nothing is exported from ${pkg.name}. Remove it.`
    })
  }

  const unusedExports = await getUnusedExports({ config, pkg, exports })

  if (unusedExports.size === 0) {
    statusApi.succeed()
  }

  if (unusedExports.size === exportsSize) {
    statusApi.failed({
      msg: `Nothing is imported from ${pkg.name}. Remove it.`
    })
  }

  statusApi.failed({
    msg: `Unused exports in ${pkg.name} package found`,
    exports: unusedExports
  })
}

export { main }
