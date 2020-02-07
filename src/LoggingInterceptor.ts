import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Headers,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Logger } from './Logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  logResponse(res, requestData) {
    const oldWrite = res.write;
    const oldEnd = res.end;

    const chunks: Buffer[] = [];

    res.write = (...restArgs) => {
      chunks.push(Buffer.from(restArgs[0]));
      oldWrite.apply(res, restArgs);
    };

    res.end = (...restArgs) => {
      if (restArgs[0]) {
        chunks.push(Buffer.from(restArgs[0]));
      }
      const body = Buffer.concat(chunks).toString('utf8');
      this.logger.log('response', { body, requestData });
      oldEnd.apply(res, restArgs);
    };
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const { headers, url, method, body } = httpContext.getRequest();
    const res = httpContext.getResponse();
    const reqData = { headers, url, method, body };
    this.logger.log('request', { ...reqData });
    this.logResponse(res, reqData);

    return next.handle().pipe(
      catchError(error => {
        this.logger.error('catched error', { error });
        return throwError(error);
      }),
    );
  }
}
