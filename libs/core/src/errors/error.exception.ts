import { ErrorCodes } from '../constants/error.constant';
import { AppConstants } from '../constants/app.constant';
import { HttpException, HttpStatus } from '@nestjs/common';
import _ from 'lodash';

export type ErrorResponse = {
  code: ErrorCodes;
  message?: string;
  errors?: Record<string, any>[];
};

/**
 * Custom exception class that extends HttpException.
 * It can be used to return success or error responses with custom status codes.
 */
export class ErrorException extends HttpException {
  constructor(error: number | ErrorResponse) {
    if (_.isNumber(error)) {
      // Return success response with custom status code
      super({ code: error, message: AppConstants.errors.defaultMessage }, HttpStatus.OK);
    } else {
      const errorResponse = (error as ErrorResponse) || {};
      const errorMessage = errorResponse['message'] || AppConstants.errors.defaultMessage;

      // Return error response with custom status code
      super({ ...errorResponse, message: errorMessage }, HttpStatus.OK);
    }
  }
}