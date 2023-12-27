import { INestApplication, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

export class AppUtils {
  /**
   * Handles graceful shutdown of the application.
   * @param app - The instance of the Nest application.
   */
  public static killAppWithGrace = (app: INestApplication) => {
    // Xử lý khi nhận tín hiệu SIGINT (Ctrl + C trên bàn phím)
    process.on('SIGINT', async () => {
      Logger.log('Received SIGINT signal. Gracefully shutting down...');

      // Đặt một thời gian chờ rồi mới thoát ứng dụng
      setTimeout(() => process.exit(1), 100);

      // Đóng ứng dụng NestJS
      await app.close();
      Logger.log('Application closed with SIGINT.');
      process.exit(0);
    });

    // Xử lý khi nhận tín hiệu SIGTERM (Tín hiệu terminate)
    process.on('SIGTERM', async () => {
      Logger.log('Received SIGTERM signal. Gracefully shutting down...');

      // Đặt một thời gian chờ rồi mới thoát ứng dụng
      setTimeout(() => process.exit(1), 100);

      // Đóng ứng dụng NestJS
      await app.close();
      Logger.log('Application closed with SIGTERM.');
      process.exit(0);
    });
  };

  /**
   * Loads a file from the specified path and returns its parsed content.
   * @param path - The path to the file.
   * @returns The parsed content of the file.
   */
  public static loadYamlFile<T = any>(path: string): T {
    // Read the file content
    const raw = fs.readFileSync(path, 'utf8');

    // Replace environment variables in the content
    const custom = this.replaceEnvVariables(raw);

    // Parse the custom content as YAML
    const data = yaml.load(custom);

    return data as T;
  }

  // Replace environment variables in the content
  private static replaceEnvVariables(content: string): string {
    return content.replace(/\${(\w+)}/g, (match, name) => {
      return process.env[name] || match;
    });
  }
}
