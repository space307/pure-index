import { parse } from '@babel/parser'

import { readFile } from '../../utils/index.js'

const traversal = async ({ file, pkg, config, cmd }) => {
  const code = await readFile(file)

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
