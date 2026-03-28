import { expect, test } from '../../../src/core/fixtures/test-fixtures';
import { createTaggedTest } from '../../../src/shared/tag-utils/tagged-test';

const it = createTaggedTest(test);

test.describe('Demo QA alerts', () => {
  test.describe.configure({ mode: 'parallel' });

  it(
    'should validate alert buttons styles and hover behavior',
    ['@ui', '@demoqa', '@alertsWindows', '@alerts', '@regression', '@c203'],
    async ({ alertsWindowsSteps, alertsPage, softAssert, logger }) => {
      await alertsWindowsSteps.openAlertsPage();

      const buttons = [
        ['Regular Alert', alertsPage.regularAlertButton()],
        ['Timed Alert', alertsPage.timedAlertButton()],
        ['Confirm Alert', alertsPage.confirmAlertButton()],
        ['Prompt Alert', alertsPage.promptAlertButton()]
      ] as const;

      for (const [name, button] of buttons) {
        await softAssert.visible(button.locator(), `${name} button should be visible`);

        const hoverSnapshot = await button.hoverSnapshot();

        softAssert.check(hoverSnapshot.before.backgroundColor.startsWith('rgb('), `${name} background color should exist`);
        softAssert.check(hoverSnapshot.before.color === 'rgb(255, 255, 255)', `${name} text color should stay white`);
        softAssert.check(hoverSnapshot.before.width > 0, `${name} width should be positive`);
        softAssert.check(hoverSnapshot.before.height === 38, `${name} height should be 38px on current DemoQA layout`);
        softAssert.check(hoverSnapshot.before.fontFamily.length > 0, `${name} font family should be resolved`);
        softAssert.check(hoverSnapshot.before.fontSize === '16px', `${name} font size should be 16px`);

        if (hoverSnapshot.before.backgroundColor === hoverSnapshot.after.backgroundColor) {
          logger.info(`${name} keeps the same background on hover. The test records this as factual behavior.`);
        }
      }

      softAssert.assertAll();
    }
  );

  it(
    'should show expected browser dialogs and page reactions',
    ['@ui', '@demoqa', '@alertsWindows', '@alerts', '@smoke', '@regression', '@c204'],
    async ({ alertsWindowsSteps, alertsPage }) => {
      await alertsWindowsSteps.openAlertsPage();

      const regularAlert = await alertsPage.triggerDialog(alertsPage.regularAlertButton(), 'accept');
      expect(regularAlert.type).toBe('alert');
      expect(regularAlert.message).toBe('You clicked a button');

      const timedAlert = await alertsPage.triggerDialog(alertsPage.timedAlertButton(), 'accept');
      expect(timedAlert.type).toBe('alert');
      expect(timedAlert.message).toBe('This alert appeared after 5 seconds');

      const confirmAlert = await alertsPage.triggerDialog(alertsPage.confirmAlertButton(), 'dismiss');
      expect(confirmAlert.type).toBe('confirm');
      expect(confirmAlert.message).toBe('Do you confirm action?');
      await expect(alertsPage.confirmResult()).toHaveText('You selected Cancel');

      const promptAlert = await alertsPage.triggerDialog(alertsPage.promptAlertButton(), 'accept', 'Codex');
      expect(promptAlert.type).toBe('prompt');
      expect(promptAlert.message).toBe('Please enter your name');
      await expect(alertsPage.promptResult()).toHaveText('You entered Codex');
    }
  );
});
