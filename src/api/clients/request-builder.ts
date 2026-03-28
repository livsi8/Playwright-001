import { APIRequestContext, APIResponse } from '@playwright/test';
import { Logger } from '../../shared/logger/logger';
import { ResponseWrapper } from './response-wrapper';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export class RequestBuilder {
  private method: HttpMethod = 'GET';
  private path = '/';
  private headers: Record<string, string> = {};
  private query: Record<string, string> = {};
  private payload: unknown;

  public constructor(
    private readonly requestContext: APIRequestContext,
    private readonly logger: Logger
  ) {}

  public withMethod(method: HttpMethod): this {
    this.method = method;
    return this;
  }

  public withPath(path: string): this {
    this.path = path;
    return this;
  }

  public withHeader(name: string, value: string): this {
    this.headers[name] = value;
    return this;
  }

  public withQuery(name: string, value: string): this {
    this.query[name] = value;
    return this;
  }

  public withBody(payload: unknown): this {
    this.payload = payload;
    return this;
  }

  public async send<TBody = unknown>(): Promise<ResponseWrapper<TBody>> {
    this.logger.info(
      `API request: ${this.method} ${this.path} | query=${JSON.stringify(this.query)} | payload=${JSON.stringify(
        this.payload ?? {}
      )}`
    );

    const response = await this.execute();

    this.logger.info(`API response: status=${response.status()} | url=${response.url()}`);

    return new ResponseWrapper<TBody>(response, this.logger);
  }

  private async execute(): Promise<APIResponse> {
    switch (this.method) {
      case 'GET':
        return this.requestContext.get(this.path, { headers: this.headers, params: this.query });
      case 'POST':
        return this.requestContext.post(this.path, { headers: this.headers, params: this.query, data: this.payload });
      case 'PUT':
        return this.requestContext.put(this.path, { headers: this.headers, params: this.query, data: this.payload });
      case 'PATCH':
        return this.requestContext.patch(this.path, { headers: this.headers, params: this.query, data: this.payload });
      case 'DELETE':
        return this.requestContext.delete(this.path, { headers: this.headers, params: this.query, data: this.payload });
      default:
        throw new Error(`Unsupported HTTP method ${this.method}`);
    }
  }
}
