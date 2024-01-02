import { execSync } from 'node:child_process';

const getRepoRoot = () => execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();

export { getRepoRoot };
