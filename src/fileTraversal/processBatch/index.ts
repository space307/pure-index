import { notNil, type Cmd, type Pkg } from '~/shared/index.js';
import { findImport } from './findImport.js';
import { traversal } from './traversal.js';

type Params = {
  cmd: Cmd;
  files: string[];
  pkg: Pkg;
  tokens: string[];
};

const processBatch = async ({ cmd, files, pkg, tokens }: Params) => {
  const pathesPromise = files.map(async (path) => {
    const found = await findImport({ path, tokens });
    return found ? path : null;
  });

  const filterPromise = (await Promise.all(pathesPromise)).filter(notNil).map((path) => traversal({ cmd, path, pkg }));

  await Promise.all(filterPromise);
};

export { processBatch };
