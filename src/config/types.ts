export type BrandKey = 'demoqa';

export interface BrandAccount {
  id: string;
  email: string;
  password: string;
  displayName: string;
}

export interface TimeoutConfig {
  test: number;
  expect: number;
  action: number;
  navigation: number;
}

export interface BrowserConfig {
  browserName: 'chromium';
  headless: boolean;
  viewport: {
    width: number;
    height: number;
  };
}

export interface BrandConfig {
  key: BrandKey;
  brandName: string;
  environmentName: string;
  baseUiUrl: string;
  baseApiUrl: string;
  timeouts: TimeoutConfig;
  browser: BrowserConfig;
  accounts: readonly BrandAccount[];
}
