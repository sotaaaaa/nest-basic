import { INestApplication } from '@nestjs/common';

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
}
