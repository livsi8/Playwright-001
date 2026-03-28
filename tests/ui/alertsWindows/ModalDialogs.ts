import { test } from '../../../src/core/fixtures/test-fixtures';
import { createTaggedTest } from '../../../src/shared/tag-utils/tagged-test';

const it = createTaggedTest(test);

test.describe('Demo QA modal dialogs', () => {
  test.describe.configure({ mode: 'parallel' });

  it(
    'should validate modal trigger buttons and actual gap between them',
    ['@ui', '@demoqa', '@alertsWindows', '@modalDialogs', '@regression', '@c206'],
    async ({ modalDialogsSteps, softAssert }) => {
      await modalDialogsSteps.givenModalDialogsPageIsOpened();
      await modalDialogsSteps.thenTriggerButtonsHaveExpectedVisualState(softAssert);
      const gap = await modalDialogsSteps.whenButtonsGapIsMeasured();
      modalDialogsSteps.thenButtonsGapShouldReflectRenderedLayout(gap);
      softAssert.assertAll();
    }
  );

  it(
    'should open the small modal and validate its controls and typography',
    ['@ui', '@demoqa', '@alertsWindows', '@modalDialogs', '@smoke', '@regression', '@c207'],
    async ({ modalDialogsSteps, softAssert }) => {
      await modalDialogsSteps.givenModalDialogsPageIsOpened();
      await modalDialogsSteps.thenSmallModalShouldMatchCurrentLayout(softAssert);
      softAssert.assertAll();
    }
  );

  it(
    'should open the large modal and validate its controls and typography',
    ['@ui', '@demoqa', '@alertsWindows', '@modalDialogs', '@regression', '@c208'],
    async ({ modalDialogsSteps, softAssert }) => {
      await modalDialogsSteps.givenModalDialogsPageIsOpened();
      await modalDialogsSteps.thenLargeModalShouldMatchCurrentLayout(softAssert);
      softAssert.assertAll();
    }
  );
});
