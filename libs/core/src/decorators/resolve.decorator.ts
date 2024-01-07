import { UseFilters, UseInterceptors, applyDecorators } from '@nestjs/common';
import { ErrorExceptionFilter, GatewayExceptionFilter } from '@skylinetech/core';
import {
  HttpInterceptor,
  RpcInterceptor,
  TransformHeadersInterceptor,
} from '@skylinetech/core';

/**
 * Decorator that applies the `UseFilters` decorator with the `ErrorExceptionFilter` to a service method.
 * @returns The decorated method.
 */
export const ServiceToGateway = () => {
  return applyDecorators(
    UseInterceptors(RpcInterceptor),
    UseFilters(ErrorExceptionFilter),
  );
};

/**
 * Decorator that applies filters and interceptors to a gateway method.
 * @returns The decorator function.
 */
export const GatewayToClient = () => {
  return applyDecorators(
    UseInterceptors(HttpInterceptor, TransformHeadersInterceptor),
    UseFilters(GatewayExceptionFilter),
  );
};
