import { join } from 'node:path'
import parser from '@babel/parser'
import _traverse from '@babel/traverse'

import { readFile, ObservableSet } from './utils/index.js'

const traverse = _traverse.default

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
  const result = new ObservableSet()

  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: [...config.babelPlugins]
  })

  traverse(ast, {
    ImportDeclaration(path) {
      path.skip()
    },
    ExportNamedDeclaration(path) {
      if (path.node.declaration) {
        const declaration = path.node.declaration

        if (declaration.declarations) {
          // constants and fns
          for (const decl of declaration.declarations) {
            result.add(decl.id.name)
          }
        }
      } else if (path.node.specifiers) {
        // `export { name }`
        for (const specifier of path.node.specifiers) {
          result.add(specifier.exported.name)
        }
      }

      path.skip()
    }
  })

  return result
}

export { getExports }
