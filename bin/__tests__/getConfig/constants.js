export const CONFIG = {
  babelPlugins: new Set(['typescript']),
  batch: { default: 100 },
  collectUsages: null,
  entry: 'index.ts',
  exclude: new Set(['node_modules']),
  extensions: ['.ts', '.tsx']
}
