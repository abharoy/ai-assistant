import { Injectable, Logger } from '@nestjs/common';
import { config } from '@/config/config';

@Injectable()
export class LoggerService extends Logger {
  constructor(context?: string) {
    super(context);
  }

  info(message: string, data?: any) {
    if (config.app.logLevel === 'debug') {
      this.log(`[INFO] ${message}`, data ? JSON.stringify(data) : '');
    }
  }

  warn(message: string, data?: any) {
    this.warn(`[WARN] ${message}`, data ? JSON.stringify(data) : '');
  }

  error(message: string, trace?: string, data?: any) {
    this.error(`[ERROR] ${message}`, trace || '', data ? JSON.stringify(data) : '');
  }

  debug(message: string, data?: any) {
    if (config.app.logLevel === 'debug') {
      this.debug(`[DEBUG] ${message}`, data ? JSON.stringify(data) : '');
    }
  }
}