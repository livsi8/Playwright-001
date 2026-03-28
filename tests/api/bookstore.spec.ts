import { expect, test } from '../../src/core/fixtures/test-fixtures';
import { Book } from '../../src/api/models/book';
import { createTaggedTest } from '../../src/shared/tag-utils/tagged-test';

const it = createTaggedTest(test);

test.describe('Demo QA BookStore API', () => {
  test.describe.configure({ mode: 'parallel' });

  it(
    'should return a non-empty book catalog',
    ['@api', '@smoke', '@regression', '@c123'],
    async ({ bookStoreApiSteps, logger, softAssert }) => {
      const books: Book[] = await bookStoreApiSteps.loadCatalog();
      logger.step('Validate the returned catalog');

      softAssert.check(books.length > 0, 'Book list should not be empty');
      softAssert.check(books.every((book) => book.title.length > 0), 'Every book should have a title');
      softAssert.check(books.some((book) => book.publisher.includes("O'Reilly")), 'Catalog should contain O\'Reilly books');
      softAssert.assertAll();
    }
  );

  it(
    'should analyze the catalog using TypeScript array operations',
    ['@api', '@regression', '@c124'],
    async ({ bookStoreApiSteps, logger }) => {
      const books: Book[] = await bookStoreApiSteps.loadCatalog();

      // Native array methods are the practical TypeScript equivalent of Java Stream operations.
      const oreillyBooks = books.filter((book) => book.publisher.includes("O'Reilly"));
      const sortedTitles = oreillyBooks.map((book) => book.title).sort((left, right) => left.localeCompare(right));
      const representativeBook = oreillyBooks.find((book) => book.pages > 200) ?? books[0];
      const totalPages = oreillyBooks.reduce((sum, book) => sum + book.pages, 0);

      logger.info(`Sorted O'Reilly titles: ${sortedTitles.join(', ')}`);
      logger.info(`Representative book: ${representativeBook.title}`);
      logger.info(`Total pages in O'Reilly slice: ${totalPages}`);

      expect(oreillyBooks.length).toBeGreaterThan(0);
      expect(sortedTitles[0].length).toBeGreaterThan(0);
      expect(representativeBook.isbn).toBeTruthy();
      expect(totalPages).toBeGreaterThan(0);
    }
  );

  it(
    'should return the same book when loaded by ISBN',
    ['@api', '@smoke', '@regression', '@c125'],
    async ({ bookStoreApiSteps, logger }) => {
      const books: Book[] = await bookStoreApiSteps.loadCatalog();
      const targetBook = books.find((book) => book.title.includes('Git Pocket Guide')) ?? books[0];

      logger.info(`Selected ISBN ${targetBook.isbn} for the book details lookup`);

      const loadedBook = await bookStoreApiSteps.loadBookByIsbn(targetBook.isbn);

      expect(loadedBook.isbn).toBe(targetBook.isbn);
      expect(loadedBook.title).toBe(targetBook.title);
      expect(loadedBook.website).toContain('http');
    }
  );
});
