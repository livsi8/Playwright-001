import { Locator, expect } from '@playwright/test';
import { Logger } from '../../shared/logger/logger';
import { CategoryCardComponent } from '../components/category-card.component';
import { BasePage } from './base-page';

export class HomePage extends BasePage {
  public constructor(page: import('@playwright/test').Page, logger: Logger) {
    super(page, logger);
  }

  public async open(): Promise<void> {
    this.logger.step('Navigate to Demo QA home page');
    await this.page.goto('/');
    await expect(this.page).toHaveURL(/demoqa\.com\/?$/);
  }

  public cards(): Locator {
    return this.page.locator('.top-card');
  }

  public cardByTitle(title: string): CategoryCardComponent {
    return new CategoryCardComponent(this.cards().filter({ hasText: title }).first(), this.logger);
  }

  public banner(): Locator {
    return this.page.locator('.home-banner');
  }

  public async mainCardTitles(): Promise<string[]> {
    return (await this.cards().locator('h5').allInnerTexts()).map((item) => item.trim());
  }
}
