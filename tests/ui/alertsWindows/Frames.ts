import { expect, test } from '../../../src/core/fixtures/test-fixtures';
import { createTaggedTest } from '../../../src/shared/tag-utils/tagged-test';

const it = createTaggedTest(test);

test.describe('Demo QA frames', () => {
  test.describe.configure({ mode: 'parallel' });

  it(
    'should validate frame text styles and honest overflow behavior',
    ['@ui', '@demoqa', '@alertsWindows', '@frames', '@regression', '@c205'],
    async ({ alertsWindowsSteps, framesPage, softAssert, logger }) => {
      await alertsWindowsSteps.openFramesPage();

      for (const frameId of ['frame1', 'frame2'] as const) {
        await softAssert.visible(framesPage.frameElement(frameId), `${frameId} should be visible`);

        const headingStyles = await framesPage.frameHeadingStyles(frameId);
        const metrics = await framesPage.frameScrollMetrics(frameId);
        const scrollResult = await framesPage.scrollFrameIfNeeded(frameId);

        softAssert.check(headingStyles.text === 'This is a sample page', `${frameId} should contain the expected heading text`);
        softAssert.check(headingStyles.color === 'rgb(0, 0, 0)', `${frameId} text color should be black`);
        softAssert.check(headingStyles.fontSize === '32px', `${frameId} heading font-size should be 32px`);
        softAssert.check(headingStyles.fontFamily.includes('Times'), `${frameId} heading font-family should contain Times`);
        softAssert.check(headingStyles.backgroundColor === 'rgba(0, 0, 0, 0)', `${frameId} heading background is transparent on DemoQA`);

        if (metrics.hasHorizontalOverflow || metrics.hasVerticalOverflow) {
          logger.info(
            `${frameId} overflows: horizontal=${metrics.hasHorizontalOverflow}, vertical=${metrics.hasVerticalOverflow}`
          );

          expect(scrollResult.afterX >= scrollResult.beforeX).toBeTruthy();
          expect(scrollResult.afterY >= scrollResult.beforeY).toBeTruthy();
        } else {
          // frame1 does not really overflow on DemoQA, so the stable assertion is to record that fact.
          logger.info(`${frameId} has no scrollable overflow. The test fixes this as current site behavior.`);
          expect(scrollResult.afterX).toBe(0);
          expect(scrollResult.afterY).toBe(0);
        }

        expect(metrics.docScrollWidth).toBeGreaterThanOrEqual(metrics.docClientWidth);
        expect(metrics.docScrollHeight).toBeGreaterThanOrEqual(metrics.docClientHeight);
      }

      softAssert.assertAll();
    }
  );
});
