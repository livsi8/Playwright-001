import { Locator, Page, expect } from '@playwright/test';
import { Logger } from '../../shared/logger/logger';

export class BasePage {
  public constructor(
    protected readonly page: Page,
    protected readonly logger: Logger
  ) {}

  protected async click(locator: Locator, description: string): Promise<void> {
    this.logger.step(`Click: ${description}`);
    await locator.click();
  }

  protected async expectVisible(locator: Locator, description: string): Promise<void> {
    this.logger.step(`Verify visibility: ${description}`);
    await expect(locator).toBeVisible();
  }
}
