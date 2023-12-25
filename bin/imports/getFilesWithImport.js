import { createReadStream } from 'node:fs'
import { Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'

/**
 * @param {{
 *   entry: string,
 *   tokens: Array<string>
 * }}
 *
 *  @returns {Promise<boolean>}
 */
const findImport = ({ entry, tokens }) =>
  new Promise((resolve, reject) => {
    const transformStream = new Transform({
      transform(chunk, _, callback) {
        if (chunk.includes(tokens[0]) || chunk.includes(tokens[1])) {
          this.push(chunk)
          resolve(true)
          this.destroy()
        } else {
          callback()
        }
      }
    })

    pipeline(createReadStream(entry), transformStream)
      .then(() => resolve(false))
      .catch(reject)
  })

/**
 * @param {{
 *   entries: Array<string>,
 *   pkg: {
 *      name: string
 *   },
 * }}
 */
const getFilesWithImport = async ({ entries, pkg }) => {
  const tokens = [`from '${pkg.name}'`, `from "${pkg.name}"`]
  const matchingFiles = []

  for (const entry of entries) {
    const found = await findImport({ entry, tokens })

    if (found) {
      matchingFiles.push(entry)
    }
  }

  return matchingFiles
}

export { getFilesWithImport }
