import { execFileSync } from 'node:child_process';
import { rmSync } from 'node:fs';
export default function setup() {
  const directory = process.env.LUXENIA_TEST_DIRECTORY;
  if (!directory?.includes('luxenia-tests-')) throw new Error('Unsafe test database path');
  execFileSync(process.execPath, ['node_modules/prisma/build/index.js', 'migrate', 'deploy'], { env: process.env, stdio: 'pipe' });
  return () => rmSync(directory, { recursive: true, force: true });
}
