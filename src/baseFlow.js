import { getExports } from './getExports.js'
import { fileTraversal } from './fileTraversal/index.js'
import { Result } from './utils/index.js'

/**
 * @param {{
 *   config: {
 *      babelPlugins: Array<string>
 *      batch: number
 *      entry: string
 *      exclude: Set<string>
 *      extensions: Array<string>
 *      dir: string
 *   }
 *   pkg: {
 *      path: string
 *   }
 * }}
 */
const baseFlow = async ({ pkg, config, onEmpty }) => {
  const exports = await getExports({ config, pkg })
  const originalExportsSize = exports.size

  return new Promise(async resolve => {
    // immediate termination
    exports.onEmpty(() => {
      resolve(Result.Ok({ exports }))
    })

    if (originalExportsSize === 0) {
      resolve(Result.Err({ reason: 'no_exports' }))
    }

    await fileTraversal({ config, pkg, cmd: exports.delete.bind(exports) })

    if (exports.size === originalExportsSize) {
      resolve(Result.Err({ reason: 'no_imports' }))
    }

    resolve(Result.Err({ exports, reason: 'unused_exports' }))
  })
}

export { baseFlow }
