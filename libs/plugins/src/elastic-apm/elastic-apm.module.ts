import { ConfigService } from '@nestjs/config';
import { ElasticApmErrorInterceptor } from './intercepters/apm-error.intercepter';
import { ElasticApmService } from './services/elastic-apm.service';
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { APM_OPTIONS, APM_INSTANCE } from './constants';
import { FactoryProvider } from '@nestjs/common/interfaces';

const providers: Provider[] = [
  ElasticApmService,
  ElasticApmErrorInterceptor,
  {
    provide: APM_INSTANCE,
    useFactory: (elasticApmService: ElasticApmService) => elasticApmService.instance,
    inject: [ElasticApmService],
  },
];

/**
 * Module ApmPluginModule được sử dụng để tích hợp và cấu hình APM (Application Performance Monitoring) trong ứng dụng.
 * Module này cung cấp một phương thức tĩnh `forPlugin()` để tạo một module động cho việc tích hợp APM.
 */
@Global()
@Module({})
export class ElasticApmPluginModule {
  /**
   * Phương thức tạo module động ApmPluginModule cho việc tích hợp APM.
   * @returns Một đối tượng DynamicModule chứa các cấu hình và providers cần thiết cho việc tích hợp APM.
   */
  public static forPlugin(): DynamicModule {
    const asyncProviders: FactoryProvider = {
      provide: APM_OPTIONS,
      useFactory: async (configService: ConfigService) => configService.get('APM'),
      inject: [ConfigService],
    };

    return {
      exports: [ElasticApmService, APM_INSTANCE, APM_OPTIONS],
      module: ElasticApmPluginModule,
      providers: [asyncProviders, ...providers],
    };
  }
}
