import { fileTraversal } from './fileTraversal/index.js'
import { Err, Ok } from 'shared'

type Params = {
  config: Parameters<typeof fileTraversal>[0]['config'] & {
    collectUsages: string
  }
}

const collectUsages = async ({ config }: Params) => {
  const pkg = { name: config.collectUsages, path: '' }
  const usages = new Set<string>()

  await fileTraversal({ config, pkg, cmd: usages.add.bind(usages) })

  return usages.size === 0 ? Err({ usages }) : Ok({ usages })
}

export { collectUsages }
