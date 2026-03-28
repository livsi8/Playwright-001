import { test } from '../../../src/core/fixtures/test-fixtures';
import { createTaggedTest } from '../../../src/shared/tag-utils/tagged-test';

const it = createTaggedTest(test);

test.describe('Demo QA frames', () => {
  test.describe.configure({ mode: 'parallel' });

  it(
    'should validate frame text styles and honest overflow behavior',
    ['@ui', '@demoqa', '@alertsWindows', '@frames', '@regression', '@c205'],
    async ({ framesSteps, softAssert }) => {
      await framesSteps.givenFramesPageIsOpened();
      await framesSteps.thenFramesExposeExpectedTextStylesAndScrollBehavior(softAssert);
      softAssert.assertAll();
    }
  );
});
