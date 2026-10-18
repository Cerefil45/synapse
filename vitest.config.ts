import path from 'node:path';
import { defineConfig } from 'vitest/config';

// Standalone adaptation of the origin config (packages/synapse/vitest.config.ts):
// tests moved from src/__tests__/ to tests/, plus an alias so the verbatim test
// import '@rotom/synapse' resolves without workspace symlinks.
export default defineConfig({
  resolve: {
    alias: {
      '@rotom/synapse': path.resolve(__dirname, 'src/index.ts'),
    },
  },
  test: {
    include: ['tests/**/*.test.ts'],
  },
});
