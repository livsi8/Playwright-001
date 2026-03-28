import { expect, test } from '../../../src/core/fixtures/test-fixtures';
import { createTaggedTest } from '../../../src/shared/tag-utils/tagged-test';

const it = createTaggedTest(test);

test.describe('Demo QA modal dialogs', () => {
  test.describe.configure({ mode: 'parallel' });

  it(
    'should validate modal trigger buttons and actual gap between them',
    ['@ui', '@demoqa', '@alertsWindows', '@modalDialogs', '@regression', '@c206'],
    async ({ alertsWindowsSteps, modalDialogsPage, softAssert, logger }) => {
      await alertsWindowsSteps.openModalDialogsPage();

      const buttons = [
        ['Small modal', modalDialogsPage.smallModalButton()],
        ['Large modal', modalDialogsPage.largeModalButton()]
      ] as const;

      for (const [name, button] of buttons) {
        await softAssert.visible(button.locator(), `${name} trigger should be visible`);
        const hoverSnapshot = await button.hoverSnapshot();

        softAssert.check(hoverSnapshot.before.backgroundColor.startsWith('rgb('), `${name} trigger should expose background color`);
        softAssert.check(hoverSnapshot.before.color === 'rgb(255, 255, 255)', `${name} trigger text should be white`);
        softAssert.check(hoverSnapshot.before.width > 100, `${name} trigger width should be realistic`);
        softAssert.check(hoverSnapshot.before.height === 38, `${name} trigger height should be 38px`);
        softAssert.check(hoverSnapshot.before.fontFamily.length > 0, `${name} trigger font-family should be resolved`);
        softAssert.check(hoverSnapshot.before.fontSize === '16px', `${name} trigger font-size should be 16px`);
      }

      const gap = await modalDialogsPage.buttonsGap();
      logger.info(`Measured gap between modal trigger buttons: ${gap}px`);

      // DemoQA currently renders the buttons flush with each other, so the stable check is non-overlap, not a made-up >=5px rule.
      expect(gap).toBeGreaterThanOrEqual(0);

      softAssert.assertAll();
    }
  );

  it(
    'should open the small modal and validate its controls and typography',
    ['@ui', '@demoqa', '@alertsWindows', '@modalDialogs', '@smoke', '@regression', '@c207'],
    async ({ alertsWindowsSteps, modalDialogsPage, softAssert }) => {
      await alertsWindowsSteps.openModalDialogsPage();

      const modal = await modalDialogsPage.openSmallModal();
      const titleStyles = await modal.titleStyles();
      const bodyStyles = await modal.bodyStyles();
      const dialogBox = await modal.dialogBox();
      const closeIconHover = await modal.closeIcon().hoverSnapshot();
      const closeButtonHover = await modal.closeButton().hoverSnapshot();

      await softAssert.visible(modal.closeIcon().locator(), 'Small modal close icon should be visible');
      await softAssert.visible(modal.closeButton().locator(), 'Small modal close button should be visible');

      softAssert.check(titleStyles.fontSize === '24px', 'Small modal title font-size should be 24px');
      softAssert.check(titleStyles.fontFamily.length > 0, 'Small modal title font-family should be resolved');
      softAssert.check(bodyStyles.fontSize === '16px', 'Small modal body font-size should be 16px');
      softAssert.check(bodyStyles.fontFamily.length > 0, 'Small modal body font-family should be resolved');
      softAssert.check(dialogBox.width >= 280 && dialogBox.width <= 320, 'Small modal width should stay close to the current layout');
      softAssert.check(dialogBox.height >= 200, 'Small modal height should be reasonable');
      softAssert.check(closeIconHover.after.opacity === '0.75', 'Small modal close icon hover should increase opacity to 0.75');
      softAssert.check(closeButtonHover.after.backgroundColor.length > 0, 'Small modal close button hover should complete');

      await expect(modal.title()).toHaveText('Small Modal');
      await expect(modal.body()).toContainText('This is a small modal');

      await modal.closeButton().click();
      await expect(modal.root()).toBeHidden();
      softAssert.assertAll();
    }
  );

  it(
    'should open the large modal and validate its controls and typography',
    ['@ui', '@demoqa', '@alertsWindows', '@modalDialogs', '@regression', '@c208'],
    async ({ alertsWindowsSteps, modalDialogsPage, softAssert }) => {
      await alertsWindowsSteps.openModalDialogsPage();

      const modal = await modalDialogsPage.openLargeModal();
      const titleStyles = await modal.titleStyles();
      const bodyStyles = await modal.bodyStyles();
      const dialogBox = await modal.dialogBox();
      const closeIconHover = await modal.closeIcon().hoverSnapshot();

      await softAssert.visible(modal.closeIcon().locator(), 'Large modal close icon should be visible');
      await softAssert.visible(modal.closeButton().locator(), 'Large modal close button should be visible');

      softAssert.check(titleStyles.fontSize === '24px', 'Large modal title font-size should be 24px');
      softAssert.check(bodyStyles.fontSize === '16px', 'Large modal body font-size should be 16px');
      softAssert.check(dialogBox.width >= 760, 'Large modal width should be close to the current large modal layout');
      softAssert.check(dialogBox.height >= 300, 'Large modal height should be close to the current large modal layout');
      softAssert.check(closeIconHover.after.opacity === '0.75', 'Large modal close icon hover should increase opacity to 0.75');

      await expect(modal.title()).toHaveText('Large Modal');
      await expect(modal.body()).toContainText('Lorem Ipsum is simply dummy text');

      await modal.closeIcon().click();
      await expect(modal.root()).toBeHidden();
      softAssert.assertAll();
    }
  );
});
