import { join } from 'node:path';
import { fdir } from 'fdir';

import type { Config } from '~/getConfig/index.js';

const formattedExtensions = (list: Config['extensions']) => list.join(',') + ',';

type Params = {
  config: Pick<Config, 'extensions' | 'exclude' | 'dir'>;
};

// fixme: https://github.com/space307/pure-index/issues/10
const getFiles = async ({ config }: Params) => {
  const exclude = [...config.exclude]
    .map((item) => item.replace(/(^\/|\/$)/g, '').replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
    .join('|');
  const excludeRegExp = new RegExp(exclude);
  const source = join('**', `*.{${formattedExtensions(config.extensions)}}`);

  const files = new fdir()
    .exclude((dirName) => excludeRegExp.test(dirName))
    .globWithOptions([source], { dot: false })
    .withFullPaths()
    .crawl(config.dir)
    .sync();

  return files;
};

export { getFiles };
