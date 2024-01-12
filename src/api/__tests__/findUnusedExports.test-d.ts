import { expectTypeOf, test, expect } from 'vitest';
import { findUnusedExports } from '../findUnusedExports.js';

import type { Result } from '~/shared/index.js';

type Params = {
  entry: string;
  location?: string;
};

type ListItem = {
  dir: string;
  batch?: number;
  exclude?: string[];
  extensions?: string[];
};

type Returns = Result<
  { exports: Set<void> },
  | {
      reason: 'unused_exports';
      exports: Set<string>;
    }
  | {
      reason: 'no_imports';
      exports: Set<string>;
    }
  | {
      reason: 'no_exports';
      exports: Set<string>;
    }
>;

test('findUnusedExports signature', () => {
  expectTypeOf(findUnusedExports).toBeFunction();
  expectTypeOf(findUnusedExports).parameter(0).toMatchTypeOf<Params>();
  expectTypeOf(findUnusedExports).parameter(1).toMatchTypeOf<ListItem[]>();
  expect(findUnusedExports.length).toBe(2);

  expectTypeOf(findUnusedExports).returns.resolves.toMatchTypeOf<Returns>();
});
