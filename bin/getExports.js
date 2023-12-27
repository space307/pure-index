import { join } from 'node:path'
import parser from '@babel/parser'
import walk from 'babel-walk'

import { readFile, ObservableSet } from './utils/index.js'

/**
 * @param {{
 *   config: {
 *      entry: string
 *      babelPlugins: Set<string>
 *   }
 *   pkg: {
 *      path: string
 *   }
 * }}
 *
 * @returns {Promise<Set.<string>>}
 */
const getExports = async ({ config, pkg }) => {
  const code = await readFile(join(pkg.path, config.entry))
  const result = new ObservableSet()

  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: [...config.babelPlugins]
  })

  const visitors = {
    ExportNamedDeclaration(node) {
      if (node.declaration) {
        const declaration = node.declaration

        if (declaration.declarations) {
          // constants and fns
          for (const decl of declaration.declarations) {
            result.add(decl.id.name)
          }
        }
      } else if (node.specifiers) {
        // `export { name }`
        for (const specifier of node.specifiers) {
          result.add(specifier.exported.name)
        }
      }
    }
  }

  walk.ancestor(visitors)(ast)

  return result
}

export { getExports }
