import { INestApplication, Logger } from '@nestjs/common';
import { BaseTransporter } from './base.transport';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import {
  ServiceBootstrapOptions,
  TransportSetupOtions,
} from './../bootstraps/types/bootstrap.type';
import * as _ from 'lodash';
import * as fg from 'fast-glob';

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
   * Logic for setting up the transporter goes here.
   */
  protected setupTransporter(): void {
    const configs = this.getTransporterConfigs(this.options);
    const protoPath = fg.sync(configs.options.protoPath);

    // If the transporter is not enabled, return.
    if (!configs.enable) {
      return Logger.log('GRPC transporter is not enabled');
    }

    // Setup the transporter.
    this.application.connectMicroservice<GrpcOptions>(
      { transport: Transport.GRPC, options: { ...configs.options, protoPath } },
      { inheritAppConfig: true },
    );

    // Log the transporter initialization.
    this.logger.log('GRPC transporter initialized');
  }
}
