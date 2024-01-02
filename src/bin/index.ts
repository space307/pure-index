#!/usr/bin/env node

import { collectUsages } from '~/collectUsages.js';
import { getConfig } from '~/getConfig/index.js';
import { findUnusedExports } from '~/findUnusedExports.js';
import { printSet, printError, createSpinner, readJSON } from '~/shared/index.js';

const config = await getConfig();

if (config.collectUsages) {
  const pkgName = config.collectUsages;
  const spinner = createSpinner(`Collecting usages of ${pkgName}`);

  // @ts-expect-error wtf
  const result = await collectUsages({ config });

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
}

const { name } = await readJSON('package.json');
const pkg = { name, path: config.entry };
const spinner = createSpinner(`Checking exports from the ${pkg.name} package`);

const result = await findUnusedExports({ pkg, config });

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
