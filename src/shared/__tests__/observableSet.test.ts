import { expect, vi, test } from 'vitest';
import { ObservableSet } from '../observableSet.js';

test('observableSet', () => {
  const onEmpty = vi.fn();
  const set = new ObservableSet();
  set.onEmpty(onEmpty);

  set.add('a');
  set.add('b');

  expect(set.size).toEqual(2);
  expect(onEmpty).toBeCalledTimes(0);

  set.delete('a');
  set.delete('b');

  expect(set.size).toEqual(0);
  expect(onEmpty).toBeCalledTimes(1);

  set.add('a');
  set.clear();

  expect(set.size).toEqual(0);
  expect(onEmpty).toBeCalledTimes(2);
});
