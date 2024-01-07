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
import * as APM from 'elastic-apm-node';
import { Observable, map } from 'rxjs';

@Injectable()
export class RpcInterceptor<T> implements NestInterceptor<T> {
  private readonly logger = new Logger(this.constructor.name);

  constructor(@Inject(APM_INSTANCE) private readonly elasticAPM: APM.Agent) {
    this.logger.log('RpcInterceptor initialized with APM');
  }

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    // Check http request, if it is, then skip
    const isHttpRequest = context.getType() === 'http';
    if (isHttpRequest) return next.handle();

    // Create a new transaction and span
    let transaction: APM.Transaction;

    // Get the metadata from the context
    const metadata = context.getArgByIndex(1);
    const traceId = metadata.internalRepr.get('trace-id')[0];
    const traceparent = metadata.internalRepr.get('current-traceparent')[0];
    const endpoint = `RPC/${context.getHandler().name}`;

    // If trace id is not provided, then new transaction
    if (traceId === 'none') {
      transaction = this.elasticAPM.startTransaction(endpoint, 'RPC');
      transaction.startSpan(context.getHandler().name, 'RPC');

      // Change metadata to trace id and traceparent from transaction
      metadata.internalRepr.set('trace-id', [transaction.ids['trace.id']]);
      metadata.internalRepr.set('traceparent', [transaction.traceparent]);
    }

    // If trace id is provided, then continue transaction
    // Start span and continue transaction
    transaction = this.elasticAPM.startTransaction(endpoint, 'RPC', {
      childOf: traceparent,
    });
    const span = transaction.startSpan(endpoint, 'RPC');

    // Change request status to 200 and end span when request is completed
    // If error, then change request status to 500
    return next.handle().pipe(
      map((value) => {
        // End transaction and span
        transaction.result = HttpStatus.OK;
        transaction.end();
        span.end();

        // Return result
        return value;
      }),
    );
  }
}
