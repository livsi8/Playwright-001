export class Logger {
  public constructor(private readonly scope: string) {}

  public info(message: string): void {
    this.log('INFO', message);
  }

  public step(message: string): void {
    this.log('STEP', message);
  }

  public warn(message: string): void {
    this.log('WARN', message);
  }

  public error(message: string): void {
    this.log('ERROR', message);
  }

  private log(level: string, message: string): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}] [${this.scope}] ${message}`);
  }

  public static system(scope: string, message: string): void {
    new Logger(scope).info(message);
  }
}
