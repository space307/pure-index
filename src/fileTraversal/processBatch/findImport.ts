import { createReadStream } from 'node:fs';

type Params = {
  path: string;
  tokens: string[];
};

const highWaterMark = 65536; // 64 * 1024

const findImport = ({ path, tokens }: Params): Promise<Params['path'] | null> =>
  new Promise((resolve, reject) => {
    const readStream = createReadStream(path, { highWaterMark });

    readStream.on('data', (chunk) => {
      if (tokens.some((token) => chunk.includes(token))) {
        readStream.destroy();
        resolve(path);
      }
    });

    readStream.on('end', () => {
      resolve(null);
    });

    readStream.on('error', reject);
  });

export { findImport };
