import { expect } from '@playwright/test';
import { Logger } from '../../shared/logger/logger';
import { SoftAssert } from '../../shared/soft-assert/soft-assert';
import { AlertsPage } from '../pages/alerts.page';
import { CssVerificationSteps } from './css-verification.steps';

export class AlertsSteps {
  public constructor(
    private readonly alertsPage: AlertsPage,
    private readonly cssVerificationSteps: CssVerificationSteps,
    private readonly logger: Logger
  ) {}

  public async givenAlertsPageIsOpened(): Promise<void> {
    await this.alertsPage.open();
  }

  public async thenAlertButtonsHaveExpectedVisualState(softAssert: SoftAssert): Promise<void> {
    const expectations = { minWidth: 80, exactHeight: 38, exactFontSize: '16px', exactTextColor: 'rgb(255, 255, 255)' };

    await this.cssVerificationSteps.thenButtonHasStableVisualState(
      this.alertsPage.regularAlertButton(),
      'Regular alert button',
      softAssert,
      expectations
    );
    await this.cssVerificationSteps.thenButtonHasStableVisualState(
      this.alertsPage.timedAlertButton(),
      'Timed alert button',
      softAssert,
      expectations
    );
    await this.cssVerificationSteps.thenButtonHasStableVisualState(
      this.alertsPage.confirmAlertButton(),
      'Confirm alert button',
      softAssert,
      expectations
    );
    await this.cssVerificationSteps.thenButtonHasStableVisualState(
      this.alertsPage.promptAlertButton(),
      'Prompt alert button',
      softAssert,
      expectations
    );
  }

  public async whenRegularAlertIsAccepted() {
    return this.alertsPage.triggerDialog(this.alertsPage.regularAlertButton(), 'accept');
  }

  public async whenTimedAlertIsAccepted() {
    return this.alertsPage.triggerDialog(this.alertsPage.timedAlertButton(), 'accept');
  }

  public async whenConfirmAlertIsDismissed() {
    return this.alertsPage.triggerDialog(this.alertsPage.confirmAlertButton(), 'dismiss');
  }

  public async whenPromptAlertIsAccepted(promptText: string) {
    return this.alertsPage.triggerDialog(this.alertsPage.promptAlertButton(), 'accept', promptText);
  }

  public thenDialogMessageShouldBe(actualMessage: string, expectedMessage: string): void {
    this.logger.step(`Verify dialog text "${expectedMessage}"`);
    expect(actualMessage).toBe(expectedMessage);
  }

  public async thenConfirmResultShouldBe(expectedText: string): Promise<void> {
    await expect(this.alertsPage.confirmResult()).toHaveText(expectedText);
  }

  public async thenPromptResultShouldBe(expectedText: string): Promise<void> {
    await expect(this.alertsPage.promptResult()).toHaveText(expectedText);
  }
}
