import { Locator, Page } from '@playwright/test';
import { Logger } from '../../shared/logger/logger';
import { BasePage } from './base-page';

export class PracticeFormPage extends BasePage {
  public constructor(page: Page, logger: Logger) {
    super(page, logger);
  }

  public formTitle(): Locator {
    return this.page.locator('.practice-form-wrapper h5');
  }

  public studentNameInput(): Locator {
    return this.page.locator('#firstName');
  }
}
