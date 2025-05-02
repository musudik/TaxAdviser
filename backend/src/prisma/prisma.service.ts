import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  INestApplication,
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ["error", "warn"],
      errorFormat: "pretty",
    });
  }

  async onModuleInit() {
    const maxRetries = 5;
    let retries = 0;
    
    while (retries < maxRetries) {
      try {
        await this.$connect();
        console.log("Successfully connected to database via Prisma");
        return;
      } catch (error) {
        retries++;
        console.log(`Failed to connect to database. Attempt ${retries} of ${maxRetries}`);
        if (retries === maxRetries) {
          console.error("Failed to connect to database after maximum retries");
          throw error;
        }
        // Wait 2 seconds before retrying
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Helper method to activate Prisma shutdown hooks
  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}
