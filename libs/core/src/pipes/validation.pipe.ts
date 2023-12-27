import { ErrorCodes } from './../constants/error.constant';
import { AppConstants } from './../constants/app.constant';
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ErrorException } from '../errors';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform<T>(value: T, { metatype }: ArgumentMetadata): Promise<T> {
    // If the value is null or undefined, create a new empty object
    if (value === null || !value) {
      value = Object.assign({}, value);
    }

    // If the metatype is not provided or does not require validation, return the value as is
    if (!metatype || !ValidationPipe.toValidate(metatype)) {
      return value;
    }

    // Convert the value to an instance of the metatype class
    const object = plainToClass(metatype, value);

    // Validate the object using class-validator library
    const errors = await validate(object, AppConstants.validatorOptions);

    // If there are no validation errors, return the value as is
    if (errors.length === 0) {
      return value;
    }

    // Extract top-level errors with constraints
    const topLevelErrors: ValidationErrorDto[] = errors
      .filter((v) => v.constraints)
      .map((error) => ({
        property: error.property,
        constraints: Object.values(error.constraints as any),
      }));

    // Extract nested errors without constraints
    const nestedErrors: ValidationErrorDto[] = [];
    errors
      .filter((v) => !v.constraints)
      .forEach((error) => {
        const validationErrors = this.getValidationErrorsFromChildren(
          error.property,
          error.children,
        );
        nestedErrors.push(...validationErrors);
      });

    // Combine top-level and nested errors
    const validationErrors = topLevelErrors.concat(nestedErrors);

    // Create a comma-separated string of error properties
    const errorProperties = validationErrors.map((e) => e.property).join(',');

    // Throw an exception with the validation errors
    throw new ErrorException({
      code: ErrorCodes.HttpUnprocessableEntity,
      errors: validationErrors,
      message: `Validation errors with properties [${errorProperties}]`,
    });
  }

  // Check if the metatype requires validation
  private static toValidate(metatype: any): boolean {
    const types: Array<() => any> = [String, Boolean, Number, Array, Object];

    return !types.includes(metatype);
  }

  // Recursively extract validation errors from nested children
  private getValidationErrorsFromChildren(
    parent: string,
    children: ValidationError[],
    errors: ValidationErrorDto[] = [],
  ): ValidationErrorDto[] {
    children.forEach((child) => {
      if (child.constraints) {
        errors.push({
          property: `${parent}.${child.property}`,
          constraints: Object.values(child.constraints),
        });
      } else {
        return this.getValidationErrorsFromChildren(
          `${parent}.${child.property}`,
          child.children,
          errors,
        );
      }
    });

    return errors;
  }
}

interface ValidationErrorDto {
  property: string;
  constraints: string[];
}
