import { getExports } from './getExports'
import { fileTraversal } from './fileTraversal'
import { Err, ObservableSet, Ok, type Result } from 'shared'

type FindUnusedExports = (
  _: Omit<Parameters<typeof fileTraversal>[0], 'cmd'>
) => Promise<
  Result<
    { exports: ObservableSet },
    | { reason: 'no_exports'; exports: ObservableSet }
    | { reason: 'no_imports'; exports: ObservableSet }
    | { reason: 'unused_exports'; exports: ObservableSet }
  >
>

const findUnusedExports: FindUnusedExports = async ({ pkg, config }) => {
  const exports = await getExports({ pkg })
  const originalExportsSize = exports.size

  return new Promise(async resolve => {
    // immediate termination
    exports.onEmpty(() => {
      resolve(Ok({ exports }))
    })

    if (originalExportsSize === 0) {
      resolve(Err({ reason: 'no_exports', exports }))
    }

    await fileTraversal({ config, pkg, cmd: exports.delete.bind(exports) })

    if (exports.size === originalExportsSize) {
      resolve(Err({ reason: 'no_imports', exports }))
    }

    resolve(Err({ reason: 'unused_exports', exports }))
  })
}

export { findUnusedExports }
