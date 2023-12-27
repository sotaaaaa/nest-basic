import { SimpleLoggerService } from './logging/simple.logging';
import { DynamicModule, Module } from '@nestjs/common';

/**
 * Một module để tích hợp Winston logging với Nest framework.
 * Module này được thiết kế để được sử dụng bởi người dùng muốn kết hợp Winston với Nest framework.
 * Các tùy chọn cấu hình có thể được tải từ một vị trí tập trung.
 */
@Module({})
export class WinstonPluginModule {
  /**
   * Phục vụ những người dùng kết hợp với thư viện nest-core
   * Các config lúc này sẽ được load từ một chỗ
   */
  static forPlugin(): DynamicModule {
    // Return module
    return {
      module: WinstonPluginModule,
      providers: [SimpleLoggerService],
      exports: [SimpleLoggerService],
    };
  }
}
