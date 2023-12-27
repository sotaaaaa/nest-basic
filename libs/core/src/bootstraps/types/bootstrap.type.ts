/**
 * Represents the options for bootstrapping a service.
 */
export type ServiceBootstrapOptions = {
  serviceName: string;
  servicePort: number;
  configPath: string;
  serviceVersion?: string;
  serviceTimeout?: number;
};

export type TransportSetupOtions = any;
