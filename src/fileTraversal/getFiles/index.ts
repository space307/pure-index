import { extname } from 'node:path';
import { fdir } from 'fdir';
// @ts-expect-error no matter
import pm from 'picomatch';

import type { Config } from '~/getConfig/index.js';

type Params = {
  config: Pick<Config, 'extensions' | 'dir' | 'exclude'>;
};

// fixme: https://github.com/space307/pure-index/issues/10
const getFiles = async ({ config }: Params) => {
  const extensions = new Set(config.extensions);
  const isMatch = pm(config.exclude);

  const files = new fdir()
    .exclude((_, dirPath) => isMatch(dirPath))
    .filter((path) => extensions.has(extname(path)))
    .withBasePath()
    .crawl(config.dir)
    .sync();

  return files;
};

export { getFiles };
