import { demoQaConfig } from './brands/demoqa';
import { BrandConfig, BrandKey } from './types';

const brandRegistry: Record<BrandKey, BrandConfig> = {
  demoqa: demoQaConfig
};

export function getBrandConfig(brandKey: string): BrandConfig {
  const normalizedBrand = brandKey.toLowerCase() as BrandKey;
  const brandConfig = brandRegistry[normalizedBrand];

  if (!brandConfig) {
    throw new Error(`Unsupported brand "${brandKey}". Available brands: ${Object.keys(brandRegistry).join(', ')}`);
  }

  return brandConfig;
}

export function listAvailableBrands(): BrandKey[] {
  return Object.keys(brandRegistry) as BrandKey[];
}
