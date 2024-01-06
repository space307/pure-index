import { extname } from 'node:path';
import { fdir } from 'fdir';

import type { Config } from '~/getConfig/index.js';

type Params = {
  config: Pick<Config, 'extensions' | 'dir' | 'exclude'>;
};

// fixme: https://github.com/space307/pure-index/issues/10
const getFiles = async ({ config }: Params) => {
  const exclude = config.exclude
    .map((item) => item.replace(/(^\/|\/$)/g, '').replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
    .join('|');
  const excludeRegExp = new RegExp(exclude);
  const extensions = new Set(config.extensions);

  const files = new fdir()
    .exclude((dirName) => excludeRegExp.test(dirName))
    .filter((path) => extensions.has(extname(path)))
    .withBasePath()
    .crawl(config.dir)
    .sync();

  return files;
};

export { getFiles };
