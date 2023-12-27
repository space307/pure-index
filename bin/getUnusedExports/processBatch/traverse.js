import { parse } from '@babel/parser'
import walk from 'babel-walk'

import { readFile } from '../../utils/index.js'

/**
 * @param {{
 *   cmd: {function(_: string): void}
 *   file: string
 *   pkg: {
 *      name: string
 *   },
 *   config: {
 *      babelPlugins: Set<string>
 *   },
 * }}
 */
const traverse = async ({ file, pkg, config, cmd }) => {
  const code = await readFile(file)

  const ast = parse(code, {
    sourceType: 'module',
    plugins: [...config.babelPlugins]
  })

  const visitors = {
    ImportDeclaration(node) {
      if (node.source.value === pkg.name) {
        for (const specifier of node.specifiers) {
          const type = specifier.type

          if (type === 'ImportSpecifier' || type === 'ImportDefaultSpecifier') {
            cmd(specifier.imported?.name)
          } else if (type === 'ImportNamespaceSpecifier') {
            cmd('* as ' + specifier.local.name)
          }
        }
      }
    },
    ExportNamedDeclaration(node) {
      if (node.source && node.source.value === pkg.name) {
        for (const specifier of node.specifiers) {
          cmd(specifier.exported.name)
        }
      }
    }
  }

  walk.ancestor(visitors)(ast)
}

export { traverse }
