import cp from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const filename = importMeta =>
  importMeta.url ? fileURLToPath(importMeta.url) : ''

const dirname = importMeta => path.dirname(filename(importMeta))

export const exec = params => {
  const prefix = path.join(dirname(import.meta), params.path)

  return promisify(cp.exec)(`${params.cmd} --prefix ${prefix}`)
}
