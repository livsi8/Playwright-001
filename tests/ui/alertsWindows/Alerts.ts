import { test } from '../../../src/core/fixtures/test-fixtures';
import { createTaggedTest } from '../../../src/shared/tag-utils/tagged-test';

const it = createTaggedTest(test);

test.describe('Demo QA alerts', () => {
  test.describe.configure({ mode: 'parallel' });

  it(
    'should validate alert buttons styles and hover behavior',
    ['@ui', '@demoqa', '@alertsWindows', '@alerts', '@regression', '@c203'],
    async ({ alertsSteps, softAssert }) => {
      await alertsSteps.givenAlertsPageIsOpened();
      await alertsSteps.thenAlertButtonsHaveExpectedVisualState(softAssert);
      softAssert.assertAll();
    }
  );

  it(
    'should show expected browser dialogs and page reactions',
    ['@ui', '@demoqa', '@alertsWindows', '@alerts', '@smoke', '@regression', '@c204'],
    async ({ alertsSteps }) => {
      await alertsSteps.givenAlertsPageIsOpened();

      const regularAlert = await alertsSteps.whenRegularAlertIsAccepted();
      alertsSteps.thenDialogMessageShouldBe(regularAlert.message, 'You clicked a button');

      const timedAlert = await alertsSteps.whenTimedAlertIsAccepted();
      alertsSteps.thenDialogMessageShouldBe(timedAlert.message, 'This alert appeared after 5 seconds');

      const confirmAlert = await alertsSteps.whenConfirmAlertIsDismissed();
      alertsSteps.thenDialogMessageShouldBe(confirmAlert.message, 'Do you confirm action?');
      await alertsSteps.thenConfirmResultShouldBe('You selected Cancel');

      const promptAlert = await alertsSteps.whenPromptAlertIsAccepted('Codex');
      alertsSteps.thenDialogMessageShouldBe(promptAlert.message, 'Please enter your name');
      await alertsSteps.thenPromptResultShouldBe('You entered Codex');
    }
  );
});
