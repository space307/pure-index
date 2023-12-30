import { collectUsages as _collectUsages } from '../collectUsages.js'
import { BASE_CONFIG } from '../getConfig.js'
import { Result } from '../utils/index.js'

// name and list[0].dir are required
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

  return mergedUsages.length === 0
    ? Result.Err({ usages: new Set() })
    : Result.Ok({ usages: new Set(mergedUsages) })
}

export { collectUsages }
