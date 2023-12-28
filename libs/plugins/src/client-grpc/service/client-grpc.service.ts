import APM from 'elastic-apm-node';
import { ClientGrpc } from '@nestjs/microservices';
import {
  CLIENT_GRPC,
  CLIENT_GRPC_ELASTIC_APM,
} from './../constants/client-grpc.constant';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClientGrpcExtraService implements OnModuleInit {
  public logger = new Logger(this.constructor.name);
  public timeout: number = 30000;

  constructor(
    @Inject(CLIENT_GRPC) private readonly clientGrpc: ClientGrpc,
    @Inject(CLIENT_GRPC_ELASTIC_APM) private readonly elasticAPM: APM.Agent,
    private readonly configService: ConfigService,
  ) {}

  // This method is called when the module is initialized
  onModuleInit() {
    // Get the timeout value from the configuration
    this.timeout = this.configService.get<number>('transporters.grpc.timeout');
    this.logger.log(`Client GRPC initialized with timeout ${this.timeout}`);
  }

  // Create a proxy for the service object
  private createServiceProxy<T extends object>(service: T): T {
    return new Proxy(service, {
      get: (target, prop: string) => {
        const originalFunction = target[prop];
        if (typeof originalFunction === 'function') {
          // Intercept method calls and wrap them with error handling and APM tracing
          return (...args: any[]) => this.callServiceMethod(target, prop, args);
        }
        return originalFunction;
      },
    }) as T;
  }

  // Call a service method with error handling and APM tracing
  private callServiceMethod(target: any, methodName: string, args: any[]) {
    // Start a new APM transaction and span
    const transaction = this.elasticAPM.startTransaction(
      `GRPC Call method: ${methodName}`,
    );
    const span = transaction.startSpan(`GRPC Call method: ${methodName}`);

    // Call the original service method and handle timeouts
    const resultPromise = target[methodName](...args);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        // Capture an error in APM
        this.elasticAPM.captureError(new Error('Timeout'));

        // Log the error
        this.logger.error(`GRPC timeout calling method ${methodName}`);

        // Reject the result promise and capture an error
        reject(new Error('Timeout'));
      }, this.timeout);
    });

    // Race between the result promise and the timeout promise
    const result = Promise.race([resultPromise, timeoutPromise]);

    // End the APM span and transaction when the result promise is settled
    result.finally(() => {
      span.end();
      transaction.end();
    });

    // Return the result promise
    return result;
  }

  // Get a service object by name and create a proxy for it
  getService<T extends object>(serviceName: string): T {
    const service = this.clientGrpc.getService<T>(serviceName);
    return this.createServiceProxy(service);
  }
}
