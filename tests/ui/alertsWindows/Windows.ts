import { expect, test } from '../../../src/core/fixtures/test-fixtures';
import { createTaggedTest } from '../../../src/shared/tag-utils/tagged-test';

const it = createTaggedTest(test);

test.describe('Demo QA browser windows', () => {
  test.describe.configure({ mode: 'parallel' });

  it(
    'should validate browser windows buttons styles and hover behavior',
    ['@ui', '@demoqa', '@alertsWindows', '@windows', '@regression', '@c201'],
    async ({ browserWindowsSteps, softAssert }) => {
      await browserWindowsSteps.givenBrowserWindowsPageIsOpened();
      await browserWindowsSteps.thenActionButtonsHaveExpectedVisualState(softAssert);
      softAssert.assertAll();
    }
  );

  it(
    'should open expected popups for browser window actions',
    ['@ui', '@demoqa', '@alertsWindows', '@windows', '@smoke', '@regression', '@c202'],
    async ({ browserWindowsSteps }) => {
      await browserWindowsSteps.givenBrowserWindowsPageIsOpened();

      const newTab = await browserWindowsSteps.whenNewTabPopupIsOpened();
      browserWindowsSteps.thenSamplePopupShouldBeDisplayed(newTab.summary);
      await newTab.popup.close();

      const newWindow = await browserWindowsSteps.whenNewWindowPopupIsOpened();
      browserWindowsSteps.thenSamplePopupShouldBeDisplayed(newWindow.summary);
      await newWindow.popup.close();

      const messageWindow = await browserWindowsSteps.whenWindowMessagePopupIsOpened();
      browserWindowsSteps.thenWindowMessagePopupShouldBeDisplayed(messageWindow.summary);
      await messageWindow.popup.close();
    }
  );
});
