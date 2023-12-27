import { GrpcTransporter } from './grpc.transporter';
import { ServiceBootstrapOptions } from './../bootstraps/types/bootstrap.type';
import { INestApplication } from '@nestjs/common';

/**
 * The CoreTransporter class is responsible for starting all transporters in the application.
 */
export class CoreTransporter {
  /**
   * Starts all transporters in the application.
   * @param app - The Nest application instance.
   * @param options - The bootstrap options for the transporters.
   */
  public static startAllTransporters(
    app: INestApplication,
    options: ServiceBootstrapOptions,
  ) {
    // Start the gRPC transporter.
    new GrpcTransporter(app, options);
  }
}
