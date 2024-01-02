import { collectUsages as _collectUsages } from '~/collectUsages.js';
import { mergeConfig, type Config } from '~/getConfig/index.js';
import { Ok, Err } from '~/shared/index.js';

type ListItem = {
  dir: Config['dir'];
  batch?: Config['batch'];
  exclude?: string[];
  extensions?: Config['extensions'];
  parserConfig?: Config['parserConfig'];
};

const collectUsages = async (name: string, list: ListItem[]) => {
  const tasks = list.map((x) =>
    _collectUsages({
      // @ts-expect-error 123
      config: mergeConfig({
        ...x,
        collectUsages: name,
      }),
    }),
  );

  const result = await Promise.all(tasks);

  const mergedUsages = result.reduce<string[]>((acc, x) => {
    if (x.ok) {
      acc = acc.concat([...x.val.usages]);
    }

    return acc;
  }, []);

  return mergedUsages.length === 0 ? Err({ usages: new Set<void>() }) : Ok({ usages: new Set(mergedUsages) });
};

export { collectUsages };
