import { expect } from '@playwright/test';
import { Logger } from '../../shared/logger/logger';
import { SoftAssert } from '../../shared/soft-assert/soft-assert';
import { HomePage } from '../pages/home.page';

export class CardValidationSteps {
  public constructor(
    private readonly homePage: HomePage,
    private readonly logger: Logger
  ) {}

  public async thenHomeCardsShouldBeVisibleAndReadable(softAssert: SoftAssert): Promise<void> {
    const actualTitles = await this.homePage.mainCardTitles();
    const expectedCards = this.homePage.expectedCards();

    softAssert.equal(actualTitles.length, expectedCards.length, 'Home page should render the expected number of top cards');

    for (const expectedCard of expectedCards) {
      const card = this.homePage.cardByTitle(expectedCard.title);
      await softAssert.visible(card.locator(), `${expectedCard.title} card should be visible`);
      softAssert.check(await card.isEnabled(), `${expectedCard.title} card should be enabled for interaction`);
      softAssert.check(actualTitles.includes(expectedCard.title), `${expectedCard.title} card text should be present`);
    }
  }

  public thenCurrentUrlShouldMatchExpectedPath(actualUrl: string, expectedPath: string, cardTitle: string): void {
    this.logger.step(`Verify URL for "${cardTitle}"`);
    expect(actualUrl).toContain(expectedPath);
  }
}
