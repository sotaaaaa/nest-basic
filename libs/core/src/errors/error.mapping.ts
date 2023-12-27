import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from './../constants/error.constant';

// ErrorMappings class is used to map HTTP and MongoDB error codes to your system's error codes.
export class ErrorMappings {
  // A mapping object where keys are HTTP and MongoDB error codes and values are your system's error codes.
  private static errorMapping: Record<number | string, ErrorCodes> = {
    [HttpStatus.REQUEST_TIMEOUT]: ErrorCodes.HttpRequestTimeout,
    [HttpStatus.BAD_REQUEST]: ErrorCodes.HttpBadRequest,
    [HttpStatus.UNAUTHORIZED]: ErrorCodes.HttpUnauthorized,
    [HttpStatus.FORBIDDEN]: ErrorCodes.HttpForbidden,
    [HttpStatus.NOT_FOUND]: ErrorCodes.HttpNotFound,
    [HttpStatus.UNPROCESSABLE_ENTITY]: ErrorCodes.HttpUnprocessableEntity,
    [HttpStatus.TOO_MANY_REQUESTS]: ErrorCodes.HttpTooManyRequests,
    [HttpStatus.BAD_GATEWAY]: ErrorCodes.HttpBadGateway,
    [HttpStatus.GATEWAY_TIMEOUT]: ErrorCodes.HttpGatewayTimeout,
    [HttpStatus.SERVICE_UNAVAILABLE]: ErrorCodes.HttpServiceUnavailable,
    11000: ErrorCodes.MongoDBDuplicateKeyError,
  };

  // Method to map a given HTTP or MongoDB error code to your system's error code.
  public static nestJsErrorMapping(statusCode: number | string): ErrorCodes {
    // If the given error code exists in the mapping object, return the corresponding system's error code.
    // Otherwise, return the system's HttpServerError error code.
    return this.errorMapping[statusCode] || ErrorCodes.HttpServerError;
  }
}
