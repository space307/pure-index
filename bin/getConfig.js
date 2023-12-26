import { join } from 'node:path'
import { lilconfig, lilconfigSync } from 'lilconfig'
import meow from 'meow'

const BASE_CONFIG = {
  entry: 'index.ts',
  exclude: new Set(['node_modules']),
  babelPlugins: new Set(['typescript']),
  batch: {
    default: 100
  }
}

const cli = meow(
  `
	Options
	  --entry, -e  path to the package index file. relative to the package directory
`,
  {
    importMeta: import.meta,
    allowUnknownFlags: false,
    description: false,
    flags: {
      entry: { type: 'string', shortFlag: 'e' }
    }
  }
)

const getConfig = async () => {
  const result = await lilconfig('pure-index', {
    searchPlaces: ['package.json', '.pure-index.json']
  }).search()

  if (!result) {
    return {
      ...BASE_CONFIG,
      entry: cli.flags.entry || BASE_CONFIG.entry
    }
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
        entry: cli.flags.entry || entry,
        exclude: new Set([...BASE_CONFIG.exclude, ...exclude]),
        babelPlugins: new Set([...BASE_CONFIG.babelPlugins, ...babelPlugins]),
        batch: {
          default: batch.default || BASE_CONFIG.batch.defaul
        }
      }
}

export { getConfig }
