import { APIRequestContext } from '@playwright/test';
import { Logger } from '../../shared/logger/logger';
import { RequestBuilder } from './request-builder';

export class ApiClient {
  public constructor(
    private readonly requestContext: APIRequestContext,
    private readonly logger: Logger
  ) {}

  public request(): RequestBuilder {
    return new RequestBuilder(this.requestContext, this.logger);
  }
}
