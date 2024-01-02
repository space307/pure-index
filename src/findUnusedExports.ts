import { getExports } from './getExports/index.js';
import { fileTraversal } from './fileTraversal/index.js';
import { Err, ObservableSet, Ok, type Pkg, type Result } from '~/shared/index.js';
import type { Config } from './getConfig/index.js';

type FindUnusedExports = (_: {
  pkg: Pkg;
  config: Pick<Config, 'dir' | 'batch' | 'exclude' | 'extensions' | 'parserConfig'>;
}) => Promise<
  Result<
    { exports: ObservableSet },
    | { reason: 'no_exports'; exports: ObservableSet }
    | { reason: 'no_imports'; exports: ObservableSet }
    | { reason: 'unused_exports'; exports: ObservableSet }
  >
>;

const findUnusedExports: FindUnusedExports = async ({ pkg, config }) => {
  const exports = await getExports({ pkg, config });
  const originalExportsSize = exports.size;

  return new Promise(async (resolve) => {
    // immediate termination
    exports.onEmpty(() => {
      resolve(Ok({ exports }));
    });

    if (originalExportsSize === 0) {
      resolve(Err({ reason: 'no_exports', exports }));
    }

    await fileTraversal({ config, pkg, cmd: exports.delete.bind(exports) });

    if (exports.size === originalExportsSize) {
      resolve(Err({ reason: 'no_imports', exports }));
    }

    resolve(Err({ reason: 'unused_exports', exports }));
  });
};

export { findUnusedExports };
