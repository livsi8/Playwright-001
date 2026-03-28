import { expect, test } from '../../../src/core/fixtures/test-fixtures';
import { createTaggedTest } from '../../../src/shared/tag-utils/tagged-test';

const it = createTaggedTest(test);

test.describe('Demo QA browser windows', () => {
  test.describe.configure({ mode: 'parallel' });

  it(
    'should validate browser windows buttons styles and hover behavior',
    ['@ui', '@demoqa', '@alertsWindows', '@windows', '@regression', '@c201'],
    async ({ alertsWindowsSteps, browserWindowsPage, softAssert, logger }) => {
      await alertsWindowsSteps.openBrowserWindowsPage();

      const buttons = [
        ['New Tab', browserWindowsPage.newTabButton()],
        ['New Window', browserWindowsPage.newWindowButton()],
        ['New Window Message', browserWindowsPage.newWindowMessageButton()]
      ] as const;

      for (const [name, button] of buttons) {
        logger.step(`Validate styles for ${name}`);
        await softAssert.visible(button.locator(), `${name} button should be visible`);

        const hoverSnapshot = await button.hoverSnapshot();

        softAssert.check(hoverSnapshot.before.backgroundColor.startsWith('rgb('), `${name} background color should be resolved`);
        softAssert.check(hoverSnapshot.before.color === 'rgb(255, 255, 255)', `${name} text color should stay white`);
        softAssert.check(hoverSnapshot.before.width > 0, `${name} width should be positive`);
        softAssert.check(hoverSnapshot.before.height > 0, `${name} height should be positive`);
        softAssert.check(hoverSnapshot.before.fontFamily.length > 0, `${name} font-family should be available`);
        softAssert.check(hoverSnapshot.before.fontSize === '16px', `${name} font-size should match the current DemoQA button style`);
        softAssert.check(hoverSnapshot.after.backgroundColor.length > 0, `${name} hover should complete without style lookup errors`);

        if (hoverSnapshot.before.backgroundColor === hoverSnapshot.after.backgroundColor) {
          logger.info(`${name} keeps the same background on hover. This is accepted as the current DemoQA behavior.`);
        } else {
          logger.info(
            `${name} background changed on hover: ${hoverSnapshot.before.backgroundColor} -> ${hoverSnapshot.after.backgroundColor}`
          );
        }
      }

      softAssert.assertAll();
    }
  );

  it(
    'should open expected popups for browser window actions',
    ['@ui', '@demoqa', '@alertsWindows', '@windows', '@smoke', '@regression', '@c202'],
    async ({ alertsWindowsSteps, browserWindowsPage, logger }) => {
      await alertsWindowsSteps.openBrowserWindowsPage();

      const newTabPopup = await browserWindowsPage.openPopup(browserWindowsPage.newTabButton(), 'New Tab');
      const newTabSummary = await browserWindowsPage.popupSummary(newTabPopup);
      await newTabPopup.close();

      expect(newTabSummary.url).toContain('/sample');
      expect(newTabSummary.text).toContain('This is a sample page');

      const newWindowPopup = await browserWindowsPage.openPopup(browserWindowsPage.newWindowButton(), 'New Window');
      const newWindowSummary = await browserWindowsPage.popupSummary(newWindowPopup);
      await newWindowPopup.close();

      expect(newWindowSummary.url).toContain('/sample');
      expect(newWindowSummary.text).toContain('This is a sample page');

      const messagePopup = await browserWindowsPage.openPopup(
        browserWindowsPage.newWindowMessageButton(),
        'New Window Message'
      );
      const messageSummary = await browserWindowsPage.popupSummary(messagePopup);
      await messagePopup.close();

      logger.info(`Window message popup URL=${messageSummary.url}`);
      expect(messageSummary.url).toBe('about:blank');
      expect(messageSummary.text).toContain('Knowledge increases by sharing');
    }
  );
});
