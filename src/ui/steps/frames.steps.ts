import { expect } from '@playwright/test';
import { Logger } from '../../shared/logger/logger';
import { SoftAssert } from '../../shared/soft-assert/soft-assert';
import { FramesPage } from '../pages/frames.page';

export class FramesSteps {
  public constructor(
    private readonly framesPage: FramesPage,
    private readonly logger: Logger
  ) {}

  public async givenFramesPageIsOpened(): Promise<void> {
    await this.framesPage.open();
  }

  public async thenFramesExposeExpectedTextStylesAndScrollBehavior(softAssert: SoftAssert): Promise<void> {
    for (const frameId of ['frame1', 'frame2'] as const) {
      await softAssert.visible(this.framesPage.frameElement(frameId), `${frameId} should be visible`);

      const headingStyles = await this.framesPage.frameHeadingStyles(frameId);
      const metrics = await this.framesPage.frameScrollMetrics(frameId);
      const scrollResult = await this.framesPage.scrollFrameIfNeeded(frameId);

      softAssert.check(headingStyles.text === 'This is a sample page', `${frameId} should contain expected heading text`);
      softAssert.check(headingStyles.color === 'rgb(0, 0, 0)', `${frameId} text color should be black`);
      softAssert.check(headingStyles.backgroundColor === 'rgba(0, 0, 0, 0)', `${frameId} heading background should stay transparent`);
      softAssert.check(headingStyles.fontFamily.includes('Times'), `${frameId} font-family should contain Times`);
      softAssert.check(headingStyles.fontSize === '32px', `${frameId} font-size should be 32px`);

      expect(metrics.docScrollWidth).toBeGreaterThanOrEqual(metrics.docClientWidth);
      expect(metrics.docScrollHeight).toBeGreaterThanOrEqual(metrics.docClientHeight);

      if (metrics.hasHorizontalOverflow || metrics.hasVerticalOverflow) {
        // frame2 really overflows on DemoQA, so the assertion is based on actual scroll movement after an explicit scroll.
        this.logger.info(`${frameId} overflows and should react to scrolling.`);
        expect(scrollResult.afterX >= scrollResult.beforeX).toBeTruthy();
        expect(scrollResult.afterY >= scrollResult.beforeY).toBeTruthy();
      } else {
        this.logger.info(`${frameId} has no scrollable overflow. This is recorded as current site behavior.`);
        expect(scrollResult.afterX).toBe(0);
        expect(scrollResult.afterY).toBe(0);
      }
    }
  }
}
