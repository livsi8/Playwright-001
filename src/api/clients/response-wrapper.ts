import { APIResponse, expect } from '@playwright/test';
import { Logger } from '../../shared/logger/logger';

export class ResponseWrapper<TBody = unknown> {
  public constructor(
    private readonly response: APIResponse,
    private readonly logger: Logger
  ) {}

  public status(): number {
    return this.response.status();
  }

  public async json<TExpected = TBody>(): Promise<TExpected> {
    return (await this.response.json()) as TExpected;
  }

  public async text(): Promise<string> {
    return this.response.text();
  }

  public async assertStatus(expectedStatus: number): Promise<this> {
    this.logger.step(`Assert response status ${expectedStatus}`);
    await expect(this.response).toBeOK();
    expect(this.response.status()).toBe(expectedStatus);
    return this;
  }

  public raw(): APIResponse {
    return this.response;
  }
}
