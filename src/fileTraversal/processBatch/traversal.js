import { parseFile } from '@swc/core'

const traversal = async ({ file, pkg, config, cmd }) => {
  const ast = await parseFile(file, {
    syntax: 'typescript'
  })

  for (const node of ast.body) {
    if (node.type === 'ImportDeclaration' && node.source.value === pkg.name) {
      for (const specifier of node.specifiers) {
        const { type } = specifier

        if (type === 'ImportSpecifier' || type === 'ImportDefaultSpecifier') {
          specifier.imported
            ? cmd(specifier.imported.value)
            : cmd(specifier.local.value)
        }
      }

      continue
    }

    if (
      node.type === 'ExportNamedDeclaration' &&
      node.source &&
      node.source.value === pkg.name
    ) {
      for (const specifier of node.specifiers) {
        specifier.exported
          ? cmd(specifier.exported.value)
          : cmd(specifier.orig.value)
      }

      continue
    }
  }
}

export { traversal }
