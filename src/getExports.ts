import { parseFile } from '@swc/core'
import type { Config } from 'getConfig'

import { ObservableSet, type Pkg } from 'shared'

type Params = {
  config: Pick<Config, 'babelPlugins'>
  pkg: Pick<Pkg, 'path'>
}

const getExports = async ({ pkg }: Params) => {
  const result = new ObservableSet()

  const ast = await parseFile(pkg.path, {
    syntax: 'typescript',
    comments: false
  })

  for (const node of ast.body) {
    if (node.type === 'ExportNamedDeclaration') {
      // `export { name }`
      for (const specifier of node.specifiers) {
        // fast check
        // @ts-expect-error
        specifier.exported
          ? // @ts-expect-error
            result.add(specifier.exported.value)
          : // @ts-expect-error
            result.add(specifier.orig.value)
      }
      continue
    }

    // constants and fns
    if (node.type === 'ExportDeclaration') {
      // @ts-expect-error
      for (const decl of node.declaration.declarations) {
        result.add(decl.id.value)
      }

      continue
    }
  }

  return result
}

export { getExports }
