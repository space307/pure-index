import { createReadStream, type PathLike } from 'node:fs';
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';

type Params = {
  path: PathLike;
  tokens: string[];
};

const findImport = ({ path, tokens }: Params) =>
  new Promise((resolve, reject) => {
    const transformStream = new Transform({
      transform(chunk, _, callback) {
        if (chunk.includes(tokens[0]) || chunk.includes(tokens[1])) {
          this.push(chunk);
          resolve(true);
          this.destroy();
        } else {
          callback();
        }
      },
    });

    pipeline(createReadStream(path), transformStream)
      .then(() => resolve(false))
      .catch(reject);
  });

export { findImport };
