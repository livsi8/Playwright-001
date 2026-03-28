import { Locator, Page, expect } from '@playwright/test';
import { Logger } from '../../shared/logger/logger';
import { HeaderComponent } from '../components/header.component';
import { SideMenuComponent } from '../components/side-menu.component';
import { BasePage } from './base-page';

export class SectionPage extends BasePage {
  private readonly header: HeaderComponent;
  private readonly sideMenu: SideMenuComponent;

  public constructor(page: Page, logger: Logger) {
    super(page, logger);
    this.header = new HeaderComponent(page);
    this.sideMenu = new SideMenuComponent(page, logger);
  }

  public title(): Locator {
    return this.header.pageTitle();
  }

  public placeholderText(): Locator {
    return this.page.locator('text=Please select an item from left to start practice.');
  }

  public menuItem(text: string): Locator {
    return this.sideMenu.itemByText(text);
  }

  public async expectSectionUrl(urlSegment: string): Promise<void> {
    this.logger.step(`Verify current URL contains "${urlSegment}"`);
    await expect(this.page).toHaveURL(new RegExp(`${urlSegment}$`));
  }

  public async openMenuItem(text: string): Promise<void> {
    await this.sideMenu.openItem(text);
  }
}
