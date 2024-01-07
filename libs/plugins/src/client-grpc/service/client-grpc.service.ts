import APM from 'elastic-apm-node';
import { CLIENT_GRPC_ELASTIC_APM } from './../constants/client-grpc.constant';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';

@Injectable()
export class ClientGrpcExtraService implements OnModuleInit {
  private logger = new Logger(this.constructor.name);
  private timeout = 30000;

  constructor(
    @Inject(CLIENT_GRPC_ELASTIC_APM) private elasticAPM: APM.Agent,
    private configService: ConfigService,
  ) {}

  // This method is called when the module is initialized
  onModuleInit() {
    // Get the timeout value from the configuration
    this.timeout = this.configService.get<number>('transporters.grpc.timeout');
    this.logger.log(`Client GRPC initialized with timeout ${this.timeout}`);
  }

  /**
   * This method creates a proxy for a service object.
   * The proxy intercepts function calls on the service object and wraps them with the `callServiceMethod` method.
   * This allows to automatically track the performance of all service method calls with Elastic APM.
   *
   * @param service - The service object to create a proxy for.
   * @returns The proxy for the service object.
   */
  private createServiceProxy<T extends object>(service: T): T {
    // Define the handler for the proxy
    const handler = {
      // The get trap is called when a property is read from the proxy
      get: (target, propKey) => {
        // Get the original property value
        const originalMethod = target[propKey];

        // If the property is a function, return a proxy function that wraps the call with `callServiceMethod`
        if (typeof originalMethod === 'function') {
          // Pass the propKey as the method name to callServiceMethod
          return (...args) =>
            this.callServiceMethod(propKey as string, originalMethod, args);
        }

        // If the property is not a function, return the original property value
        return originalMethod;
      },
    };

    // Create and return the proxy for the service object
    return new Proxy(service, handler);
  }

  /**
   * This method wraps a gRPC service method call with an Elastic APM span.
   * It starts a new span before the method call, and ends the span when the method call is completed.
   * If the method call returns a Promise, the span is ended in the finally block.
   * If an error occurs during the method call, the error is captured by Elastic APM and the span is ended.
   *
   * @param method - The gRPC service method to call.
   * @param args - The arguments to pass to the method.
   * @returns The result of the method call.
   */
  private callServiceMethod(methodName: string, method: any, args: any) {
    // Start a new Elastic APM span for the gRPC method call
    const currentTraceparent = this.elasticAPM.currentTraceparent || 'none';
    const traceId = this.elasticAPM.currentTraceIds['trace.id'] || 'none';
    const span = this.elasticAPM.startSpan(`gRPC ${methodName}`, 'custom');

    try {
      // Create a new Metadata object
      const metadata = new Metadata();

      // Add the currentTraceparent and traceId to the metadata
      metadata.add('current-traceparent', currentTraceparent);
      metadata.add('trace-id', traceId);

      // Add the metadata as the last argument to the method call
      const result = method.apply(this, [...args, metadata]);

      // If the result is a Promise, end the span in the finally block
      if (result && typeof result.finally === 'function') {
        return result.finally(() => span && span.end());
      }

      // If the result is not a Promise, end the span immediately
      span && span.end();

      // Return the result of the method call
      return result;
    } catch (error) {
      // If an error occurs, capture the error with Elastic APM and end the span
      if (span) {
        this.elasticAPM.captureError(error);
        span.end();
      }

      // Re-throw the error to be handled by the caller
      throw error;
    }
  }

  // Get a service object by name and create a proxy for it
  public getService<T extends object>(clientGrpc: ClientGrpc, serviceName: string): T {
    /**
     * This method returns a service object by name.
     * The service object is a gRPC client that can be used to make calls to the service.
     */
    const service = clientGrpc.getService<T>(serviceName);
    return this.createServiceProxy(service);
  }
}
