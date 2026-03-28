import { expect } from '@playwright/test';
import { Logger } from '../../shared/logger/logger';
import { Book } from '../models/book';

export class ApiAssertions {
  public constructor(private readonly logger: Logger) {}

  public hasBooks(books: Book[]): void {
    this.logger.step('Assert that the catalog contains at least one book');
    expect(books.length).toBeGreaterThan(0);
  }

  public hasBookWithIsbn(books: Book[], isbn: string): void {
    this.logger.step(`Assert catalog contains ISBN ${isbn}`);
    expect(books.some((book) => book.isbn === isbn)).toBeTruthy();
  }
}
