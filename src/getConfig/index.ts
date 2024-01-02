import { lilconfig } from 'lilconfig';

import { cli } from './cli.js';
import { getRepoRoot } from '~/shared/index.js';

const BASE_CONFIG = {
  batch: 100,
  collectUsages: null,
  entry: 'index.ts',
  dir: null,
  exclude: new Set(['node_modules']),
  extensions: ['ts', 'tsx'],
};

type Config = Omit<typeof BASE_CONFIG, 'dir' | 'collectUsages'> & {
  dir: string;
  collectUsages: string | null;
};

const getConfig = async (): Promise<Config> => {
  const result = (await lilconfig('pure-index', {
    searchPlaces: ['package.json', '.pure-index.json', '.pure-index.js', '.pure-index.cjs'],
  }).search()) || { config: BASE_CONFIG };

  const {
    exclude = [],
    entry = BASE_CONFIG.entry,
    batch = BASE_CONFIG.batch,
    extensions = BASE_CONFIG.extensions,
    dir,
  } = result.config;

  return {
    entry: cli.flags.entry || entry,
    exclude: cli.flags.exclude
      ? new Set([...BASE_CONFIG.exclude, ...cli.flags.exclude.split(',')])
      : new Set([...BASE_CONFIG.exclude, ...exclude]),
    batch: cli.flags.batch || batch,
    collectUsages: cli.flags.collectUsages || BASE_CONFIG.collectUsages,
    extensions: cli.flags.extensions ? cli.flags.extensions.split(',') : extensions,
    dir: cli.flags.dir || dir || getRepoRoot(),
  };
};

export { getConfig, BASE_CONFIG };
export type { Config };
