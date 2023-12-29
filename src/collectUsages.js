import { fileTraversal } from './fileTraversal/index.js'
import { Result } from './utils/index.js'

/**
 * @param {{
 *   config: {
 *      babelPlugins: Array<string>
 *      batch: number
 *      collectUsages: string
 *      exclude: Set<string>
 *      extensions: Array<string>
 *      dir: string
 *   },
 * }}
 */
const collectUsages = async ({ config }) => {
  const pkg = { name: config.collectUsages, path: '' }
  const usages = new Set()

  await fileTraversal({ config, pkg, cmd: usages.add.bind(usages) })

  return usages.size === 0 ? Result.Err({ usages }) : Result.Ok({ usages })
}

export { collectUsages }
