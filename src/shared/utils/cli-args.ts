export interface CliOptions {
  brand: string;
  workers?: number;
  tags?: string;
  type?: 'ui' | 'api' | 'all';
}

export function parseCliArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    brand: process.env.BRAND ?? 'demoqa',
    type: undefined
  };

  for (const rawArg of argv) {
    if (!rawArg.startsWith('--')) {
      continue;
    }

    const [key, rawValue] = rawArg.slice(2).split('=');
    const value = rawValue ?? '';

    switch (key) {
      case 'brand':
        options.brand = value || options.brand;
        break;
      case 'workers':
        options.workers = Number(value);
        break;
      case 'tags':
        options.tags = value;
        break;
      case 'type':
        if (value === 'ui' || value === 'api' || value === 'all') {
          options.type = value;
        }
        break;
      default:
        break;
    }
  }

  return options;
}
