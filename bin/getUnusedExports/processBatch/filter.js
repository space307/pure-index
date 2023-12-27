import { parse } from '@babel/parser'
import walk from 'babel-walk'

import { readFile } from '../../utils/index.js'

/**
 * @param {{
 *   file: string
 *   pkg: {
 *      name: string
 *   },
 *   config: {
 *      babelPlugins: Set<string>,
 *   },
 *   exports: Set<string>
 * }}
 */
const filterExports = async ({ file, pkg, config, exports }) => {
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
            exports.delete(specifier.imported?.name)
          } else if (type === 'ImportNamespaceSpecifier') {
            exports.delete('* as ' + specifier.local.name)
          }
        }
      }
    },
    ExportNamedDeclaration(node) {
      if (node.source && node.source.value === pkg.name) {
        for (const specifier of node.specifiers) {
          exports.delete(specifier.exported.name)
        }
      }
    }
  }

  walk.ancestor(visitors)(ast)
}

export { filterExports }
