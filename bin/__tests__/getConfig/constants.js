export const CONFIG = {
  babelPlugins: new Set(['typescript']),
  batch: 100,
  collectUsages: null,
  entry: 'index.ts',
  exclude: new Set(['node_modules']),
  extensions: ['ts', 'tsx']
}
