import { ErrorCodes } from '../constants/error.constant';
import { AppConstants } from '../constants/app.constant';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as _ from 'lodash';

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
      const errorMessage = error.message ?? AppConstants.errors.defaultMessage;

      // Return error response with custom status code
      super({ ...error, message: errorMessage }, HttpStatus.OK);
    }
  }
}
