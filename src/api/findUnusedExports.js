import { baseFlow } from '../baseFlow.js'
import { BASE_CONFIG } from '../getConfig.js'
import { readJSON, Result } from '../utils/index.js'

const findUnusedExports = async (entry, list) => {
  const { name } = await readJSON('package.json')
  const pkg = { name, path: entry }

  const tasks = list.map(x =>
    baseFlow({
      pkg,
      config: {
        babelPlugins: x.babelPlugins || BASE_CONFIG.babelPlugins,
        batch: x.batch || BASE_CONFIG.batch,
        exclude: x.exclude
          ? new Set([...BASE_CONFIG.exclude, ...x.exclude])
          : BASE_CONFIG.exclude,
        extensions: x.extensions || BASE_CONFIG.extensions,
        dir: x.dir || BASE_CONFIG.dir
      }
    })
  )

  const result = await Promise.all(tasks)
  const hasSuccess = result.some(x => x.success)

  if (hasSuccess) {
    return Result.Ok({})
  }

  const noExports = result[0].error.reason === 'no_exports'

  if (noExports) {
    return result[0]
  }

  const noImports = result.every(x => x.error.reason === 'no_imports')

  if (noImports) {
    return result[0]
  }

  const [head, ...tail] = result.reduce((acc, res) => {
    acc.push(res.error.exports)

    return acc
  }, [])

  if (tail.length === 0) {
    return Result.Err({ reason: 'unused_exports', exports: head })
  }

  for (const set of tail) {
    for (const item of head) {
      if (!set.has(item)) {
        head.delete(item)
      }
    }
  }

  return Result.Err({ reason: 'unused_exports', exports: head })
}

export { findUnusedExports }
