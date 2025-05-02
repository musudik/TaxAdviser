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
    await this.$connect();
    // Add middleware or extensions here if needed

    // Log successful connection
    console.log("Successfully connected to database via Prisma");
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
