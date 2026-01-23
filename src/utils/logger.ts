type LogLevel = 'log' | 'info' | 'warn' | 'error';

class Logger {
  private readonly isDevelopment = import.meta.env.DEV;

  private formatMessage(_level: LogLevel, message: string, context?: string): string {
    const prefix = context ? `[${context}]` : '';
    return prefix ? `${prefix} ${message}` : message;
  }

  log(message: string, ...args: unknown[]): void {
    if (this.isDevelopment) {
      console.log(this.formatMessage('log', message), ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.isDevelopment) {
      console.info(this.formatMessage('info', message), ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.isDevelopment) {
      console.warn(this.formatMessage('warn', message), ...args);
    }
  }

  error(message: string, ...args: unknown[]): void {
    if (this.isDevelopment) {
      console.error(this.formatMessage('error', message), ...args);
    }

  }

  apiRequest(method: string, url: string, data?: unknown): void {
    if (this.isDevelopment) {
      this.log(`🚀 [API] ${method.toUpperCase()} ${url}`, {
        data,
      });
    }
  }

  apiResponse(method: string, url: string, status: number, data?: unknown): void {
    if (this.isDevelopment) {
      this.log(`✅ [API] ${method.toUpperCase()} ${url}`, {
        status,
        data,
      });
    }
  }

  apiError(method: string, url: string, status?: number, error?: unknown): void {
    if (this.isDevelopment) {
      this.error(`❌ [API] ${method.toUpperCase()} ${url}`, {
        status,
        error,
      });
    }
  }
}

export const logger = new Logger();
