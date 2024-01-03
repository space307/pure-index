import { lilconfig } from 'lilconfig';

import { cli } from './cli.js';
import { getRepoRoot } from '~/shared/index.js';

import type { ParserConfig } from '@swc/core';

type Config = {
  batch: number;
  collectUsages: string | null;
  entry: string;
  dir: string;
  exclude: string[];
  extensions: string[];
  parserConfig: ParserConfig;
};

const BASE_CONFIG: Config = {
  batch: 100,
  collectUsages: null,
  dir: '',
  entry: 'index.ts',
  exclude: ['node_modules'],
  extensions: ['ts', 'tsx'],
  parserConfig: {
    syntax: 'typescript',
    tsx: true,
  },
};

const mergeConfig = (x: Partial<Config>): Config => ({
  batch: x.batch || BASE_CONFIG.batch,
  collectUsages: x.collectUsages || BASE_CONFIG.collectUsages,
  dir: x.dir || getRepoRoot(),
  entry: x.entry || BASE_CONFIG.entry,
  exclude: x.exclude ? [...new Set([...BASE_CONFIG.exclude, ...x.exclude])] : BASE_CONFIG.exclude,
  extensions: x.extensions || BASE_CONFIG.extensions,
  parserConfig: x.parserConfig || BASE_CONFIG.parserConfig,
});

const getConfig = async (): Promise<Config> => {
  const result = (await lilconfig('pure-index', {
    searchPlaces: ['.pure-index.json'],
  }).search()) || { config: {} };

  return mergeConfig({
    ...result.config,
    entry: cli.flags.entry || result.config.entry,
    collectUsages: cli.flags.collectUsages,
  });
};

export { getConfig, mergeConfig, BASE_CONFIG };
export type { Config };
