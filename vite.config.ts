import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    watch: false,
    reporters: 'basic',
    typecheck: { enabled: true },
  },
});
