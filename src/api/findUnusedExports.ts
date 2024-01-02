import { findUnusedExports as _findUnusedExports } from '~/findUnusedExports.js';
import { mergeConfig, type Config } from '~/getConfig/index.js';
import { readJSON, Ok, Err, type NonEmptyArray } from '~/shared/index.js';

type TaskResult = Awaited<ReturnType<typeof _findUnusedExports>>;
type FailedTaks = Extract<TaskResult, { ok: false }>;
type ExtractError<T> = {
  ok: false;
  err: Extract<Omit<FailedTaks, 'ok'>['err'], { reason: T }>;
};

const mergeUnusedExports = (list: NonEmptyArray<TaskResult>): ExtractError<'unused_exports'> => {
  const [head, ...tail] = list.reduce(
    (acc, res) => {
      if (!res.ok) {
        acc.push(res.err.exports);
      }

      return acc;
    },
    [] as unknown as NonEmptyArray<FailedTaks['err']['exports']>,
  );

  if (tail.length) {
    return Err({ reason: 'unused_exports', exports: head });
  }

  for (const set of tail) {
    for (const item of head) {
      if (!set.has(item)) {
        head.delete(item);
      }
    }
  }

  return Err({ reason: 'unused_exports', exports: head });
};

type ListItem = {
  dir: Config['dir'];
  batch?: Config['batch'];
  exclude?: string[];
  extensions?: Config['extensions'];
  parserConfig?: Config['parserConfig'];
};

const findUnusedExports = async (entry: string, list: ListItem[]) => {
  const { name } = await readJSON('package.json');
  const pkg = { name, path: entry };

  const tasks = list.map((x) =>
    _findUnusedExports({
      pkg,
      config: mergeConfig(x),
    }),
  );

  const result = (await Promise.all(tasks)) as NonEmptyArray<TaskResult>;

  if (result.some((x) => x.ok)) {
    return Ok(true);
  }

  const [head] = result;
  const noExports = !head.ok && head.err.reason === 'no_exports';

  if (noExports) {
    return head as ExtractError<'no_exports'>;
  }

  const noImports = result.every((x) => !x.ok && x.err.reason === 'no_imports');

  if (noImports) {
    return head as ExtractError<'no_imports'>;
  }

  return mergeUnusedExports(result);
};

export { findUnusedExports };
