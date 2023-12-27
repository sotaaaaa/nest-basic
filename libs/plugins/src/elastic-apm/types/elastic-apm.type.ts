import { ElasticApmService } from '../services/elastic-apm.service';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

// Abstract class for ApmInterceptorConstructor
export abstract class ApmInterceptorConstructor implements NestInterceptor {
  protected constructor(
    protected readonly elasticApmService: ElasticApmService,
    protected readonly mapFunction?: (request: any) => UserContextKeys,
  ) {}

  // Abstract method for intercepting requests
  public abstract intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>>;
}

// Interface for user context keys
export interface UserContextKeys {
  id?: string | number;
  username?: string;
  email?: string;
}

// Type for ApmFunctionFilter
export type ApmFunctionFilter<T = any> = (payload: T) => void;

// Interface for ApmClassFilter
export interface ApmClassFilter<T = any> {
  filter: ApmFunctionFilter<T>;
}

// Type for ApmFilter
export type ApmFilter<T = any> = ApmClassFilter<T> | ApmFunctionFilter<T>;

// Type for ApmError
export type ApmError = string | Error | { message: string; params: any[] };

// Interface for ApmOptions
export interface ApmOptions {
  httpUserMapFunction?: (request: any) => UserContextKeys;
}

// Interface for ApmAsyncOptions
export interface ApmAsyncOptions {
  useFactory?: (...args: any[]) => Promise<ApmOptions> | ApmOptions;
  inject?: any;
}
