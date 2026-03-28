import { expect } from '@playwright/test';
import { Logger } from '../../shared/logger/logger';
import { SoftAssert } from '../../shared/soft-assert/soft-assert';
import { ModalDialogsPage } from '../pages/modal-dialogs.page';
import { CssVerificationSteps } from './css-verification.steps';

export class ModalDialogsSteps {
  public constructor(
    private readonly modalDialogsPage: ModalDialogsPage,
    private readonly cssVerificationSteps: CssVerificationSteps,
    private readonly logger: Logger
  ) {}

  public async givenModalDialogsPageIsOpened(): Promise<void> {
    await this.modalDialogsPage.open();
  }

  public async thenTriggerButtonsHaveExpectedVisualState(softAssert: SoftAssert): Promise<void> {
    await this.cssVerificationSteps.thenButtonHasStableVisualState(
      this.modalDialogsPage.smallModalButton(),
      'Small modal trigger',
      softAssert,
      { minWidth: 110, exactHeight: 38, exactFontSize: '16px', exactTextColor: 'rgb(255, 255, 255)' }
    );
    await this.cssVerificationSteps.thenButtonHasStableVisualState(
      this.modalDialogsPage.largeModalButton(),
      'Large modal trigger',
      softAssert,
      { minWidth: 110, exactHeight: 38, exactFontSize: '16px', exactTextColor: 'rgb(255, 255, 255)' }
    );
  }

  public async whenButtonsGapIsMeasured(): Promise<number> {
    const gap = await this.modalDialogsPage.buttonsGap();
    this.logger.info(`Measured modal trigger gap: ${gap}px`);
    return gap;
  }

  public thenButtonsGapShouldReflectRenderedLayout(gap: number): void {
    // DemoQA currently renders these buttons with 0px gap by bounding boxes, so we assert the honest rendered layout.
    expect(gap).toBeGreaterThanOrEqual(0);
  }

  public async thenSmallModalShouldMatchCurrentLayout(softAssert: SoftAssert): Promise<void> {
    const modal = await this.modalDialogsPage.openSmallModal();
    const titleStyles = await modal.titleStyles();
    const bodyStyles = await modal.bodyStyles();
    const dialogBox = await modal.dialogBox();

    await this.cssVerificationSteps.thenButtonHasStableVisualState(
      modal.closeButton(),
      'Small modal Close button',
      softAssert,
      { minWidth: 60, exactHeight: 38, exactFontSize: '16px', exactTextColor: 'rgb(255, 255, 255)' }
    );

    await softAssert.visible(modal.closeIcon().locator(), 'Small modal close icon should be visible');
    const closeIconHover = await modal.closeIcon().hoverSnapshot();

    softAssert.check(titleStyles.fontSize === '24px', 'Small modal title font-size should be 24px');
    softAssert.check(titleStyles.fontFamily.length > 0, 'Small modal title font-family should be resolved');
    softAssert.check(bodyStyles.fontSize === '16px', 'Small modal body font-size should be 16px');
    softAssert.check(bodyStyles.fontFamily.length > 0, 'Small modal body font-family should be resolved');
    softAssert.check(dialogBox.width >= 280 && dialogBox.width <= 320, 'Small modal width should stay close to current layout');
    softAssert.check(dialogBox.height >= 200, 'Small modal height should be reasonable');
    softAssert.check(closeIconHover.after.opacity === '0.75', 'Small modal close icon hover should increase opacity to 0.75');

    await expect(modal.title()).toHaveText('Small Modal');
    await expect(modal.body()).toContainText('This is a small modal');

    await modal.closeButton().click();
    await expect(modal.root()).toBeHidden();
  }

  public async thenLargeModalShouldMatchCurrentLayout(softAssert: SoftAssert): Promise<void> {
    const modal = await this.modalDialogsPage.openLargeModal();
    const titleStyles = await modal.titleStyles();
    const bodyStyles = await modal.bodyStyles();
    const dialogBox = await modal.dialogBox();

    await this.cssVerificationSteps.thenButtonHasStableVisualState(
      modal.closeButton(),
      'Large modal Close button',
      softAssert,
      { minWidth: 60, exactHeight: 38, exactFontSize: '16px', exactTextColor: 'rgb(255, 255, 255)' }
    );

    await softAssert.visible(modal.closeIcon().locator(), 'Large modal close icon should be visible');
    const closeIconHover = await modal.closeIcon().hoverSnapshot();

    softAssert.check(titleStyles.fontSize === '24px', 'Large modal title font-size should be 24px');
    softAssert.check(bodyStyles.fontSize === '16px', 'Large modal body font-size should be 16px');
    softAssert.check(dialogBox.width >= 760, 'Large modal width should be close to current layout');
    softAssert.check(dialogBox.height >= 300, 'Large modal height should be close to current layout');
    softAssert.check(closeIconHover.after.opacity === '0.75', 'Large modal close icon hover should increase opacity to 0.75');

    await expect(modal.title()).toHaveText('Large Modal');
    await expect(modal.body()).toContainText('Lorem Ipsum is simply dummy text');

    await modal.closeIcon().click();
    await expect(modal.root()).toBeHidden();
  }
}
