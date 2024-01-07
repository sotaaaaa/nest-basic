import { ConfigModule } from '@nestjs/config';
import { CorePluginModule } from './module/plugin.bootstrap';
import { ModuleBootstrapOptions } from './module/types/module.type';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { ClientGrpcModule } from '@skylinetech/plugins';

@Global()
@Module({})
export class CoreModuleBootstrap {
  static register(options: ModuleBootstrapOptions): DynamicModule {
    return {
      module: CoreModuleBootstrap,
      imports: [
        ConfigModule.forRoot({ envFilePath: options.envFilePath, isGlobal: true }),
        CorePluginModule.register({
          path: options.path,
          envFilePath: options.envFilePath,
        }),
        ClientGrpcModule.forPlugin(options.path),
      ],
      global: true,
    };
  }
}
