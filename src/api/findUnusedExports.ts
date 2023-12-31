import { findUnusedExports as _findUnusedExports } from 'findUnusedExports'
import { BASE_CONFIG, type Config } from '../getConfig.js'
import { readJSON, Ok, Err, type NonEmptyArray } from 'shared'

type TaskResult = Awaited<ReturnType<typeof _findUnusedExports>>
type FailedTaks = Extract<TaskResult, { ok: false }>
type ExtractError<T> = {
  ok: false
  err: Extract<Omit<FailedTaks, 'ok'>['err'], { reason: T }>
}

type ListItem = Partial<
  Pick<Config, 'babelPlugins' | 'batch' | 'exclude' | 'extensions'>
> & {
  dir: Config['dir']
}

const mergeUnusedExports = (
  list: NonEmptyArray<TaskResult>
): ExtractError<'unused_exports'> => {
  const [head, ...tail] = list.reduce(
    (acc, res) => {
      if (!res.ok) {
        acc.push(res.err.exports)
      }

      return acc
    },
    [] as unknown as NonEmptyArray<FailedTaks['err']['exports']>
  )

  if (tail.length) {
    return Err({ reason: 'unused_exports', exports: head })
  }

  for (const set of tail) {
    for (const item of head) {
      if (!set.has(item)) {
        head.delete(item)
      }
    }
  }

  return Err({ reason: 'unused_exports', exports: head })
}

const findUnusedExports = async (entry: string, list: ListItem[]) => {
  const { name } = await readJSON('package.json')
  const pkg = { name, path: entry }

  const tasks = list.map(x =>
    _findUnusedExports({
      pkg,
      config: {
        babelPlugins: x.babelPlugins || BASE_CONFIG.babelPlugins,
        batch: x.batch || BASE_CONFIG.batch,
        exclude: x.exclude
          ? new Set([...BASE_CONFIG.exclude, ...x.exclude])
          : BASE_CONFIG.exclude,
        extensions: x.extensions || BASE_CONFIG.extensions,
        dir: x.dir
      }
    })
  )

  const result = (await Promise.all(tasks)) as NonEmptyArray<TaskResult>

  if (result.some(x => x.ok)) {
    return Ok(new Set<void>())
  }

  const [head] = result
  const noExports = !head.ok && head.err.reason === 'no_exports'

  if (noExports) {
    return head as ExtractError<'no_exports'>
  }

  const noImports = result.every(x => !x.ok && x.err.reason === 'no_imports')

  if (noImports) {
    return head as ExtractError<'no_imports'>
  }

  return mergeUnusedExports(result)
}

export { findUnusedExports }
