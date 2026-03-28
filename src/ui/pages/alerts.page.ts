import { Page, expect } from '@playwright/test';
import { Logger } from '../../shared/logger/logger';
import { ButtonComponent } from '../components/button.component';
import { DialogSummary } from '../helpers/element-metrics';
import { BasePage } from './base-page';

export class AlertsPage extends BasePage {
  public constructor(page: Page, logger: Logger) {
    super(page, logger);
  }

  public async open(): Promise<void> {
    this.logger.step('Navigate to Alerts page');
    await this.page.goto('/alerts');
    await expect(this.page).toHaveURL(/alerts$/);
  }

  public regularAlertButton(): ButtonComponent {
    return new ButtonComponent(this.page.locator('#alertButton'), this.logger, 'Regular Alert');
  }

  public timedAlertButton(): ButtonComponent {
    return new ButtonComponent(this.page.locator('#timerAlertButton'), this.logger, 'Timed Alert');
  }

  public confirmAlertButton(): ButtonComponent {
    return new ButtonComponent(this.page.locator('#confirmButton'), this.logger, 'Confirm Alert');
  }

  public promptAlertButton(): ButtonComponent {
    return new ButtonComponent(this.page.locator('#promtButton'), this.logger, 'Prompt Alert');
  }

  public confirmResult(): ReturnType<Page['locator']> {
    return this.page.locator('#confirmResult');
  }

  public promptResult(): ReturnType<Page['locator']> {
    return this.page.locator('#promptResult');
  }

  public async triggerDialog(
    button: ButtonComponent,
    action: 'accept' | 'dismiss',
    promptText?: string
  ): Promise<DialogSummary> {
    this.logger.step(`Trigger browser dialog via "${button.locator()}"`);

    return new Promise<DialogSummary>((resolve) => {
      this.page.once('dialog', async (dialog) => {
        const summary: DialogSummary = {
          type: dialog.type(),
          message: dialog.message(),
          defaultValue: dialog.defaultValue()
        };

        if (action === 'dismiss') {
          await dialog.dismiss();
        } else {
          await dialog.accept(promptText);
        }

        resolve(summary);
      });

      void button.click();
    });
  }
}
