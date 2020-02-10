import {
  MiddlewareConsumer,
  Module,
  NestModule,
  DynamicModule,
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { Logger } from './Logger';
import { LoggingInterceptor } from './LoggingInterceptor';

const providers = [
  Logger,
  {
    provide: APP_INTERCEPTOR,
    useClass: LoggingInterceptor,
  },
];

@Module({
  providers,
  exports: [Logger],
})
export class LoggerModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    // pass
  }

  static forRoot(): DynamicModule {
    return {
      module: LoggerModule,
      providers,
      exports: [Logger],
      global: true,
    };
  }
}
