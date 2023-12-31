import { parseFile } from '@swc/core'

import type { Cmd, Pkg } from 'shared'

type Params = {
  path: string
  pkg: Pkg
  cmd: Cmd
}

const traversal = async ({ path, pkg, cmd }: Params) => {
  const ast = await parseFile(path, {
    syntax: 'typescript'
  })

  for (const node of ast.body) {
    if (node.type === 'ImportDeclaration' && node.source.value === pkg.name) {
      for (const specifier of node.specifiers) {
        const { type } = specifier

        if (type === 'ImportSpecifier' || type === 'ImportDefaultSpecifier') {
          // @ts-expect-error
          cmd(specifier.imported?.name)
        } else if (type === 'ImportNamespaceSpecifier') {
          // @ts-expect-error
          cmd('* as ' + specifier.local.name)
        }
      }

      continue
    }

    if (
      node.type === 'ExportNamedDeclaration' &&
      node.source &&
      node.source.value === pkg.name
    ) {
      for (const specifier of node.specifiers) {
        // @ts-expect-error
        cmd(specifier.exported.name)
      }

      continue
    }
  }
}

export { traversal }
