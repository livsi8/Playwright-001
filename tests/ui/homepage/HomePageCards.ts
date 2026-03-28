import { expect, test } from '../../../src/core/fixtures/test-fixtures';
import { createTaggedTest } from '../../../src/shared/tag-utils/tagged-test';

const it = createTaggedTest(test);

test.describe('Demo QA home page cards', () => {
  test.describe.configure({ mode: 'parallel' });

  it(
    'should render home page cards correctly in incognito mode',
    ['@ui', '@demoqa', '@homepage', '@incognito', '@smoke', '@c301'],
    async ({ homePageSteps, softAssert, isIncognitoTest, browserExecutionProfile, browserLaunchDetails }) => {
      expect(isIncognitoTest).toBeTruthy();

      expect(browserExecutionProfile.browserName).toBe('chromium');
      expect(browserExecutionProfile.mode).toBe('incognito');
      expect(browserLaunchDetails).toBeTruthy();
      expect(browserLaunchDetails?.mode).toBe('incognito');

      await homePageSteps.givenHomePageIsOpened();
      await homePageSteps.thenHomeCardsShouldBeDisplayedCorrectly(softAssert);

      softAssert.assertAll();
    }
  );

  it(
    'should render home page cards correctly in firefox incognito mode',
    ['@ui', '@demoqa', '@homepage', '@firefox', '@incognito', '@smoke', '@c303'],
    async ({ homePageSteps, softAssert, browserExecutionProfile, browserLaunchDetails }) => {
      expect(browserExecutionProfile.browserName).toBe('firefox');
      expect(browserExecutionProfile.mode).toBe('incognito');
      expect(browserLaunchDetails?.browserName).toBe('firefox');
      expect(browserLaunchDetails?.mode).toBe('incognito');

      await homePageSteps.givenHomePageIsOpened();
      await homePageSteps.thenHomeCardsShouldBeDisplayedCorrectly(softAssert);

      softAssert.assertAll();
    }
  );

  it(
    'should open each home page card and match the expected URL',
    ['@ui', '@demoqa', '@homepage', '@regression', '@c302'],
    async ({ homePageSteps, softAssert }) => {
      for (const card of homePageSteps.expectedHomeCards()) {
        await homePageSteps.givenHomePageIsOpened();
        const actualUrl = await homePageSteps.whenCardIsOpened(card);
        homePageSteps.thenOpenedUrlShouldMatchCard(card, actualUrl);
      }

      softAssert.assertAll();
    }
  );
});
