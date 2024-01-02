#!/usr/bin/env node

import { getConfig } from '~/getConfig/index.js';
import { collectUsages } from './collectUsages.js';
import { findUnusedExports } from './findUnusedExports.js';

const config = await getConfig();

if (config.collectUsages) {
  await collectUsages({ config });
}

await findUnusedExports({ config });
