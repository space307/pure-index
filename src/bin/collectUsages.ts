import { collectUsages as _collectUsages } from '~/collectUsages.js';
import { type Config } from '~/getConfig/index.js';
import { printSet, printError, createSpinner } from '~/shared/index.js';

type Params = {
  config: Config;
};

const collectUsages = async ({ config }: Params) => {
  const pkgName = config.collectUsages;
  const spinner = createSpinner(`Collecting usages of ${pkgName}`);

  // @ts-expect-error wtf
  const result = await _collectUsages({ config });

  if (result.ok) {
    spinner.success();
    printSet(result.val.usages);
    process.exit(0);
  }

  spinner.error();
  printError({
    text: `Nothing is used from ${pkgName}. Remove it.`,
  });
  process.exit(1);
};

export { collectUsages };
