import { Locator, Page } from '@playwright/test';
import { Logger } from '../../shared/logger/logger';
import { ElementBoxSnapshot, ElementStyleSnapshot } from '../helpers/element-metrics';
import { ButtonComponent } from './button.component';

export class ModalDialogComponent {
  public constructor(
    private readonly page: Page,
    private readonly logger: Logger
  ) {}

  public root(): Locator {
    return this.page.locator('.modal.show');
  }

  public dialog(): Locator {
    return this.root().locator('.modal-dialog');
  }

  public title(): Locator {
    return this.root().locator('.modal-title');
  }

  public body(): Locator {
    return this.root().locator('.modal-body');
  }

  public closeButton(): ButtonComponent {
    return new ButtonComponent(
      this.root().locator('.modal-footer button.btn.btn-primary').filter({ hasText: 'Close' }),
      this.logger,
      'Close'
    );
  }

  public closeIcon(): ButtonComponent {
    return new ButtonComponent(this.root().locator('.btn-close'), this.logger, 'Close icon');
  }

  public async titleStyles(): Promise<ElementStyleSnapshot> {
    this.logger.info('Read modal title styles');

    return this.title().evaluate((element) => {
      const computedStyle = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();

      return {
        backgroundColor: computedStyle.backgroundColor,
        color: computedStyle.color,
        fontFamily: computedStyle.fontFamily,
        fontSize: computedStyle.fontSize,
        width: rect.width,
        height: rect.height,
        opacity: computedStyle.opacity
      };
    });
  }

  public async bodyStyles(): Promise<ElementStyleSnapshot> {
    this.logger.info('Read modal body styles');

    return this.body().evaluate((element) => {
      const computedStyle = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();

      return {
        backgroundColor: computedStyle.backgroundColor,
        color: computedStyle.color,
        fontFamily: computedStyle.fontFamily,
        fontSize: computedStyle.fontSize,
        width: rect.width,
        height: rect.height,
        opacity: computedStyle.opacity
      };
    });
  }

  public async dialogBox(): Promise<ElementBoxSnapshot> {
    this.logger.info('Read modal dialog bounding box');

    return this.dialog().evaluate((element) => {
      const rect = element.getBoundingClientRect();

      return {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left
      };
    });
  }
}
