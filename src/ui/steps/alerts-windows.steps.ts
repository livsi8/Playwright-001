import { Logger } from '../../shared/logger/logger';
import { AlertsPage } from '../pages/alerts.page';
import { BrowserWindowsPage } from '../pages/browser-windows.page';
import { FramesPage } from '../pages/frames.page';
import { ModalDialogsPage } from '../pages/modal-dialogs.page';

export class AlertsWindowsSteps {
  public constructor(
    private readonly browserWindowsPage: BrowserWindowsPage,
    private readonly alertsPage: AlertsPage,
    private readonly framesPage: FramesPage,
    private readonly modalDialogsPage: ModalDialogsPage,
    private readonly logger: Logger
  ) {}

  public async openBrowserWindowsPage(): Promise<void> {
    this.logger.step('Open Browser Windows scenario page');
    await this.browserWindowsPage.open();
  }

  public async openAlertsPage(): Promise<void> {
    this.logger.step('Open Alerts scenario page');
    await this.alertsPage.open();
  }

  public async openFramesPage(): Promise<void> {
    this.logger.step('Open Frames scenario page');
    await this.framesPage.open();
  }

  public async openModalDialogsPage(): Promise<void> {
    this.logger.step('Open Modal Dialogs scenario page');
    await this.modalDialogsPage.open();
  }
}
