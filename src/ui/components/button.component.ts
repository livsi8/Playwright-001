import { Locator } from '@playwright/test';
import { Logger } from '../../shared/logger/logger';
import { ElementBoxSnapshot, ElementStyleSnapshot, HoverSnapshot } from '../helpers/element-metrics';

export class ButtonComponent {
  public constructor(
    private readonly root: Locator,
    private readonly logger: Logger,
    private readonly name: string
  ) {}

  public locator(): Locator {
    return this.root;
  }

  public async hover(): Promise<void> {
    this.logger.step(`Hover button "${this.name}"`);
    await this.root.hover();
  }

  public async click(): Promise<void> {
    this.logger.step(`Click button "${this.name}"`);
    await this.root.click();
  }

  public async styles(): Promise<ElementStyleSnapshot> {
    this.logger.info(`Read button styles for "${this.name}"`);

    return this.root.evaluate((element) => {
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

  public async hoverSnapshot(): Promise<HoverSnapshot> {
    const before = await this.styles();
    await this.hover();
    const after = await this.styles();
    return { before, after };
  }

  public async box(): Promise<ElementBoxSnapshot> {
    this.logger.info(`Read button box for "${this.name}"`);

    return this.root.evaluate((element) => {
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
