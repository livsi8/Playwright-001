import { APIRequestContext, BrowserContext, Locator, Page, expect, request as playwrightRequest, test as base } from '@playwright/test';
import { ApiClient } from '../../api/clients/api-client';
import { BookStoreApiSteps } from '../../api/steps/book-store.steps';
import { getBrandConfig } from '../../config/brand-registry';
import { BrandAccount, BrandConfig } from '../../config/types';
import { AccountManager } from '../../shared/account-manager/account-manager';
import { Logger } from '../../shared/logger/logger';
import { SoftAssert } from '../../shared/soft-assert/soft-assert';
import { BrowserExecutionProfile, resolveBrowserExecutionProfile } from '../../shared/tag-utils/runtime-profile';
import { BrowserLaunchDetails, launchBrowserSession } from '../../ui/helpers/browser-session-launch';
import { AlertsPage } from '../../ui/pages/alerts.page';
import { BrowserWindowsPage } from '../../ui/pages/browser-windows.page';
import { FramesPage } from '../../ui/pages/frames.page';
import { HomePage } from '../../ui/pages/home.page';
import { ModalDialogsPage } from '../../ui/pages/modal-dialogs.page';
import { PracticeFormPage } from '../../ui/pages/practice-form.page';
import { SectionPage } from '../../ui/pages/section.page';
import { AlertsSteps } from '../../ui/steps/alerts.steps';
import { BrowserWindowsSteps } from '../../ui/steps/browser-windows.steps';
import { CardValidationSteps } from '../../ui/steps/card-validation.steps';
import { CssVerificationSteps } from '../../ui/steps/css-verification.steps';
import { FramesSteps } from '../../ui/steps/frames.steps';
import { HomePageSteps } from '../../ui/steps/home-page.steps';
import { HomeSteps } from '../../ui/steps/home.steps';
import { ModalDialogsSteps } from '../../ui/steps/modal-dialogs.steps';

interface WorkerFixtures {
  brandConfig: BrandConfig;
  account: BrandAccount;
}

interface TestFixtures {
  isIncognitoTest: boolean;
  browserExecutionProfile: BrowserExecutionProfile;
  browserLaunchDetails: BrowserLaunchDetails | undefined;
  logger: Logger;
  softAssert: SoftAssert;
  apiRequestContext: APIRequestContext;
  apiClient: ApiClient;
  bookStoreApiSteps: BookStoreApiSteps;
  browserWindowsPage: BrowserWindowsPage;
  alertsPage: AlertsPage;
  framesPage: FramesPage;
  modalDialogsPage: ModalDialogsPage;
  cssVerificationSteps: CssVerificationSteps;
  browserWindowsSteps: BrowserWindowsSteps;
  alertsSteps: AlertsSteps;
  framesSteps: FramesSteps;
  modalDialogsSteps: ModalDialogsSteps;
  homePage: HomePage;
  cardValidationSteps: CardValidationSteps;
  homePageSteps: HomePageSteps;
  sectionPage: SectionPage;
  practiceFormPage: PracticeFormPage;
  homeSteps: HomeSteps;
}

