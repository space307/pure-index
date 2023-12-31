import { parseFile } from '@swc/core'

import { ObservableSet } from './utils/index.js'

const getExports = async ({ config, pkg }) => {
  const result = new ObservableSet()

  const ast = await parseFile(pkg.path, {
    syntax: 'typescript',
    comments: false
  })

  for (const node of ast.body) {
    if (node.type === 'ExportNamedDeclaration') {
      // `export { name }`
      for (const specifier of node.specifiers) {
        specifier.exported
          ? result.add(specifier.exported.value)
          : result.add(specifier.orig.value)
      }
      continue
    }

    // constants and fns
    if (node.type === 'ExportDeclaration') {
      for (const decl of node.declaration.declarations) {
        result.add(decl.id.value)
      }

      continue
    }
  }

  return result
}

export { getExports }
