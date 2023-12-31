import { notNil } from 'shared'
import { findImport } from './findImport'
import { traversal } from './traversal'

type Params = Omit<Parameters<typeof traversal>[0], 'path'> &
  Pick<Parameters<typeof findImport>[0], 'tokens'> & {
    files: string[]
  }

// todo: in single Promise.all ?
const processBatch = async ({ config, cmd, files, pkg, tokens }: Params) => {
  const pathesPromise = files.map(async path => {
    const found = await findImport({ path, tokens })
    return found ? path : null
  })

  const filterPromise = (await Promise.all(pathesPromise))
    .filter(notNil)
    .map(path => traversal({ config, cmd, path, pkg }))

  await Promise.all(filterPromise)
}

export { processBatch }
