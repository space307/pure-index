import { notNil, type Cmd, type Pkg } from 'shared'
import { findImport } from './findImport'
import { traversal } from './traversal'

type Params = {
  cmd: Cmd
  files: string[]
  pkg: Pkg
  tokens: string[]
}

const processBatch = async ({ cmd, files, pkg, tokens }: Params) => {
  const pathesPromise = files.map(async path => {
    const found = await findImport({ path, tokens })
    return found ? path : null
  })

  const filterPromise = (await Promise.all(pathesPromise))
    .filter(notNil)
    .map(path => traversal({ cmd, path, pkg }))

  await Promise.all(filterPromise)
}

export { processBatch }
