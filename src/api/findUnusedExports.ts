import { join } from 'node:path';

import { findUnusedExports as _findUnusedExports } from '~/findUnusedExports.js';
import { mergeConfig, type Config } from '~/getConfig/index.js';
import { readJSON, Ok, Err, type NonEmptyArray, ObservableSet } from '~/shared/index.js';

type TaskResult = Awaited<ReturnType<typeof _findUnusedExports>>;
type FailedTaks = Extract<TaskResult, { ok: false }>;
type ExtractError<T> = {
  ok: false;
  err: Extract<Omit<FailedTaks, 'ok'>['err'], { reason: T }>;
};

const SUCCESS = Ok({ exports: new Set<void>() });

export const mergeUnusedExports = (
  list: NonEmptyArray<TaskResult>,
): ExtractError<'unused_exports'> | typeof SUCCESS => {
  const sets = list.reduce(
    (acc, res) => {
      if (!res.ok) {
        acc.push(res.err.exports);
      }

      return acc;
    },
    [] as unknown as NonEmptyArray<FailedTaks['err']['exports']>,
  );

  const smallestSet = sets.reduce((acc, set) => (set.size < acc.size ? set : acc), sets[0]);
  const unused = [...smallestSet].filter((exp) => sets.every((set) => set.has(exp)));

  return unused.length === 0 ? SUCCESS : Err({ reason: 'unused_exports', exports: new ObservableSet(unused) });
};

type Params = {
  entry: string;
  location?: string;
  pkgName?: string;
};

type ListItem = {
  dir: Config['dir'];
  batch?: Config['batch'];
  exclude?: Config['exclude'];
  extensions?: Config['extensions'];
  parserConfig?: Config['parserConfig'];
};

const findUnusedExports = async ({ entry, location = '', pkgName }: Params, list: ListItem[]) => {
  const name = pkgName || (await readJSON(join(location, 'package.json'))).name;
  const pkg = { name, path: join(location, entry) };

  const tasks = list.map((x) =>
    _findUnusedExports({
      pkg,
      config: mergeConfig(x),
    }),
  );

  const result = (await Promise.all(tasks)) as NonEmptyArray<TaskResult>;

  if (result.some((x) => x.ok)) {
    return SUCCESS;
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
