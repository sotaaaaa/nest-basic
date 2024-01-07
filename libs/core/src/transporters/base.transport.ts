import { AppUtils } from '@skylinetech/shared';
import {
  ServiceBootstrapOptions,
  TransportSetupOtions,
} from './../bootstraps/types/bootstrap.type';
import { INestApplication, Logger } from '@nestjs/common';

/**
 * Abstract class representing a base transporter.
 */
export abstract class BaseTransporter {
  protected options: ServiceBootstrapOptions;
  protected application: INestApplication;
  protected logger: Logger;

  /**
   * Creates an instance of BaseTransporter.
   * @param app - The Nest application instance.
   * @param options - The service bootstrap options.
   */
  constructor(app: INestApplication, options: ServiceBootstrapOptions) {
    this.options = AppUtils.loadYamlFile(options.configPath);
    this.application = app;
    this.logger = new Logger(this.constructor.name);

    // Setup transporters based on the configurations in the file
    this.setupTransporter();
  }

  /**
   * Abstract method to get transporter configurations.
   * @param configs - The service bootstrap options.
   * @returns The transporter configurations.
   */
  protected abstract getTransporterConfigs(configs: ServiceBootstrapOptions): {
    enable: boolean;
    options: TransportSetupOtions;
  };

  /**
   * Abstract method to setup transporter-specific connections.
   */
  protected abstract setupTransporter(): void;
}
