import { ExecutionContext, Inject, createParamDecorator } from '@nestjs/common';
import { ClientGrpcExtraService } from './../service/client-grpc.service';

/**
 * Decorator function to inject a gRPC client service.
 *
 * @param serviceName - The name of the gRPC service.
 * @returns A decorator function.
 */
export function ClientGrpcService(serviceName: string) {
  return (target: any, key: string) => {
    Inject(ClientGrpcExtraService)(target, 'clientGrpcExtraService');
    Object.defineProperty(target, key, {
      get: function () {
        return this.clientGrpcExtraService.getService(serviceName);
      },
    });
  };
}

/**
 * `GrpcPayload` is a custom decorator used in a method which is decorated by `@GrpcMethod()`.
 * It extracts the payload (the first argument) from the gRPC method call.
 *
 * @returns The payload of the gRPC method call.
 */
export const GrpcPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const [payload] = ctx.getArgs();
    return payload;
  },
);

/**
 * `GrpcMetadata` is a custom decorator used in a method which is decorated by `@GrpcMethod()`.
 * It extracts the metadata (the third argument) from the gRPC method call.
 *
 * @returns The metadata of the gRPC method call.
 */
export const GrpcMetadata = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const [, , metadata] = ctx.getArgs();
    return metadata;
  },
);
