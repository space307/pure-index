import { type Config } from '~/getConfig/index.js';
import { findUnusedExports as _findUnusedExports } from '~/findUnusedExports.js';
import { printError, createSpinner, readJSON } from '~/shared/index.js';

type Params = {
  config: Config;
};

const findUnusedExports = async ({ config }: Params) => {
  const { name } = await readJSON('package.json');
  const pkg = { name, path: config.entry };
  const spinner = createSpinner(`Checking exports from the ${pkg.name} package`);

  const result = await _findUnusedExports({ pkg, config });

  if (result.ok) {
    spinner.success();
    process.exit(0);
  }

  spinner.error();

  switch (result.err.reason) {
    case 'no_exports':
      printError({
        text: `Nothing is exported from ${pkg.name}. Remove it.`,
      });
      break;
    case 'no_imports':
      printError({
        text: `Nothing is imported from ${pkg.name}. Remove it.`,
      });
      break;
    case 'unused_exports':
      printError({
        text: `Unused exports in ${pkg.name} package found`,
        set: result.err.exports,
      });
  }

  process.exit(1);
};

export { findUnusedExports };
