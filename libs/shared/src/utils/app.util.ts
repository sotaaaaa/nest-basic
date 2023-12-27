import { INestApplication } from '@nestjs/common';
import fs from 'fs';
import mustache from 'mustache';
import yaml from 'js-yaml';

export class AppUtils {
  /**
   * Handles graceful shutdown of the application.
   * @param app - The instance of the Nest application.
   */
  public static killAppWithGrace = (app: INestApplication) => {
    process.on('SIGINT', async () => {
      setTimeout(() => process.exit(1), 100);
      await app.close();
      process.exit(0);
    });

    // Kill -15
    process.on('SIGTERM', async () => {
      setTimeout(() => process.exit(1), 100);
      await app.close();
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

    // Render the content with environment variables using Mustache
    const custom = mustache.render(raw, process.env, {}, ['${', '}']);

    // Parse the custom content as YAML
    const data = yaml.load(custom);

    return data as T;
  }
}
