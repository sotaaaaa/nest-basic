import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  ExceptionFilter,
  Inject,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponse } from './error.exception';
import { ErrorMappings } from './error.mapping';
import { AppConstants } from '@skylinetech/core/constants';
import { APM_INSTANCE } from '@skylinetech/plugins';
import * as APM from 'elastic-apm-node';
import * as _ from 'lodash';
import { RpcException } from '@nestjs/microservices';

// This decorator tells Nest to use this class as a global exception filter.
@Catch()
export class ErrorExceptionFilter implements ExceptionFilter {
  // Inject the APM instance into the filter.
  constructor(@Inject(APM_INSTANCE) private readonly apm: APM.Agent) {}

  // This method is called whenever an exception is thrown in your application.
  catch(exception, host: ArgumentsHost) {
    // Get the request and response objects from the host.
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Get the response from the exception. This is typically an object with a message property.
    // Get the error code from the exception response or map the status code to an error code.
    const exceptionResponse = (exception.getResponse && exception.getResponse()) || {};
    const { statusCode, code, errors, message } = exceptionResponse as ErrorResponse & {
      statusCode: HttpStatus;
    };
    const errorCode = code || ErrorMappings.nestJsErrorMapping(statusCode);
    const isHttpRequest = host.getType() === 'http';
    const timestamp = new Date().toISOString();

    // Log the exception to the console.
    // Capture the error in APM for monitoring purposes.
    Logger.error(exception);
    this.apm.captureError(exception);

    // Construct the error response object.
    const errorResponse = {
      code: errorCode,
      timestamp: timestamp,
      errors: errors,
      message: message || AppConstants.errors.defaultMessage,
    };

    // If there is no response object (i.e., if we are in a microservice context), return the error response.
    if (!isHttpRequest) {
      // Omit properties with undefined values for lodash.
      const responseWithoutUndefined = _.omitBy(errorResponse, _.isUndefined);
      const rpcErrorResponse = JSON.stringify(responseWithoutUndefined);

      // Throw the error response.
      throw new RpcException(rpcErrorResponse);
    }

    // If there is a response object (i.e., if we are in an HTTP context), send the error response.
    response.status(HttpStatus.OK).json(errorResponse);
  }
}
