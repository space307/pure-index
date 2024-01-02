import { parseFile } from '@swc/core';

import type { Cmd, Pkg } from '~/shared/index.js';

type Params = {
  path: string;
  pkg: Pick<Pkg, 'name'>;
  cmd: Cmd;
};

const traversal = async ({ path, pkg, cmd }: Params) => {
  const ast = await parseFile(path, {
    syntax: 'typescript',
    comments: false,
  });

  for (const node of ast.body) {
    if (node.type === 'ImportDeclaration' && node.source.value === pkg.name) {
      for (const specifier of node.specifiers) {
        if (specifier.type === 'ImportSpecifier') {
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
