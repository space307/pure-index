import { parseFile } from '@swc/core';
import type { Config } from '~/getConfig/index.js';

import { type Cmd, type Pkg, printParseError } from '~/shared/index.js';

type Params = {
  path: string;
  pkg: Pick<Pkg, 'name'>;
  cmd: Cmd;
  config: Pick<Config, 'parserConfig'>;
};

const traversal = async ({ path, pkg, cmd, config }: Params) => {
  let ast;

  try {
    ast = await parseFile(path, config.parserConfig);
  } catch (e) {
    printParseError(path);
    process.exit(1);
  }

  for (const node of ast.body) {
    if (node.type === 'ImportDeclaration' && node.source.value === pkg.name) {
      for (const specifier of node.specifiers) {
        if (specifier.type === 'ImportSpecifier' || specifier.type === 'ImportDefaultSpecifier') {
          // @ts-expect-error
          specifier.imported ? cmd(specifier.imported.value) : cmd(specifier.local.value);
        }
      }

      continue;
    }

    if (node.type === 'ExportNamedDeclaration' && node.source && node.source.value === pkg.name) {
      for (const specifier of node.specifiers) {
        // @ts-expect-error
        cmd(specifier.orig.value);
      }

      continue;
    }
  }
};

export { traversal };
