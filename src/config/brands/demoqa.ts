import { BrandConfig } from '../types';

export const demoQaConfig: BrandConfig = {
  key: 'demoqa',
  brandName: 'Demo QA',
  environmentName: 'public-demo',
  baseUiUrl: 'https://demoqa.com',
  baseApiUrl: 'https://demoqa.com',
  timeouts: {
    test: 45_000,
    expect: 10_000,
    action: 15_000,
    navigation: 20_000
  },
  browser: {
    browserName: 'chromium',
    headless: false,
    viewport: {
      width: 1600,
      height: 1000
    }
  },
  accounts: [
    {
      id: 'demoqa-user-00',
      email: 'user-00@xz.com',
      password: 'Password55',
      displayName: 'Demo QA User 00'
    },
    {
      id: 'demoqa-user-01',
      email: 'user-01@xz.com',
      password: 'Password55',
      displayName: 'Demo QA User 01'
    },
    {
      id: 'demoqa-user-02',
      email: 'user-02@xz.com',
      password: 'Password55',
      displayName: 'Demo QA User 02'
    },
    {
      id: 'demoqa-user-03',
      email: 'user-03@xz.com',
      password: 'Password55',
      displayName: 'Demo QA User 03'
    }
  ]
};
