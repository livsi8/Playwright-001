import { Page, expect } from '@playwright/test';
import { Logger } from '../../shared/logger/logger';
import { PopupSummary } from '../helpers/element-metrics';
import { ButtonComponent } from '../components/button.component';
import { BasePage } from './base-page';

export class BrowserWindowsPage extends BasePage {
  public constructor(page: Page, logger: Logger) {
    super(page, logger);
  }

  public async open(): Promise<void> {
    this.logger.step('Navigate to Browser Windows page');
    await this.page.goto('/browser-windows');
    await expect(this.page).toHaveURL(/browser-windows$/);
  }

  public newTabButton(): ButtonComponent {
    return new ButtonComponent(this.page.locator('#tabButton'), this.logger, 'New Tab');
  }

  public newWindowButton(): ButtonComponent {
    return new ButtonComponent(this.page.locator('#windowButton'), this.logger, 'New Window');
  }

  public newWindowMessageButton(): ButtonComponent {
    return new ButtonComponent(this.page.locator('#messageWindowButton'), this.logger, 'New Window Message');
  }

  public async openPopup(button: ButtonComponent, description: string): Promise<Page> {
    // Playwright observes both a browser tab and a browser window as a popup Page.
    this.logger.step(`Open popup from "${description}"`);
    const [popup] = await Promise.all([this.page.waitForEvent('popup'), button.click()]);
    await popup.waitForLoadState('domcontentloaded').catch(() => undefined);
    return popup;
  }

  public async popupSummary(popup: Page): Promise<PopupSummary> {
    this.logger.info(`Read popup summary for ${popup.url() || 'about:blank popup'}`);
    const text = (await popup.locator('body').innerText().catch(() => '')).trim();

    return {
      url: popup.url(),
      text
    };
  }
}
