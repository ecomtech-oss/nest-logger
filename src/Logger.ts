import { Injectable } from '@nestjs/common';
import {
  createLogger,
  Logger as WinstonLogger,
  format,
  transports,
} from 'winston';
import * as rTracer from 'cls-rtracer';
import { mapValues, repeat } from 'lodash';
import { ProjectConfig } from 'ProjectConfig';

@Injectable()
export class Logger {
  private readonly logger: WinstonLogger;

  constructor(settings: ProjectConfig) {
    this.logger = createLogger({
      level: 'info',
      defaultMeta: { project_name: settings.name },
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        this.traceIdFormat(),
        format.json(),
      ),
      transports: [new transports.Console()],
    });
  }

  log(message: string, data?: any) {
    this.logger.info({ message: { message, ...this.hideSensitiveData(data) } });
  }

  error(message: string, data: any) {
    this.logger.error({ message, data: this.hideSensitiveData(data) });
  }

  private hideSensitiveData = (data: any) => {
    if (typeof data !== 'object' || !data) {
      return data;
    }

    const SENSITIVE_DATA_KEYS = ['password', 'token', 'authorization'];

    return mapValues(data, (value, key) => {
      if (typeof value !== 'string') {
        return this.hideSensitiveData(value);
      }

      if (SENSITIVE_DATA_KEYS.includes(key)) {
        return repeat('*', value.length);
      }

      return value;
    });
  };

  private traceIdFormat = format(info => {
    info.traceID = rTracer.id();

    return info;
  });
}
