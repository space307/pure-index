import { baseFlow } from './baseFlow.js'

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
const find = ({ config }) => {
  const unusedExports = new Set()

  const tasks = config.list(x =>
    baseFlow({
      babelPlugins: x.babelPlugins,
      batch: config.batch,
      entry: config.entry,
      exclude: x.exclude,
      extensions: x.extensions,
      dir: x.dir
    })
  )

  const result = await Promise.all(tasks)
}

export { find }
