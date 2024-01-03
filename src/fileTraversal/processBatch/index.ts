import { findImport } from './findImport.js';
import { traversal } from './traversal/index.js';

import type { Config } from '~/getConfig/index.js';
import type { Cmd, Pkg } from '~/shared/index.js';

type Params = {
  cmd: Cmd;
  files: string[];
  pkg: Pkg;
  tokens: string[];
  config: Pick<Config, 'parserConfig'>;
};

const processBatch = async ({ cmd, files, pkg, tokens, config }: Params) => {
  const tasks = files.map(async (path) => {
    if (await findImport({ path, tokens })) {
      return traversal({ cmd, path, pkg, config });
    }
  });

  await Promise.all(tasks);
};

export { processBatch };
