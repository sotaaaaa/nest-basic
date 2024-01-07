import { ClientGrpcExtraService } from './../service/client-grpc.service';
import { ExecutionContext, Inject, createParamDecorator } from '@nestjs/common';

/**
 * Decorator function that creates a client gRPC service.
 *
 * @param clientName - The name of the gRPC client.
 * @param serviceName - The name of the gRPC service.
 * @returns A decorator function that injects the gRPC client and defines a getter for the gRPC service.
 */
export function ClientGrpcService(clientName: string, serviceName: string) {
  return function (target: object, propertyKey: string) {
    Inject(clientName)(target, 'clientGrpc');
    Inject(ClientGrpcExtraService)(target, 'clientGrpcExtraService');

    // Create a getter for the gRPC service
    const getter = function () {
      return this.clientGrpcExtraService.getService(this.clientGrpc, serviceName);
    };

    // Redefine the property
    Reflect.deleteProperty(target, propertyKey);
    Reflect.defineProperty(target, propertyKey, {
      get: getter,
      enumerable: true,
      configurable: true,
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
    const metadataMap = metadata.metadata.internalRepr;

    // If a key is provided, return the first value for that key
    if (typeof data === 'string') {
      const value = metadataMap.get(data);
      return Array.isArray(value) ? value[0] : value;
    }

    // If no key is provided, convert the Map to an object and return it
    const metadataObject = {};
    for (const [key, value] of metadataMap.entries()) {
      metadataObject[key] = Array.isArray(value) ? value[0] : value;
    }

    // Return the metadata object
    return metadataObject;
  },
);
