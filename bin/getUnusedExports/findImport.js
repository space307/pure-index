import { createReadStream } from 'node:fs'
import { Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'

/**
 * @param {{
 *   file: string,
 *   tokens: Array<string>
 * }}
 */
const findImport = ({ file, tokens }) =>
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

    pipeline(createReadStream(file), transformStream)
      .then(() => resolve(false))
      .catch(reject)
  })

export { findImport }
