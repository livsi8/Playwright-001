import { Logger } from '../../shared/logger/logger';
import { SoftAssert } from '../../shared/soft-assert/soft-assert';
import { HomeCardDefinition } from '../helpers/home-card-definition';
import { HomePage } from '../pages/home.page';
import { CardValidationSteps } from './card-validation.steps';

export class HomePageSteps {
  public constructor(
    private readonly homePage: HomePage,
    private readonly cardValidationSteps: CardValidationSteps,
    private readonly logger: Logger
  ) {}

  public async givenHomePageIsOpened(): Promise<void> {
    await this.homePage.open();
  }

  public async thenHomeCardsShouldBeDisplayedCorrectly(softAssert: SoftAssert): Promise<void> {
    await this.cardValidationSteps.thenHomeCardsShouldBeVisibleAndReadable(softAssert);
  }

  public expectedHomeCards(): readonly HomeCardDefinition[] {
    return this.homePage.expectedCards();
  }

  public async whenCardIsOpened(card: HomeCardDefinition): Promise<string> {
    this.logger.step(`Open card "${card.title}" and capture current URL`);
    await this.homePage.cardByTitle(card.title).open();
    return this.homePage.currentUrl();
  }

  public thenOpenedUrlShouldMatchCard(card: HomeCardDefinition, actualUrl: string): void {
    this.logger.info(`Card "${card.title}" expected URL part=${card.expectedPath} | actual=${actualUrl}`);
    this.cardValidationSteps.thenCurrentUrlShouldMatchExpectedPath(actualUrl, card.expectedPath, card.title);
  }
}
