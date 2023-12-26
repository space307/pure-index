import { join } from 'node:path'
import { lilconfig, lilconfigSync } from 'lilconfig'

const BASE_CONFIG = {
  entry: 'index.ts',
  exclude: new Set(['node_modules']),
  babelPlugins: new Set(['typescript']),
  batch: {
    default: 100
  }
}

const getConfig = async () => {
  const result = await lilconfig('pure-index', {
    searchPlaces: ['package.json', '.pure-index.json']
  }).search()

  if (!result) {
    return BASE_CONFIG
  }

  const {
    config: {
      exclude = [],
      babelPlugins = [],
      entry = BASE_CONFIG.entry,
      batch = {}
    }
  } = result

  return result === null
    ? BASE_CONFIG
    : {
        exclude: new Set([...BASE_CONFIG.exclude, ...exclude]),
        babelPlugins: new Set([...BASE_CONFIG.babelPlugins, ...babelPlugins]),
        entry,
        batch: {
          default: batch.default || BASE_CONFIG.batch.defaul
        }
      }
}

export { getConfig }
