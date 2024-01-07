import { CorePluginRegister } from './types/module.type';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ElasticApmPluginModule, WinstonPluginModule } from '@skylinetech/plugins';
import { AppUtils } from '@skylinetech/shared';

/**
 * Represents a module used for bootstrapping the application.
 * This module provides a static method `register` that can be used to configure and register the module with specified options.
 */
@Global()
@Module({})
export class CorePluginModule {
  /**
   * Registers the module with the specified options.
   * @param options - The options for configuring the module.
   * @returns A dynamic module object that can be imported into the application.
   */
  static register(options: CorePluginRegister): DynamicModule {
    const configs = AppUtils.loadYamlFile(options.path);
    const importPlugins = options?.plugins || [];

    // Import the configuration module.
    const imports = [
      ConfigModule.forRoot({
        isGlobal: true,
        load: [() => configs],
        envFilePath: options?.envFilePath || '.env',
      }),

      // Import plugins required for the application.
      ElasticApmPluginModule.forPlugin(),
      WinstonPluginModule.forPlugin(),

      // Import other all plugins.
      ...importPlugins,
    ];

    // Return the dynamic module.
    return {
      module: CorePluginModule,
      imports: imports,
    };
  }
}
