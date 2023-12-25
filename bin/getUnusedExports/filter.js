import { parse } from '@babel/parser'
import _traverse from '@babel/traverse'

import { readFile } from '../utils/index.js'

const traverse = _traverse.default

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
    plugins: config.babelPlugins
  })

  traverse(ast, {
    ImportDeclaration(path) {
      if (path.node.source.value === pkg.name) {
        for (const specifier of path.node.specifiers) {
          const type = specifier.type

          if (type === 'ImportSpecifier' || type === 'ImportDefaultSpecifier') {
            exports.delete(specifier.imported?.name)
          } else if (type === 'ImportNamespaceSpecifier') {
            exports.delete('* as ' + specifier.local.name)
          }
        }
      }

      path.skip()
    },
    ExportNamedDeclaration(path) {
      if (path.node.source && path.node.source.value === pkg.name) {
        for (const specifier of path.node.specifiers) {
          exports.delete(specifier.exported.name)
        }
      }

      path.skip()
    },
    FunctionDeclaration(path) {
      path.skip()
    },
    VariableDeclaration(path) {
      path.skip()
    }
  })
}

export { filterExports }
