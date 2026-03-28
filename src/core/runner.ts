import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { getBrandConfig, listAvailableBrands } from '../config/brand-registry';
import { parseCliArgs } from '../shared/utils/cli-args';

const cliOptions = parseCliArgs(process.argv.slice(2));
const requestedType = cliOptions.type ?? 'all';

getBrandConfig(cliOptions.brand);

const playwrightCliPath = resolve(process.cwd(), 'node_modules', '@playwright', 'test', 'cli.js');
const args = [playwrightCliPath, 'test'];

if (requestedType === 'ui') {
  args.push('--project=ui');
} else if (requestedType === 'api') {
  args.push('--project=api');
}

if (cliOptions.workers && Number.isFinite(cliOptions.workers)) {
  args.push(`--workers=${cliOptions.workers}`);
}

const env = {
  ...process.env,
  BRAND: cliOptions.brand,
  WORKERS: cliOptions.workers ? String(cliOptions.workers) : process.env.WORKERS,
  TAG_EXPRESSION: cliOptions.tags ?? process.env.TAG_EXPRESSION,
  TEST_TYPE: requestedType
};

console.log(
  [
    `Running Playwright with brand=${cliOptions.brand}`,
    `type=${requestedType}`,
    `workers=${env.WORKERS ?? 'default'}`,
    `tags=${env.TAG_EXPRESSION ?? 'not-set'}`,
    `availableBrands=${listAvailableBrands().join(', ')}`
  ].join(' | ')
);

const result = spawnSync(process.execPath, args, {
  cwd: process.cwd(),
  env,
  stdio: 'inherit'
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 0);
