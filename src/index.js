import { baseFlow } from './baseFlow.js'
import { collectUsages as _collectUsages } from './collectUsages.js'
import { BASE_CONFIG } from './getConfig.js'

/**
 * @param {{
 *   config: {
 *      entry: string
 *      batch: number
 *      list: Array.<{
 *        babelPlugins: Array<string>
 *        exclude: Set<string>
 *        extensions
 *        dir
 *      }>
 *   },
 * }}
 *
 * @returns {Promise<Array.<string>>}
 */
const find = async ({ config }) => {
  const unusedExports = new Set()

  const tasks = config.list(x =>
    baseFlow({
      config: {
        babelPlugins: x.babelPlugins,
        batch: config.batch,
        entry: config.entry,
        exclude: x.exclude,
        extensions: x.extensions,
        dir: x.dir
      }
    })
  )

  const result = await Promise.all(tasks)
}

// name and list[0].dir are required
/**
 * @param {string} name
 *
 * @param {{
 *      babelPlugins: Array<string>,
 *      batch: number,
 *      exclude: Set<string>,
 *      extensions: Array<string>,
 *      dir: string
 * }[]} list
 */
const collectUsages = async (name, list) => {
  const tasks = list.map(x =>
    _collectUsages({
      config: {
        babelPlugins: x.babelPlugins || BASE_CONFIG.babelPlugins,
        batch: x.batch || BASE_CONFIG.batch,
        exclude: x.exclude
          ? new Set([...BASE_CONFIG.exclude, ...x.exclude])
          : BASE_CONFIG.exclude,
        extensions: x.extensions || BASE_CONFIG.extensions,
        dir: x.dir || BASE_CONFIG.dir,
        collectUsages: name
      }
    })
  )

  const result = await Promise.all(tasks)

  const mergedUsages = result.reduce((acc, x) => {
    if (x.success) {
      acc = acc.concat([...x.value.usages])
    }

    return acc
  }, [])

  return new Set(mergedUsages)
}

export { find, collectUsages }
