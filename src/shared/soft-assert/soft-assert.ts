import { expect, Locator } from '@playwright/test';

export class SoftAssert {
  private readonly errors: string[] = [];

  public check(condition: boolean, message: string): void {
    if (!condition) {
      this.errors.push(message);
    }
  }

  public equal<T>(actual: T, expected: T, message: string): void {
    if (actual !== expected) {
      this.errors.push(`${message}. Expected: ${String(expected)}. Actual: ${String(actual)}`);
    }
  }

  public async visible(locator: Locator, message: string): Promise<void> {
    try {
      await expect(locator).toBeVisible();
    } catch (error) {
      const details = error instanceof Error ? error.message : String(error);
      this.errors.push(`${message}. ${details}`);
    }
  }

  public assertAll(): void {
    if (this.errors.length === 0) {
      return;
    }

    throw new Error(`Soft assertion failures:\n- ${this.errors.join('\n- ')}`);
  }
}
