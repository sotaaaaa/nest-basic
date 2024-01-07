import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  Inject,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { APM_INSTANCE } from '@skylinetech/plugins';
import * as APM from 'elastic-apm-node';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';
import { ErrorCodes } from '@skylinetech/core';

// This decorator tells Nest to use this class as a global exception filter.
@Catch()
export class GatewayExceptionFilter implements ExceptionFilter {
  // Inject the APM instance into the filter.
  constructor(@Inject(APM_INSTANCE) private readonly apm: APM.Agent) {}

  /**
   * Parse exception details to error response
   * Details có thể là string hoặc object stringified
   * @param exception
   */
  private parseExceptionDetails(exception: RpcException) {
    try {
      // Get the details of the exception as a string.
      // Parse the exception details as JSON.
      const exceptionResponseString = exception['details'];
      return JSON.parse(exceptionResponseString);

      // If there is an error while parsing the exception details, return a default error response.
    } catch (error) {
      // Capture the error in APM for monitoring purposes.
      this.apm.captureError(exception);
      Logger.error(exception);

      // Return the default error response.
      return {
        code: ErrorCodes.GatewayRequestError,
        timestamp: new Date().toISOString(),
        message: exception.message || 'Gateway request error',
      };
    }
  }

  // This method is called whenever an exception is thrown in your application.
  catch(exception: RpcException, host: ArgumentsHost) {
    // Get the request and response objects from the host.
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Get details from the exception and check details is JSON string or not
    const errorResponse = this.parseExceptionDetails(exception);
    response.status(HttpStatus.OK).json(errorResponse);
  }
}
