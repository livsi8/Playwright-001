import { Page, expect } from '@playwright/test';
import { Logger } from '../../shared/logger/logger';
import { ButtonComponent } from '../components/button.component';
import { ModalDialogComponent } from '../components/modal-dialog.component';
import { calculateGap } from '../helpers/element-metrics';
import { BasePage } from './base-page';

export class ModalDialogsPage extends BasePage {
  public constructor(page: Page, logger: Logger) {
    super(page, logger);
  }

  public async open(): Promise<void> {
    this.logger.step('Navigate to Modal Dialogs page');
    await this.page.goto('/modal-dialogs');
    await expect(this.page).toHaveURL(/modal-dialogs$/);
  }

  public smallModalButton(): ButtonComponent {
    return new ButtonComponent(this.page.locator('#showSmallModal'), this.logger, 'Small modal');
  }

  public largeModalButton(): ButtonComponent {
    return new ButtonComponent(this.page.locator('#showLargeModal'), this.logger, 'Large modal');
  }

  public activeModal(): ModalDialogComponent {
    return new ModalDialogComponent(this.page, this.logger);
  }

  public async buttonsGap(): Promise<number> {
    // Bounding boxes give the real geometric distance between controls in the rendered browser.
    const first = await this.smallModalButton().box();
    const second = await this.largeModalButton().box();
    return calculateGap(first, second);
  }

  public async openSmallModal(): Promise<ModalDialogComponent> {
    await this.smallModalButton().click();
    await expect(this.page.locator('.modal.show')).toBeVisible();
    return this.activeModal();
  }

  public async openLargeModal(): Promise<ModalDialogComponent> {
    await this.largeModalButton().click();
    await expect(this.page.locator('.modal.show')).toBeVisible();
    return this.activeModal();
  }
}
