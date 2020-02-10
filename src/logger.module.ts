import {
  MiddlewareConsumer,
  Module,
  NestModule,
  DynamicModule,
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { Logger } from './Logger';
import { LoggingInterceptor } from './LoggingInterceptor';
import { ProjectConfig } from './ProjectConfig';

@Module({})
export class LoggerModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    // pass
  }

  static forRoot(projectName: string): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        Logger,
        {
          provide: APP_INTERCEPTOR,
          useClass: LoggingInterceptor,
        },
        { provide: ProjectConfig, useValue: new ProjectConfig(projectName) },
      ],
      exports: [Logger],
      global: true,
    };
  }
}
