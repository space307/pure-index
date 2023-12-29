import { join } from 'node:path'

import { getExports } from './getExports.js'
import { fileTraversal } from './fileTraversal/index.js'
import { createStatusAPI, readJSON } from './utils/index.js'

/**
 * @param {{
 *   config: {
 *      babelPlugins: Array<string>
 *      batch: number
 *      entry: string
 *      exclude: Set<string>
 *      extensions: Array<string>
 *      dir: string
 *   },
 * }}
 *
 * @returns {Promise<void>}
 */
const baseFlow = async ({ config }) => {
  const { name } = await readJSON('package.json')
  const pkg = { name, path: config.entry }
  const statusApi = createStatusAPI({
    title: `Checking exports from the ${pkg.name} package`
  })
  const exports = await getExports({ config, pkg })
  const originalExportsSize = exports.size

  exports.onEmpty(statusApi.succeed)

  if (originalExportsSize === 0) {
    statusApi.failed({
      msg: `Nothing is exported from ${pkg.name}. Remove it.`
    })
  }

  await fileTraversal({ config, pkg, cmd: exports.delete.bind(exports) })

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
    set: exports
  })
}

export { baseFlow }
