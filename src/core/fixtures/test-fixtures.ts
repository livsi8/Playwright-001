import { APIRequestContext, Locator, Page, expect, request as playwrightRequest, test as base } from '@playwright/test';
import { ApiClient } from '../../api/clients/api-client';
import { BookStoreApiSteps } from '../../api/steps/book-store.steps';
import { getBrandConfig } from '../../config/brand-registry';
import { BrandAccount, BrandConfig } from '../../config/types';
import { AccountManager } from '../../shared/account-manager/account-manager';
import { Logger } from '../../shared/logger/logger';
import { SoftAssert } from '../../shared/soft-assert/soft-assert';
import { AlertsPage } from '../../ui/pages/alerts.page';
import { BrowserWindowsPage } from '../../ui/pages/browser-windows.page';
import { FramesPage } from '../../ui/pages/frames.page';
import { HomePage } from '../../ui/pages/home.page';
import { ModalDialogsPage } from '../../ui/pages/modal-dialogs.page';
import { PracticeFormPage } from '../../ui/pages/practice-form.page';
import { SectionPage } from '../../ui/pages/section.page';
import { AlertsWindowsSteps } from '../../ui/steps/alerts-windows.steps';
import { HomeSteps } from '../../ui/steps/home.steps';

interface WorkerFixtures {
  brandConfig: BrandConfig;
  account: BrandAccount;
}

interface TestFixtures {
  logger: Logger;
  softAssert: SoftAssert;
  apiRequestContext: APIRequestContext;
  apiClient: ApiClient;
  bookStoreApiSteps: BookStoreApiSteps;
  browserWindowsPage: BrowserWindowsPage;
  alertsPage: AlertsPage;
  framesPage: FramesPage;
  modalDialogsPage: ModalDialogsPage;
  homePage: HomePage;
  sectionPage: SectionPage;
  practiceFormPage: PracticeFormPage;
  homeSteps: HomeSteps;
  alertsWindowsSteps: AlertsWindowsSteps;
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
  homePage: async ({ page, logger }, use) => {
    await use(new HomePage(page, logger));
  },
  sectionPage: async ({ page, logger }, use) => {
    await use(new SectionPage(page, logger));
  },
  practiceFormPage: async ({ page, logger }, use) => {
    await use(new PracticeFormPage(page, logger));
  },
  homeSteps: async ({ page, homePage, sectionPage, practiceFormPage, logger }, use) => {
    await use(new HomeSteps(page, homePage, sectionPage, practiceFormPage, logger));
  },
  alertsWindowsSteps: async ({ browserWindowsPage, alertsPage, framesPage, modalDialogsPage, logger }, use) => {
    await use(new AlertsWindowsSteps(browserWindowsPage, alertsPage, framesPage, modalDialogsPage, logger));
  }
});

export { expect, Locator, Page };
