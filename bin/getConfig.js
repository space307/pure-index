import { join } from 'node:path'
import { lilconfig, lilconfigSync } from 'lilconfig'

const BASE_CONFIG = {
  // like Jest.config.testPathIgnorePatterns
  // https://jestjs.io/ru/docs/configuration#testpathignorepatterns-arraystring
  exclude: new Set(['node_modules']),
  babelPlugins: new Set(['typescript']),
  indexFilePath: 'index.ts',
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
      indexFilePath = BASE_CONFIG.indexFilePath,
      batch = {}
    }
  } = result

  return result === null
    ? BASE_CONFIG
    : {
        exclude: new Set([...BASE_CONFIG.exclude, ...exclude]),
        babelPlugins: new Set([...BASE_CONFIG.babelPlugins, ...babelPlugins]),
        indexFilePath,
        batch: {
          default: batch.default || BASE_CONFIG.batch.defaul
        }
      }
}

export { getConfig }
