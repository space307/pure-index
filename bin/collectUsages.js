import { fileTraversal } from './fileTraversal/index.js'
import { createStatusAPI } from './utils/index.js'

/**
 * @param {{
 *   config: {
 *      collectUsages: string
 *      exclude: Set<string>
 *      extensions: Array<string>
 *      babelPlugins: Set<string>
 *      batch: {
 *        default: number
 *      }
 *   },
 * }}
 *
 * @returns {Promise<void>}
 */
const collectUsages = async ({ config }) => {
  const pkg = { name: config.collectUsages, path: '' }
  const statusApi = createStatusAPI({
    title: `Collecting usages of ${pkg.name}`
  })
  const usages = new Set()

  await fileTraversal({ config, pkg, cmd: usages.add.bind(usages) })

  if (usages.size === 0) {
    statusApi.failed({
      msg: `Nothing is used from ${pkg.name}. Remove it.`
    })
  }

  statusApi.succeed({ set: usages })
}

export { collectUsages }
