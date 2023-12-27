import { ValidationPipe } from './../pipes/validation.pipe';
import { CoreTransporter } from './../transporters/core.transporter';
import { AppUtils } from '@skylinetech/shared/utils';
import { ServiceBootstrapOptions } from './types/bootstrap.type';
import { INestApplication, Logger } from '@nestjs/common';
import { SimpleLoggerService } from '@skylinetech/plugins';

/**
 * Bootstraps the service by killing the application with grace.
 * @param application - The INestApplication instance.
 * @param options - Optional service bootstrap options.
 */
export async function serviceBootstrap(
  application: INestApplication,
  options?: ServiceBootstrapOptions,
) {
  // Kill the application with grace.
  AppUtils.killAppWithGrace(application);

  // Enable shutdown hooks.
  application.enableShutdownHooks();

  // Set the global prefix.
  application.useLogger(application.get(SimpleLoggerService));
  application.useGlobalPipes(new ValidationPipe());

  // Start all transporters.
  CoreTransporter.startAllTransporters(application, options);

  // Start the application and listen on the specified port.
  await application.startAllMicroservices();
  await application.listen(options.servicePort);

  // Log the service information.
  const serviceName = options.serviceName;
  const serviceUrl = await application.getUrl();

  Logger.log(`Service ${serviceName} running on: ${serviceUrl}`);
}
