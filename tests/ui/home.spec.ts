import { expect, test } from '../../src/core/fixtures/test-fixtures';
import { createTaggedTest } from '../../src/shared/tag-utils/tagged-test';

const it = createTaggedTest(test);

test.describe('Demo QA UI smoke', () => {
  test.describe.configure({ mode: 'parallel' });

  it(
    'should display the home page cards and banner',
    ['@ui', '@smoke', '@regression', '@c123'],
    async ({ homePage, logger, softAssert }) => {
      await homePage.open();
      logger.step('Collect visible cards from the home page');

      const titles = await homePage.mainCardTitles();

      softAssert.equal(titles.length, 6, 'Home page should have 6 top-level cards');
      softAssert.check(titles.includes('Elements'), 'Elements card should exist');
      softAssert.check(titles.includes('Forms'), 'Forms card should exist');
      softAssert.check(titles.includes('Widgets'), 'Widgets card should exist');
      await softAssert.visible(homePage.banner(), 'Home banner should be visible');
      softAssert.assertAll();
    }
  );

  it(
    'should open Elements section and display the left menu',
    ['@ui', '@smoke', '@regression', '@c124'],
    async ({ homeSteps, sectionPage, softAssert }) => {
      await homeSteps.goToSection('Elements', '/elements');

      await softAssert.visible(sectionPage.menuItem('Text Box'), 'Text Box menu item should be visible');
      await softAssert.visible(sectionPage.menuItem('Check Box'), 'Check Box menu item should be visible');
      await softAssert.visible(sectionPage.menuItem('Web Tables'), 'Web Tables menu item should be visible');
      await softAssert.visible(sectionPage.placeholderText(), 'Default content placeholder should be visible');
      softAssert.assertAll();
    }
  );

  it(
    'should open Practice Form and show the registration form',
    ['@ui', '@regression', '@c125'],
    async ({ homeSteps, practiceFormPage, logger, page }) => {
      await homeSteps.openPracticeForm();
      logger.step('Validate the practice form content');

      await expect(page).toHaveURL(/automation-practice-form$/);
      await expect(practiceFormPage.formTitle()).toHaveText('Student Registration Form');
      await expect(practiceFormPage.studentNameInput()).toBeVisible();
    }
  );
});
