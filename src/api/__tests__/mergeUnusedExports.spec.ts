import { test, expect } from 'vitest';

import { mergeUnusedExports } from '../findUnusedExports.js';
import { Err, ObservableSet } from '~/shared/index.js';

test.each([
  [
    [
      ['3', '4', '5', '7'],
      ['1', '2', '3'],
    ],
    ['3'],
  ],
  // prettier-ignore
  [
    [
      ['3', '4', '5', '7']
    ],
    ['3', '4', '5', '7']
  ],
  // prettier-ignore
  [
    [
      ['3', '4', '5', '7'],
      ['1']
    ],
    []
  ],
  // prettier-ignore
  [
    [
      ['3', '4', '5', '7'],
      ['1', '2', '3'],
      ['8']
    ],
    []
  ],
  // prettier-ignore
  [
    [
      ['3', '4', '5', '7'],
      ['1', '2', '3'],
      ['8', '3'],
    ],
    ['3'],
  ],
  // prettier-ignore
  [
    [
      ['3', '4', '5', '7'],
      []
    ],
    []
  ],
  // prettier-ignore
  [
    [[], []],
    []
  ],
])('mergeUnusedExports (%o)', (data, result) => {
  const one = data.map((x) => Err({ reason: 'unused_exports', exports: new ObservableSet(x) }));
  const two = one.reverse();

  if (result.length === 0) {
    // @ts-expect-error
    expect(mergeUnusedExports(one).ok).toBe(true);
    // @ts-expect-error
    expect(mergeUnusedExports(two).ok).toBe(true);
  } else {
    // @ts-expect-error
    expect(Array.from(mergeUnusedExports(one).err.exports)).toStrictEqual(result);
    // @ts-expect-error
    expect(Array.from(mergeUnusedExports(two).err.exports)).toStrictEqual(result);
  }
});
