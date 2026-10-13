import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
// Never use a developer or production database when running tests.
const directory = mkdtempSync(join(tmpdir(), 'luxenia-tests-'));
process.env.DATABASE_URL = `file:${join(directory, 'test.db')}`;
process.env.LUXENIA_TEST_DIRECTORY = directory;
export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('.', import.meta.url)) } },
  test: {
    environment: 'node', fileParallelism: false,
    globalSetup: ['./tests/setup-database.ts'],
    env: { DATABASE_URL: process.env.DATABASE_URL, AUTH_SECRET: 'test-only-secret-never-use-for-deployment', NODE_ENV: 'test' },
  },
});
