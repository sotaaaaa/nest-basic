import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { APM_INSTANCE } from '@skylinetech/plugins';
import { Observable, map } from 'rxjs';
import * as APM from 'elastic-apm-node';
import { Request } from 'express';
import { ErrorCodes } from '@skylinetech/core/constants';

@Injectable()
export class HttpInterceptor<T> implements NestInterceptor<T> {
  constructor(@Inject(APM_INSTANCE) private readonly apm: APM.Agent) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    // If the request is not an HTTP request, skip
    const isHttpRequest = context.getType() === 'http';
    if (!isHttpRequest) return next.handle();

    // Start new transaction and span
    const request = context.switchToHttp().getRequest<Request>();
    const originalUrl = request['originalUrl'];
    const endpoint = `${request.method.toUpperCase()} ${originalUrl.split('?')[0]}`;
    const transaction = this.apm.startTransaction(endpoint, 'HTTP');
    const preTimeNow = Date.now();

    // Process the request and continue the transaction
    return next.handle().pipe(
      map((value) => {
        // Change transaction result to 200
        transaction.result = HttpStatus.OK;

        // End transaction and span
        Logger.log(`${endpoint} ${transaction.result} [${Date.now() - preTimeNow}ms]`);
        transaction.end();

        // Return result and convert to standard response
        return { code: ErrorCodes.HttpSuccess, data: value };
      }),
    );
  }
}
