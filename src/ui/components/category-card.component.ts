import { Locator } from '@playwright/test';
import { Logger } from '../../shared/logger/logger';

export class CategoryCardComponent {
  public constructor(
    private readonly root: Locator,
    private readonly logger: Logger
  ) {}

  public title(): Locator {
    return this.root.locator('h5');
  }

  public async open(): Promise<void> {
    const cardTitle = await this.title().innerText();
    this.logger.step(`Open category card "${cardTitle}"`);
    await this.root.click();
  }
}
