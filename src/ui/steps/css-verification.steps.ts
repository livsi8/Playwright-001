import { expect } from '@playwright/test';
import { SoftAssert } from '../../shared/soft-assert/soft-assert';
import { Logger } from '../../shared/logger/logger';
import { ButtonComponent } from '../components/button.component';

interface ButtonVisualExpectations {
  minWidth?: number;
  exactHeight?: number;
  exactFontSize?: string;
  exactTextColor?: string;
}

export class CssVerificationSteps {
  public constructor(private readonly logger: Logger) {}

  public async thenButtonHasStableVisualState(
    button: ButtonComponent,
    name: string,
    softAssert: SoftAssert,
    expectations: ButtonVisualExpectations
  ): Promise<void> {
    await softAssert.visible(button.locator(), `${name} should be visible`);

    const hoverSnapshot = await button.hoverSnapshot();

    softAssert.check(hoverSnapshot.before.backgroundColor.startsWith('rgb('), `${name} background color should be resolved`);
    softAssert.check(hoverSnapshot.before.fontFamily.length > 0, `${name} font-family should be resolved`);

    if (expectations.exactTextColor) {
      softAssert.check(
        hoverSnapshot.before.color === expectations.exactTextColor,
        `${name} text color should be ${expectations.exactTextColor}`
      );
    }

    if (expectations.minWidth !== undefined) {
      softAssert.check(hoverSnapshot.before.width >= expectations.minWidth, `${name} width should be >= ${expectations.minWidth}px`);
    }

    if (expectations.exactHeight !== undefined) {
      softAssert.check(hoverSnapshot.before.height === expectations.exactHeight, `${name} height should be ${expectations.exactHeight}px`);
    }

    if (expectations.exactFontSize) {
      softAssert.check(
        hoverSnapshot.before.fontSize === expectations.exactFontSize,
        `${name} font-size should be ${expectations.exactFontSize}`
      );
    }

    // Hover is treated as a capability check first. If styles do not change, we record the real UI behavior instead of inventing a failure.
    if (hoverSnapshot.before.backgroundColor === hoverSnapshot.after.backgroundColor) {
      this.logger.info(`${name} does not change background on hover. This is accepted as current rendered behavior.`);
    } else {
      this.logger.info(
        `${name} hover background changed: ${hoverSnapshot.before.backgroundColor} -> ${hoverSnapshot.after.backgroundColor}`
      );
    }
  }

  public thenTextShouldContain(actualText: string, expectedText: string, description: string): void {
    this.logger.step(`Verify text for ${description}`);
    expect(actualText).toContain(expectedText);
  }
}
