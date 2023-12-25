import { join } from 'node:path'
import parser from '@babel/parser'
import traverse from '@babel/traverse'

import { readFile } from './utils.js'

/**
 * @param {{
 *   config: {
 *      babelPlugins: Set<string>,
 *      indexFilePath: string,
 *   },
 *   pkg: {
 *      path: string
 *   },
 * }}
 *
 * @returns {Promise<Set.<string>>}
 */
const getExports = async ({ config, pkg }) => {
  const code = await readFile(join(pkg.path, config.indexFilePath))
  const result = new Set([])

  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: [...config.babelPlugins]
  })

  traverse.default(ast, {
    ExportNamedDeclaration(path) {
      if (path.node.declaration) {
        const declaration = path.node.declaration

        if (declaration.declarations) {
          // constants and fns
          declaration.declarations.forEach(decl => {
            result.add(decl.id.name)
          })
        }
      } else if (path.node.specifiers) {
        // `export { name }`
        path.node.specifiers.forEach(specifier => {
          result.add(specifier.exported.name)
        })
      }
    }
  })

  return result
}

export { getExports }
