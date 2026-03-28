import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium, firefox, webkit, Browser, BrowserContext, BrowserContextOptions, LaunchOptions, Page } from '@playwright/test';
import { Logger } from '../../shared/logger/logger';
import { BrowserExecutionProfile } from '../../shared/tag-utils/runtime-profile';

export interface BrowserLaunchDetails {
  browserName: BrowserExecutionProfile['browserName'];
  mode: BrowserExecutionProfile['mode'];
  strategy: 'default-project-browser' | 'launch-arg' | 'isolated-context';
  launchArgs: string[];
}

interface BrowserSession {
  browser?: Browser;
  context: BrowserContext;
  page: Page;
  details: BrowserLaunchDetails;
  close: () => Promise<void>;
}

function resolveLaunchDetails(profile: BrowserExecutionProfile): BrowserLaunchDetails {
  if (profile.browserName === 'firefox' && profile.mode === 'incognito') {
    return {
      browserName: 'firefox',
      mode: 'incognito',
      strategy: 'launch-arg',
      launchArgs: ['-private-window']
    };
  }

  if (profile.browserName === 'chromium' && profile.mode === 'incognito') {
    return {
      browserName: 'chromium',
      mode: 'incognito',
      strategy: 'launch-arg',
      launchArgs: ['--incognito']
    };
  }

  if (profile.browserName === 'webkit' && profile.mode === 'incognito') {
    return {
      browserName: 'webkit',
      mode: 'incognito',
      strategy: 'isolated-context',
      launchArgs: []
    };
  }

  return {
    browserName: profile.browserName,
    mode: profile.mode,
    strategy: 'isolated-context',
    launchArgs: []
  };
}

export async function launchBrowserSession(
  profile: BrowserExecutionProfile,
  projectUse: Record<string, unknown>,
  logger: Logger
): Promise<BrowserSession> {
  const details = resolveLaunchDetails(profile);
  const browserType = details.browserName === 'firefox' ? firefox : details.browserName === 'webkit' ? webkit : chromium;

  const launchOptions: LaunchOptions = {
    headless: Boolean(projectUse.headless),
    args: details.launchArgs
  };

  if (details.browserName === 'chromium') {
    launchOptions.channel = 'chrome';
  }

  logger.info(
    `Launching ${details.browserName} for mode=${details.mode} with strategy=${details.strategy} args=${JSON.stringify(
      details.launchArgs
    )}`
  );

  const contextOptions: BrowserContextOptions = {
    baseURL: typeof projectUse.baseURL === 'string' ? projectUse.baseURL : undefined,
    viewport: typeof projectUse.viewport === 'object' ? (projectUse.viewport as BrowserContextOptions['viewport']) : undefined,
    ignoreHTTPSErrors: Boolean(projectUse.ignoreHTTPSErrors),
    storageState: undefined
  };

  if (details.strategy === 'launch-arg') {
    const userDataDir = mkdtempSync(join(tmpdir(), `pw-${details.browserName}-${details.mode}-`));
    const context = await browserType.launchPersistentContext(userDataDir, {
      ...launchOptions,
      ...contextOptions
    });
    const page = context.pages()[0] ?? (await context.newPage());

    if (typeof projectUse.actionTimeout === 'number') {
      page.setDefaultTimeout(projectUse.actionTimeout);
    }

    if (typeof projectUse.navigationTimeout === 'number') {
      page.setDefaultNavigationTimeout(projectUse.navigationTimeout);
    }

    return {
      browser: context.browser() ?? undefined,
      context,
      page,
      details,
      close: async () => {
        await context.close();
      }
    };
  }

  const browser = await browserType.launch(launchOptions);
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();

  if (typeof projectUse.actionTimeout === 'number') {
    page.setDefaultTimeout(projectUse.actionTimeout);
  }

  if (typeof projectUse.navigationTimeout === 'number') {
    page.setDefaultNavigationTimeout(projectUse.navigationTimeout);
  }

  return {
    browser,
    context,
    page,
    details,
    close: async () => {
      await context.close();
      await browser.close();
    }
  };
}
