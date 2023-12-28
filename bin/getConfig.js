import { join } from 'node:path'
import { lilconfig } from 'lilconfig'
import meow from 'meow'

const BASE_CONFIG = {
  babelPlugins: new Set(['typescript']),
  batch: { default: 100 },
  collectUsages: null,
  entry: 'index.ts',
  exclude: new Set(['node_modules']),
  extensions: ['ts', 'tsx']
}

const cli = meow(
  `
	Options
	  --entry, -e  path to the package index file. relative to the package directory
    --collect-usages, -u  outputs a list of all unique uses of the package
    --extensions, -x  list of file extensions to be considered during the search
`,
  {
    importMeta: import.meta,
    allowUnknownFlags: false,
    description: false,
    flags: {
      entry: { type: 'string', shortFlag: 'e' },
      extensions: { type: 'string', shortFlag: 'x' },
      collectUsages: { type: 'string', shortFlag: 'u' }
    }
  }
)

const getConfig = async () => {
  const result = (await lilconfig('pure-index', {
    searchPlaces: [
      'package.json',
      '.pure-index.json',
      '.pure-index.js',
      '.pure-index.cjs'
    ]
  }).search()) || { config: BASE_CONFIG }

  const {
    exclude = [],
    babelPlugins = [],
    entry = BASE_CONFIG.entry,
    batch = {},
    extensions = BASE_CONFIG.extensions
  } = result.config

  return result === null
    ? BASE_CONFIG
    : {
        entry: cli.flags.entry || entry,
        exclude: new Set([...BASE_CONFIG.exclude, ...exclude]),
        babelPlugins: new Set([...BASE_CONFIG.babelPlugins, ...babelPlugins]),
        batch: {
          default: batch.default || BASE_CONFIG.batch.defaul
        },
        collectUsages: cli.flags.collectUsages || BASE_CONFIG.collectUsages,
        extensions: cli.flags.extensions
          ? cli.flags.extensions.split(',')
          : extensions
      }
}

export { getConfig }
