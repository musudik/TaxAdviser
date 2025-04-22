import { Injectable, OnModuleInit, OnModuleDestroy, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['error', 'warn'],
      errorFormat: 'pretty',
    });
  }

  async onModuleInit() {
    await this.$connect();
    // Add middleware or extensions here if needed
    
    // Log successful connection
    console.log('Successfully connected to database via Prisma');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
  
  // Helper method to enable shutdown hooks for Prisma
  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
} 