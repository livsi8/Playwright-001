import { FrameLocator, Locator, Page, expect } from '@playwright/test';
import { Logger } from '../../shared/logger/logger';
import { FrameScrollMetrics, FrameScrollResult } from '../helpers/element-metrics';
import { BasePage } from './base-page';

export class FramesPage extends BasePage {
  public constructor(page: Page, logger: Logger) {
    super(page, logger);
  }

  public async open(): Promise<void> {
    this.logger.step('Navigate to Frames page');
    await this.page.goto('/frames');
    await expect(this.page).toHaveURL(/frames$/);
  }

  public frameElement(frameId: 'frame1' | 'frame2'): Locator {
    return this.page.locator(`#${frameId}`);
  }

  public frame(frameId: 'frame1' | 'frame2'): FrameLocator {
    return this.page.frameLocator(`#${frameId}`);
  }

  public frameHeading(frameId: 'frame1' | 'frame2'): Locator {
    return this.frame(frameId).locator('#sampleHeading');
  }

  public async frameHeadingStyles(frameId: 'frame1' | 'frame2') {
    this.logger.info(`Read heading styles from ${frameId}`);

    return this.frameHeading(frameId).evaluate((element) => {
      const computedStyle = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();

      return {
        text: element.textContent?.trim() ?? '',
        backgroundColor: computedStyle.backgroundColor,
        color: computedStyle.color,
        fontFamily: computedStyle.fontFamily,
        fontSize: computedStyle.fontSize,
        width: rect.width,
        height: rect.height
      };
    });
  }

  public async frameScrollMetrics(frameId: 'frame1' | 'frame2'): Promise<FrameScrollMetrics> {
    this.logger.info(`Read iframe scroll metrics for ${frameId}`);

    return this.frameElement(frameId).evaluate((iframe) => {
      const frame = iframe as HTMLIFrameElement;
      const contentWindow = frame.contentWindow!;
      const documentElement = contentWindow.document.documentElement;
      const body = contentWindow.document.body;

      const hasHorizontalOverflow =
        documentElement.scrollWidth > documentElement.clientWidth || body.scrollWidth > body.clientWidth;
      const hasVerticalOverflow =
        documentElement.scrollHeight > documentElement.clientHeight || body.scrollHeight > body.clientHeight;

      return {
        iframeClientWidth: frame.clientWidth,
        iframeClientHeight: frame.clientHeight,
        docScrollWidth: documentElement.scrollWidth,
        docClientWidth: documentElement.clientWidth,
        docScrollHeight: documentElement.scrollHeight,
        docClientHeight: documentElement.clientHeight,
        bodyScrollWidth: body.scrollWidth,
        bodyClientWidth: body.clientWidth,
        bodyScrollHeight: body.scrollHeight,
        bodyClientHeight: body.clientHeight,
        scrollX: contentWindow.scrollX,
        scrollY: contentWindow.scrollY,
        hasHorizontalOverflow,
        hasVerticalOverflow
      };
    });
  }

  public async scrollFrameIfNeeded(frameId: 'frame1' | 'frame2'): Promise<FrameScrollResult> {
    // Demo QA keeps both frames same-origin, so reading and scrolling the iframe window is safe here.
    this.logger.step(`Attempt to scroll ${frameId} based on actual overflow`);

    return this.frameElement(frameId).evaluate((iframe) => {
      const frame = iframe as HTMLIFrameElement;
      const contentWindow = frame.contentWindow!;
      const documentElement = contentWindow.document.documentElement;
      const body = contentWindow.document.body;

      const hasHorizontalOverflow =
        documentElement.scrollWidth > documentElement.clientWidth || body.scrollWidth > body.clientWidth;
      const hasVerticalOverflow =
        documentElement.scrollHeight > documentElement.clientHeight || body.scrollHeight > body.clientHeight;

      const beforeX = contentWindow.scrollX;
      const beforeY = contentWindow.scrollY;

      if (hasHorizontalOverflow || hasVerticalOverflow) {
        contentWindow.scrollTo(
          hasHorizontalOverflow ? documentElement.scrollWidth - documentElement.clientWidth : 0,
          hasVerticalOverflow ? documentElement.scrollHeight - documentElement.clientHeight : 0
        );
      }

      return {
        beforeX,
        beforeY,
        afterX: contentWindow.scrollX,
        afterY: contentWindow.scrollY
      };
    });
  }
}
