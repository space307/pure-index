import { lilconfig } from 'lilconfig'
// @ts-expect-error
import meow from 'meow'

import { getRepoRoot } from 'shared'

import type { ParserPlugin } from '@babel/parser'

const BASE_CONFIG = {
  babelPlugins: ['typescript'] as ParserPlugin[],
  batch: 100,
  collectUsages: null,
  entry: 'index.ts',
  dir: null,
  exclude: new Set(['node_modules']),
  extensions: ['ts', 'tsx']
}

const cli = meow(
  `
	Options
	  --entry, -e  path to the package index file. relative to the package directory
    --exclude, -i list of directories that will be excluded when searching for imports
    --extensions, -x  list of file extensions to be considered during the search
    --dir, -d  path to the directory where imports should be searched for
    --babel-plugins, -p  list of babel plugins that will be used when parsing files
    --batch, -b  number of files to be traversed in parallel
    --collect-usages, -u  outputs a list of all unique uses of the package
`,
  {
    importMeta: import.meta,
    allowUnknownFlags: false,
    description: false,
    flags: {
      entry: { type: 'string', shortFlag: 'e' },
      exclude: { type: 'string', shortFlag: 'i' },
      extensions: { type: 'string', shortFlag: 'x' },
      dir: { type: 'string', shortFlag: 'd' },
      babelPlugins: { type: 'string', shortFlag: 'p' },
      batch: { type: 'number', shortFlag: 'b' },
      collectUsages: { type: 'string', shortFlag: 'u' }
    }
  }
)

type Config = Omit<typeof BASE_CONFIG, 'dir'> & {
  dir: string
}

const getConfig = async (): Promise<Config> => {
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
    babelPlugins = BASE_CONFIG.babelPlugins,
    entry = BASE_CONFIG.entry,
    batch = BASE_CONFIG.batch,
    extensions = BASE_CONFIG.extensions,
    dir
  } = result.config

  return result === null
    ? BASE_CONFIG
    : {
        entry: cli.flags.entry || entry,
        exclude: cli.flags.exclude
          ? new Set([...BASE_CONFIG.exclude, ...cli.flags.exclude.split(',')])
          : new Set([...BASE_CONFIG.exclude, ...exclude]),
        babelPlugins: cli.flags.babelPlugins
          ? cli.flags.babelPlugins.split(',')
          : babelPlugins,
        batch: cli.flags.batch || batch,
        collectUsages: cli.flags.collectUsages || BASE_CONFIG.collectUsages,
        extensions: cli.flags.extensions
          ? cli.flags.extensions.split(',')
          : extensions,
        dir: cli.flags.dir || dir || getRepoRoot()
      }
}

export { getConfig, BASE_CONFIG }
export type { Config }
