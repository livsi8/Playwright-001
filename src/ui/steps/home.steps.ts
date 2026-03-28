import { Page } from '@playwright/test';
import { Logger } from '../../shared/logger/logger';
import { HomePage } from '../pages/home.page';
import { PracticeFormPage } from '../pages/practice-form.page';
import { SectionPage } from '../pages/section.page';

export class HomeSteps {
  public constructor(
    private readonly page: Page,
    private readonly homePage: HomePage,
    private readonly sectionPage: SectionPage,
    private readonly practiceFormPage: PracticeFormPage,
    private readonly logger: Logger
  ) {}

  public async openHomePage(): Promise<void> {
    await this.homePage.open();
  }

  public async openCategory(categoryTitle: string): Promise<void> {
    await this.homePage.cardByTitle(categoryTitle).open();
  }

  public async goToSection(categoryTitle: string, expectedUrlSegment: string): Promise<void> {
    this.logger.step(`Navigate from home page to section "${expectedUrlSegment}"`);
    await this.openHomePage();
    await this.openCategory(categoryTitle);
    await this.sectionPage.expectSectionUrl(expectedUrlSegment);
  }

  public async openPracticeForm(): Promise<void> {
    await this.goToSection('Forms', '/forms');
    await this.sectionPage.openMenuItem('Practice Form');
  }

  public async practiceFormTitle(): Promise<string> {
    return (await this.practiceFormPage.formTitle().innerText()).trim();
  }

  public formPage() {
    return this.practiceFormPage;
  }

  public currentPage(): Page {
    return this.page;
  }
}
