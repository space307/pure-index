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
  entry: 'index.ts',
  dir: '',
  exclude: ['node_modules'],
  extensions: ['ts', 'tsx'],
  parserConfig: {
    syntax: 'typescript',
    tsx: true,
  },
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
    parserConfig = BASE_CONFIG.parserConfig,
  } = result.config;

  return {
    entry: cli.flags.entry || entry,
    batch,
    parserConfig,
    exclude: [...new Set([...BASE_CONFIG.exclude, ...exclude])],
    collectUsages: cli.flags.collectUsages || BASE_CONFIG.collectUsages,
    extensions,
    dir: dir || getRepoRoot(),
  };
};

export { getConfig, BASE_CONFIG };
export type { Config };
