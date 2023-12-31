import { collectUsages as _collectUsages } from '../collectUsages.js'
import { BASE_CONFIG, type Config } from '../getConfig.js'
import { Ok, Err } from 'shared'

type ListItem = Partial<
  Pick<Config, 'babelPlugins' | 'batch' | 'exclude' | 'extensions'>
> & {
  dir: Config['dir']
}

const collectUsages = async (name: string, list: ListItem[]) => {
  const tasks = list.map(x =>
    _collectUsages({
      config: {
        babelPlugins: x.babelPlugins || BASE_CONFIG.babelPlugins,
        batch: x.batch || BASE_CONFIG.batch,
        exclude: x.exclude
          ? new Set([...BASE_CONFIG.exclude, ...x.exclude])
          : BASE_CONFIG.exclude,
        extensions: x.extensions || BASE_CONFIG.extensions,
        dir: x.dir,
        collectUsages: name
      }
    })
  )

  const result = await Promise.all(tasks)

  const mergedUsages = result.reduce<string[]>((acc, x) => {
    if (x.ok) {
      acc = acc.concat([...x.val.usages])
    }

    return acc
  }, [])

  return mergedUsages.length === 0
    ? Err({ usages: new Set<void>() })
    : Ok({ usages: new Set(mergedUsages) })
}

export { collectUsages }
