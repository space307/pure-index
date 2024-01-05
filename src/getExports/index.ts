import { existsSync } from 'node:fs';
import { parseFile } from '@swc/core';

import type { Config } from '~/getConfig/index.js';
import { ObservableSet, printError as _printError, type Pkg, printParseError } from '~/shared/index.js';

type Params = {
  pkg: Pkg;
  config: Pick<Config, 'parserConfig'>;
};

const printError = (pkg: Pkg) => {
  _printError({
    text: `
    Unable to find ${pkg.name} index file ("${pkg.path}" provided)

    - if you do not have a .pure-index.json file:
        create one and specify "entry"
        https://space307.github.io/pure-index/reference/configuration

    - if you have a configuration file:
        use the pure-index command with the "--entry" flag.
        https://space307.github.io/pure-index/how-to/precisely-override-package-entry
    `,
  });
};

const getExports = async ({ pkg, config }: Params) => {
  if (!existsSync(pkg.path)) {
    printError(pkg);
    process.exit(1);
  }

  const result = new ObservableSet();
  let ast;

  try {
    ast = await parseFile(pkg.path, config.parserConfig);
  } catch (e) {
    printParseError(pkg.path);
    process.exit(1);
  }

  for (const node of ast.body) {
    if (node.type === 'ExportNamedDeclaration') {
      // `export { name }`
      for (const specifier of node.specifiers) {
        // fast check
        // @ts-expect-error
        specifier.exported
          ? // @ts-expect-error
            result.add(specifier.exported.value)
          : // @ts-expect-error
            result.add(specifier.orig.value);
      }
      continue;
    }

    // constants, fns, classes etc
    if (node.type === 'ExportDeclaration') {
      // classes edge case
      // @ts-expect-error
      if (!node.declaration.declarations) {
        // @ts-expect-error
        result.add(node.declaration.identifier.value);
        continue;
      }

      // @ts-expect-error
      for (const decl of node.declaration.declarations) {
        result.add(decl.id.value);
      }

      continue;
    }

    if (node.type === 'ExportDefaultExpression') {
      // @ts-expect-error
      result.add(node.expression.value);
    }
  }

  return result;
};

export { getExports };
