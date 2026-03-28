import { Logger } from '../../shared/logger/logger';
import { ApiClient } from '../clients/api-client';
import { Book } from '../models/book';
import { BooksResponse } from '../models/books-response';

export class BookStoreService {
  public constructor(
    private readonly apiClient: ApiClient,
    private readonly logger: Logger
  ) {}

  public async getBooks(): Promise<Book[]> {
    const response = await this.apiClient.request().withMethod('GET').withPath('/BookStore/v1/Books').send<BooksResponse>();
    await response.assertStatus(200);
    const body = await response.json<BooksResponse>();
    this.logger.info(`Book catalog contains ${body.books.length} items`);
    return body.books;
  }

  public async getBookByIsbn(isbn: string): Promise<Book> {
    const response = await this.apiClient
      .request()
      .withMethod('GET')
      .withPath('/BookStore/v1/Book')
      .withQuery('ISBN', isbn)
      .send<Book>();
    await response.assertStatus(200);
    const book = await response.json<Book>();
    this.logger.info(`Fetched book "${book.title}" by ISBN ${isbn}`);
    return book;
  }
}
