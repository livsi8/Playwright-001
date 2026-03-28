import { expect, Page } from '@playwright/test';
import { Logger } from '../../shared/logger/logger';
import { SoftAssert } from '../../shared/soft-assert/soft-assert';
import { PopupSummary } from '../helpers/element-metrics';
import { BrowserWindowsPage } from '../pages/browser-windows.page';
import { CssVerificationSteps } from './css-verification.steps';

export class BrowserWindowsSteps {
  public constructor(
    private readonly browserWindowsPage: BrowserWindowsPage,
    private readonly cssVerificationSteps: CssVerificationSteps,
    private readonly logger: Logger
  ) {}

  public async givenBrowserWindowsPageIsOpened(): Promise<void> {
    await this.browserWindowsPage.open();
  }

  public async thenActionButtonsHaveExpectedVisualState(softAssert: SoftAssert): Promise<void> {
    await this.cssVerificationSteps.thenButtonHasStableVisualState(
      this.browserWindowsPage.newTabButton(),
      'New Tab button',
      softAssert,
      { minWidth: 80, exactHeight: 38, exactFontSize: '16px', exactTextColor: 'rgb(255, 255, 255)' }
    );
    await this.cssVerificationSteps.thenButtonHasStableVisualState(
      this.browserWindowsPage.newWindowButton(),
      'New Window button',
      softAssert,
      { minWidth: 110, exactHeight: 38, exactFontSize: '16px', exactTextColor: 'rgb(255, 255, 255)' }
    );
    await this.cssVerificationSteps.thenButtonHasStableVisualState(
      this.browserWindowsPage.newWindowMessageButton(),
      'New Window Message button',
      softAssert,
      { minWidth: 180, exactHeight: 38, exactFontSize: '16px', exactTextColor: 'rgb(255, 255, 255)' }
    );
  }

  public async whenNewTabPopupIsOpened(): Promise<{ popup: Page; summary: PopupSummary }> {
    const popup = await this.browserWindowsPage.openPopup(this.browserWindowsPage.newTabButton(), 'New Tab');
    return { popup, summary: await this.browserWindowsPage.popupSummary(popup) };
  }

  public async whenNewWindowPopupIsOpened(): Promise<{ popup: Page; summary: PopupSummary }> {
    const popup = await this.browserWindowsPage.openPopup(this.browserWindowsPage.newWindowButton(), 'New Window');
    return { popup, summary: await this.browserWindowsPage.popupSummary(popup) };
  }

  public async whenWindowMessagePopupIsOpened(): Promise<{ popup: Page; summary: PopupSummary }> {
    const popup = await this.browserWindowsPage.openPopup(
      this.browserWindowsPage.newWindowMessageButton(),
      'New Window Message'
    );
    return { popup, summary: await this.browserWindowsPage.popupSummary(popup) };
  }

  public thenSamplePopupShouldBeDisplayed(summary: PopupSummary): void {
    this.logger.step(`Verify sample popup URL=${summary.url}`);
    expect(summary.url).toContain('/sample');
    expect(summary.text).toContain('This is a sample page');
  }

  public thenWindowMessagePopupShouldBeDisplayed(summary: PopupSummary): void {
    this.logger.step(`Verify window message popup URL=${summary.url}`);
    expect(summary.url).toBe('about:blank');
    expect(summary.text).toContain('Knowledge increases by sharing');
  }
}
