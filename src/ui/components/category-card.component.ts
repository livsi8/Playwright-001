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

  public locator(): Locator {
    return this.root;
  }

  public async text(): Promise<string> {
    return (await this.title().innerText()).trim();
  }

  public async isEnabled(): Promise<boolean> {
    return this.root.isEnabled();
  }

  public async open(): Promise<void> {
    const cardTitle = await this.text();
    this.logger.step(`Open category card "${cardTitle}"`);
    await this.root.click();
  }
}
