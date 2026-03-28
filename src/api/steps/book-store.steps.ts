import { Logger } from '../../shared/logger/logger';
import { ApiAssertions } from '../assertions/api-assertions';
import { ApiClient } from '../clients/api-client';
import { Book } from '../models/book';
import { BookStoreService } from '../services/book-store.service';

export class BookStoreApiSteps {
  private readonly service: BookStoreService;
  private readonly assertions: ApiAssertions;

  public constructor(apiClient: ApiClient, private readonly logger: Logger) {
    this.service = new BookStoreService(apiClient, logger);
    this.assertions = new ApiAssertions(logger);
  }

  public async loadCatalog(): Promise<Book[]> {
    this.logger.step('Load book catalog');
    const books = await this.service.getBooks();
    this.assertions.hasBooks(books);
    return books;
  }

  public async loadBookByIsbn(isbn: string): Promise<Book> {
    this.logger.step(`Load single book by ISBN ${isbn}`);
    return this.service.getBookByIsbn(isbn);
  }
}
