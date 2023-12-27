import { INestApplication } from '@nestjs/common';
import { BaseTransporter } from './base.transport';
import _ from 'lodash';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import {
  ServiceBootstrapOptions,
  TransportSetupOtions,
} from './../bootstraps/types/bootstrap.type';

export class GrpcTransporter extends BaseTransporter {
  constructor(app: INestApplication, options: ServiceBootstrapOptions) {
    super(app, options);
  }

  /**
   * Get the transporter configurations from the options.
   * @param configs The service bootstrap options.
   * @returns The transporter configurations.
   */
  protected getTransporterConfigs(configs: ServiceBootstrapOptions): {
    enable: boolean;
    options: TransportSetupOtions;
  } {
    const enable: boolean = _.get(configs, 'transporters.grpc.enable', false);
    const options = _.get(configs, 'transporters.grpc.options', {});

    return {
      enable: enable,
      options: options,
    };
  }

  /**
   * Setup the gRPC transporter.
   */
  protected setupTransporter(): void {
    const configs = this.getTransporterConfigs(this.options);

    // If the transporter is not enabled, return.
    if (!configs.enable) {
      return;
    }

    // Setup the transporter.
    this.application.connectMicroservice<MicroserviceOptions>(
      { transport: Transport.GRPC, options: configs.options },
      { inheritAppConfig: true },
    );

    // Start the transporter.
    this.logger.log('Starting the gRPC transporter...');
  }
}
