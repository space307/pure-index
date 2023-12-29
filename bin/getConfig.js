import { join } from 'node:path'
import { lilconfig } from 'lilconfig'
import meow from 'meow'

const BASE_CONFIG = {
  babelPlugins: new Set(['typescript']),
  batch: 100,
  collectUsages: null,
  entry: 'index.ts',
  exclude: new Set(['node_modules']),
  extensions: ['ts', 'tsx']
}

// todo: add exclude
// todo: add babelPlugins
const cli = meow(
  `
	Options
	  --entry, -e  path to the package index file. relative to the package directory
    --extensions, -x  list of file extensions to be considered during the search
    --batch, -b  number of files to be traversed in parallel
    --collect-usages, -u  outputs a list of all unique uses of the package
`,
  {
    importMeta: import.meta,
    allowUnknownFlags: false,
    description: false,
    flags: {
      entry: { type: 'string', shortFlag: 'e' },
      extensions: { type: 'string', shortFlag: 'x' },
      batch: { type: 'number', shortFlag: 'b' },
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
    batch = BASE_CONFIG.batch,
    extensions = BASE_CONFIG.extensions
  } = result.config

  return result === null
    ? BASE_CONFIG
    : {
        entry: cli.flags.entry || entry,
        exclude: new Set([...BASE_CONFIG.exclude, ...exclude]),
        babelPlugins: new Set([...BASE_CONFIG.babelPlugins, ...babelPlugins]),
        batch: cli.flags.batch || batch,
        collectUsages: cli.flags.collectUsages || BASE_CONFIG.collectUsages,
        extensions: cli.flags.extensions
          ? cli.flags.extensions.split(',')
          : extensions
      }
}

export { getConfig }
