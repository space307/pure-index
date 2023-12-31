import { parse } from '@babel/parser'

import { readFile, type Pkg } from 'shared'

import type { Config } from 'getConfig'

type Params = {
  path: string
  config: Pick<Config, 'babelPlugins'>
  pkg: Pkg
  cmd: (_: string) => unknown
}

const traversal = async ({ path, pkg, config, cmd }: Params) => {
  const code = await readFile(path)

  const ast = parse(code, {
    sourceType: 'module',
    plugins: config.babelPlugins
  })

  for (const node of ast.program.body) {
    if (node.type === 'ImportDeclaration' && node.source.value === pkg.name) {
      for (const specifier of node.specifiers) {
        const type = specifier.type

        if (type === 'ImportSpecifier' || type === 'ImportDefaultSpecifier') {
          cmd(specifier.imported?.name)
        } else if (type === 'ImportNamespaceSpecifier') {
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
        cmd(specifier.exported.name)
      }

      continue
    }
  }
}

export { traversal }
