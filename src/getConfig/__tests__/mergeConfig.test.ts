import { expect, test } from 'vitest';

import { mergeConfig } from '../index.js';

test('mergeConfig', () => {
  const data = {
    dir: 'dir',
    batch: 1,
    exclude: ['exclude'],
    extensions: ['jsx'],
    parserConfig: { syntax: 'ecmascript' } as const,
    collectUsages: 'collectUsages',
    entry: 'entry',
  };

  expect(mergeConfig(data)).toStrictEqual({
    ...data,
    exclude: ['node_modules', ...data.exclude],
  });
});
