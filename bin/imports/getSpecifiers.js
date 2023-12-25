import { readFile } from 'node:fs/promises'
import { parse } from '@babel/parser'
import traverse from '@babel/traverse'

/**
 * @param {{
 *   file: string
 *   pkg: {
 *      name: string
 *   },
 *   config: {
 *      babelPlugins: Set<string>,
 *   }
 * }}
 *
 * @returns {Promise<Array.<string>>}
 */
const getSpecifiers = async ({ file, pkg, config }) => {
  const code = await readFile(file, 'utf8')
  const result = []

  const ast = parse(code, {
    sourceType: 'module',
    plugins: [...config.babelPlugins]
  })

  traverse.default(ast, {
    ImportDeclaration(path) {
      if (path.node.source.value === pkg.name) {
        path.node.specifiers.forEach(specifier => {
          const type = specifier.type

          if (type === 'ImportSpecifier' || type === 'ImportDefaultSpecifier') {
            result.push(specifier.imported?.name)
          } else if (type === 'ImportNamespaceSpecifier') {
            result.push('* as ' + specifier.local.name)
          }
        })
      }
    },
    ExportNamedDeclaration(path) {
      if (path.node.source && path.node.source.value === pkg.name) {
        path.node.specifiers.forEach(specifier => {
          result.push(specifier.exported.name)
        })
      }
    }
  })

  return result
}

export { getSpecifiers }
