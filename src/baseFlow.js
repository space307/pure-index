import { getExports } from './getExports.js'
import { fileTraversal } from './fileTraversal/index.js'
import { Result } from './utils/index.js'

const baseFlow = async ({ pkg, config, onEmpty }) => {
  const exports = await getExports({ config, pkg })
  const originalExportsSize = exports.size

  return new Promise(async resolve => {
    // immediate termination
    exports.onEmpty(() => {
      resolve(Result.Ok({ exports }))
    })

    if (originalExportsSize === 0) {
      resolve(Result.Err({ reason: 'no_exports', exports }))
    }

    await fileTraversal({ config, pkg, cmd: exports.delete.bind(exports) })

    if (exports.size === originalExportsSize) {
      resolve(Result.Err({ reason: 'no_imports', exports }))
    }

    resolve(Result.Err({ reason: 'unused_exports', exports }))
  })
}

export { baseFlow }
