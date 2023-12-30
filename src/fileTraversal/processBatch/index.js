import { findImport } from './findImport.js'
import { traversal } from './traversal.js'

const processBatch = async ({ config, cmd, files, pkg, tokens }) => {
  const filesPromise = files.map(async file => {
    const found = await findImport({ file, tokens })
    return found ? file : null
  })

  const filterPromise = (await Promise.all(filesPromise))
    .filter(x => x !== null)
    .map(file => traversal({ config, cmd, file, pkg }))

  await Promise.all(filterPromise)
}

export { processBatch }
