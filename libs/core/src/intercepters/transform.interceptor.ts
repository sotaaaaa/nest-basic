import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformHeadersInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data: Record<string, any>) => {
        const response = context.switchToHttp().getResponse<Response>();
        // Set HTTP status code to OK
        response && response.status && response.status(HttpStatus.OK);

        // Return the data
        return data;
      }),
    );
  }
}