export const test = base.extend<TestFixtures, WorkerFixtures>({
  brandConfig: [
    async ({}, use) => {
      // Brand is resolved once per worker to keep configuration immutable during parallel execution.
      await use(getBrandConfig(process.env.BRAND ?? 'demoqa'));
    },
    { scope: 'worker' }
  ],
  account: [
    async ({ brandConfig }, use, workerInfo) => {
      await use(AccountManager.allocate(brandConfig.accounts, workerInfo.parallelIndex));
    },
    { scope: 'worker' }
  ],
  browserExecutionProfile: async ({ brandConfig }, use, testInfo) => {
    const profile = resolveBrowserExecutionProfile(testInfo.title, brandConfig.browser.browserName);
    Logger.system(
      'BrowserSelection',
      `test="${testInfo.title}" | tags=${profile.tags.join(', ') || 'none'} | browser=${profile.browserName} | mode=${profile.mode} | reasons=${profile.reasons.join(
        '; '
      )}`
    );
    await use(profile);
  },
  isIncognitoTest: async ({ browserExecutionProfile }, use) => {
    await use(browserExecutionProfile.mode === 'incognito');
  },
  browserLaunchDetails: async ({ context }, use, testInfo) => {
    const details = (testInfo as typeof testInfo & { _browserLaunchDetails?: BrowserLaunchDetails })._browserLaunchDetails;
    await use(details);
  },
  // The framework manages browser sessions itself so browser selection by tag
  // happens before any default Playwright page/context can start.
  context: async ({ logger, browserExecutionProfile }, use, testInfo) => {
    const session = await launchBrowserSession(
      browserExecutionProfile,
      testInfo.project.use as Record<string, unknown>,
      logger
    );

    (testInfo as typeof testInfo & { _browserLaunchDetails?: BrowserLaunchDetails })._browserLaunchDetails = session.details;
    (testInfo as typeof testInfo & { _managedPage?: Page })._managedPage = session.page;

    await use(session.context as BrowserContext);

    await session.close();
  },
  page: async ({ context }, use, testInfo) => {
    const managedPage = (testInfo as typeof testInfo & { _managedPage?: Page })._managedPage;
    await use(managedPage ?? (await context.newPage()));
  },
  logger: async ({}, use, testInfo) => {
    const logger = new Logger(`worker-${testInfo.parallelIndex} | ${testInfo.project.name} | ${testInfo.title}`);
    logger.info('Test started');
    await use(logger);
    logger.info(`Test finished with status=${testInfo.status}`);
  },
  softAssert: async ({}, use) => {
    await use(new SoftAssert());
  },
  apiRequestContext: async ({ brandConfig }, use) => {
    const requestContext = await playwrightRequest.newContext({
      baseURL: brandConfig.baseApiUrl,
      extraHTTPHeaders: {
        Accept: 'application/json'
      }
    });
    await use(requestContext);
    await requestContext.dispose();
  },
  apiClient: async ({ apiRequestContext, logger }, use) => {
    await use(new ApiClient(apiRequestContext, logger));
  },
  bookStoreApiSteps: async ({ apiClient, logger }, use) => {
    await use(new BookStoreApiSteps(apiClient, logger));
  },
  browserWindowsPage: async ({ page, logger }, use) => {
    await use(new BrowserWindowsPage(page, logger));
  },
  alertsPage: async ({ page, logger }, use) => {
    await use(new AlertsPage(page, logger));
  },
  framesPage: async ({ page, logger }, use) => {
    await use(new FramesPage(page, logger));
  },
  modalDialogsPage: async ({ page, logger }, use) => {
    await use(new ModalDialogsPage(page, logger));
  },
  cssVerificationSteps: async ({ logger }, use) => {
    await use(new CssVerificationSteps(logger));
  },
  browserWindowsSteps: async ({ browserWindowsPage, cssVerificationSteps, logger }, use) => {
    await use(new BrowserWindowsSteps(browserWindowsPage, cssVerificationSteps, logger));
  },
  alertsSteps: async ({ alertsPage, cssVerificationSteps, logger }, use) => {
    await use(new AlertsSteps(alertsPage, cssVerificationSteps, logger));
  },
  framesSteps: async ({ framesPage, logger }, use) => {
    await use(new FramesSteps(framesPage, logger));
  },
  modalDialogsSteps: async ({ modalDialogsPage, cssVerificationSteps, logger }, use) => {
    await use(new ModalDialogsSteps(modalDialogsPage, cssVerificationSteps, logger));
  },
  homePage: async ({ page, logger }, use) => {
    await use(new HomePage(page, logger));
  },
  cardValidationSteps: async ({ homePage, logger }, use) => {
    await use(new CardValidationSteps(homePage, logger));
  },
  homePageSteps: async ({ homePage, cardValidationSteps, logger }, use) => {
    await use(new HomePageSteps(homePage, cardValidationSteps, logger));
  },
  sectionPage: async ({ page, logger }, use) => {
    await use(new SectionPage(page, logger));
  },
  practiceFormPage: async ({ page, logger }, use) => {
    await use(new PracticeFormPage(page, logger));
  },
  homeSteps: async ({ page, homePage, sectionPage, practiceFormPage, logger }, use) => {
    await use(new HomeSteps(page, homePage, sectionPage, practiceFormPage, logger));
  }
});

export { expect, Locator, Page };
