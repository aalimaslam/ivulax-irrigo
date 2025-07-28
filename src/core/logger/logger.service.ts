import 'reflect-metadata';
import { Injectable, Logger as NestLogger, Scope } from '@nestjs/common';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends NestLogger {
  private logger: winston.Logger;

  constructor(readonly context?: string) {
    super(context);
    this.logger = winston.createLogger({
      level: 'debug',
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(context, {
              prettyPrint: true,
              colors: true,
            }),
          ),
        }),
      ],
    });
  }

  info(message: any): void {
    this.logger.info(message, { context: this.context });
  }

  error(message: any, trace?: any): void {
    this.logger.error(message, { context: this.context, trace });
  }

  warn(message: any): void {
    this.logger.warn(message, { context: this.context });
  }

  debug(message: any): void {
    this.logger.debug(message, { context: this.context });
  }

  verbose(message: string): void {
    this.logger.verbose(message, { context: this.context });
  }
}
