import { Locator, Page } from '@playwright/test';
import { Logger } from '../../shared/logger/logger';

export class SideMenuComponent {
  public constructor(
    private readonly page: Page,
    private readonly logger: Logger
  ) {}

  public itemByText(text: string): Locator {
    return this.page.locator('.menu-list li').filter({ hasText: text }).first();
  }

  public items(): Locator {
    return this.page.locator('.menu-list li');
  }

  public async openItem(text: string): Promise<void> {
    this.logger.step(`Open side menu item "${text}"`);
    await this.itemByText(text).click();
  }
}
