import { processBatch } from './processBatch/index.js';
import { getFiles } from './getFiles/index.js';
import type { Config } from '~/getConfig/index.js';
import type { Cmd, Pkg } from '~/shared/index.js';

type Params = {
  pkg: Pkg;
  config: Pick<Config, 'dir' | 'batch' | 'exclude' | 'extensions' | 'parserConfig'>;
  cmd: Cmd;
};

const fileTraversal = async ({ config, pkg, cmd }: Params) => {
  const files = await getFiles({ config });
  const tokens = [`from '${pkg.name}'`, `from "${pkg.name}"`];
  let batch = [];

  for (const file of files) {
    batch.push(file);

    if (batch.length >= config.batch) {
      await processBatch({ cmd, files: batch, pkg, tokens, config });
      batch = [];
    }
  }

  if (batch.length > 0) {
    await processBatch({ cmd, files: batch, pkg, tokens, config });
  }
};

export { fileTraversal };
