import { parseFile } from '@swc/core';
import type { Config } from '~/getConfig/index.js';

import { ObservableSet, type Pkg } from '~/shared/index.js';

type Params = {
  pkg: Pkg;
  config: Pick<Config, 'parserConfig'>;
};

const getExports = async ({ pkg, config }: Params) => {
  const result = new ObservableSet();

  const ast = await parseFile(pkg.path, config.parserConfig);

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
