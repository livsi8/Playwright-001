import { parseCliArgs } from '../shared/utils/cli-args';

export interface RuntimeOptions {
  brand: string;
  workers?: number;
  tags?: string;
  type: 'ui' | 'api' | 'all';
}

let cachedRuntimeOptions: RuntimeOptions | undefined;

export function getRuntimeOptions(): RuntimeOptions {
  if (cachedRuntimeOptions) {
    return cachedRuntimeOptions;
  }

  const parsedArgs = parseCliArgs(process.argv.slice(2));

  cachedRuntimeOptions = {
    brand: process.env.BRAND ?? parsedArgs.brand ?? 'demoqa',
    workers: Number(process.env.WORKERS ?? parsedArgs.workers),
    tags: process.env.TAG_EXPRESSION ?? parsedArgs.tags,
    type: (process.env.TEST_TYPE as RuntimeOptions['type']) ?? parsedArgs.type ?? 'all'
  };

  return cachedRuntimeOptions;
}
