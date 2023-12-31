import parser from '@babel/parser'
import type { Config } from 'getConfig'

import { readFile, ObservableSet, type Pkg } from 'shared'

type Params = {
  config: Pick<Config, 'babelPlugins'>
  pkg: Pick<Pkg, 'path'>
}

const getExports = async ({ config, pkg }: Params) => {
  const code = await readFile(pkg.path)
  const result = new ObservableSet()

  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: config.babelPlugins
  })

  for (const node of ast.program.body) {
    if (node.type === 'ExportNamedDeclaration') {
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
      continue
    }
  }

  return result
}

export { getExports }
