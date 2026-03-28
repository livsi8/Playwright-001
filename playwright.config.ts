import { defineConfig } from '@playwright/test';
import { getBrandConfig } from './src/config/brand-registry';
import { getRuntimeOptions } from './src/config/runtime-options';

const runtimeOptions = getRuntimeOptions();
const brandConfig = getBrandConfig(runtimeOptions.brand);

export default defineConfig({
  fullyParallel: true,
  timeout: brandConfig.timeouts.test,
  expect: {
    timeout: brandConfig.timeouts.expect
  },
  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],
  outputDir: 'test-results',
  use: {
    baseURL: brandConfig.baseUiUrl,
    headless: brandConfig.browser.headless,
    viewport: brandConfig.browser.viewport,
    actionTimeout: brandConfig.timeouts.action,
    navigationTimeout: brandConfig.timeouts.navigation,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true
  },
  projects: [
    {
      name: 'ui',
      testDir: './tests/ui'
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: brandConfig.baseApiUrl
      }
    }
  ]
});
