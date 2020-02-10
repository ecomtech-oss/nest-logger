# nest-logger

Provides simple NestJS-module to create logs in cool, grafana-friendly format.

Why this library:

+ simple way — common NestJS module
+ uniform — json can be parsed from `stdin`/`stderr`
+ trace_id — it provides uniq id for every request

## Usage

Install it
```
yarn add @samokat/nest-logger
```

Add it to `AppModule`
```ts
// app.module.ts
import { Module, NestModule } from '@nestjs/common';
import { LoggerModule } from '@samokat/nest-logger';

@Module({
  imports: [
    LoggerModule.forRoot(),
  ],
})
export class AppModule implements NestModule {
  public configure() {
    // pass
  }
}
```

Setup TraceId genrator:

```ts
// main.ts
import { NestFactory } from '@nestjs/core';
import { expressMiddleware } from 'cls-rtracer';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(expressMiddleware());

  await app.listen(3000);
}

bootstrap();
```

Use it in any place of your app
```ts
// any-file.ts
import { Logger } from '@samokat/nest-logger';

@Injectable()
export class AnyService {
  constructor(
    private readonly logger: Logger,
  ) {}

  async doAnything(someData: any): Promise<void> {
    this.logger.log('hello from #doAnything', someData)

    if (someData.length === 0) {
      this.logger.error('error =(', someData)
    }
  }
}
```

## Details

### Module registration

`LoggerModule#forRoot` register module for whole application, if you want register it only for current module, just use this way:

```ts
// app.module.ts
import { Module, NestModule } from '@nestjs/common';
import { LoggerModule } from '@samokat/nest-logger';

@Module({
  imports: [
    LoggerModule,
  ],
})
export class AppModule implements NestModule {
  public configure() {
    // pass
  }
}
```

### TraceID Generation

Every log bounded for request, it can help to trace logs by requests. We use great [cls-rtracer](https://github.com/puzpuzpuz/cls-rtracer) library for generation TraceID, please install and setup it separately. If you using Express-adapter, you should just do [instruction from the first block](#usage). Otherwise, please refer to `cls-rtracer` documentation.
