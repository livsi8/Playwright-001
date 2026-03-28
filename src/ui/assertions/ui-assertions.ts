import { expect, Locator } from '@playwright/test';
import { Logger } from '../../shared/logger/logger';

export class UiAssertions {
  public constructor(private readonly logger: Logger) {}

  public async visible(locator: Locator, description: string): Promise<void> {
    this.logger.step(`Assert visible: ${description}`);
    await expect(locator).toBeVisible();
  }

  public async text(locator: Locator, expectedText: string, description: string): Promise<void> {
    this.logger.step(`Assert text: ${description}`);
    await expect(locator).toHaveText(expectedText);
  }
}
