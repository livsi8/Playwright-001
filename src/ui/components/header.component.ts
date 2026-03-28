import { Locator, Page } from '@playwright/test';

export class HeaderComponent {
  public constructor(private readonly page: Page) {}

  public pageTitle(): Locator {
    return this.page.locator('.main-header');
  }
}
