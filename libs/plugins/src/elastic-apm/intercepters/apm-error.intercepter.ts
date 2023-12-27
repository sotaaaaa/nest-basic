import { ElasticApmService } from '../services/elastic-apm.service';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ElasticApmErrorInterceptor implements NestInterceptor {
  constructor(protected readonly apmService: ElasticApmService) {}

  /**
   * Intercepts the execution context and handles errors by capturing them with ApmService.
   * @param context The execution context.
   * @param next The call handler.
   * @returns An observable that emits the result or throws an error.
   */
  public intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        this.apmService.captureError(err);
        return throwError(() => new Error(err));
      }),
    );
  }
}
