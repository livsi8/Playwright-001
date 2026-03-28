import { Locator, Page, expect } from '@playwright/test';
import { Logger } from '../../shared/logger/logger';
import { ElementBoxSnapshot, ElementStyleSnapshot } from '../helpers/element-metrics';

export class BasePage {
  public constructor(
    protected readonly page: Page,
    protected readonly logger: Logger
  ) {}

  protected async click(locator: Locator, description: string): Promise<void> {
    this.logger.step(`Click: ${description}`);
    await locator.click();
  }

  protected async hover(locator: Locator, description: string): Promise<void> {
    this.logger.step(`Hover: ${description}`);
    await locator.hover();
  }

  protected async expectVisible(locator: Locator, description: string): Promise<void> {
    this.logger.step(`Verify visibility: ${description}`);
    await expect(locator).toBeVisible();
  }

  protected async readStyles(locator: Locator, description: string): Promise<ElementStyleSnapshot> {
    this.logger.step(`Read computed styles: ${description}`);

    return locator.evaluate((element) => {
      const computedStyle = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();

      return {
        backgroundColor: computedStyle.backgroundColor,
        color: computedStyle.color,
        fontFamily: computedStyle.fontFamily,
        fontSize: computedStyle.fontSize,
        width: rect.width,
        height: rect.height,
        opacity: computedStyle.opacity
      };
    });
  }

  protected async readBox(locator: Locator, description: string): Promise<ElementBoxSnapshot> {
    this.logger.step(`Read bounding box: ${description}`);

    return locator.evaluate((element) => {
      const rect = element.getBoundingClientRect();

      return {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left
      };
    });
  }
}
