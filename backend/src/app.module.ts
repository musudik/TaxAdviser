import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { getTypeOrmConfig } from './config/typeorm.config';
import { PrismaModule } from './prisma/prisma.module';
import { TaxFormModule } from './tax-form/tax-form.module';

// Remove temporary implementations as NestJS dependencies should be properly installed

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getTypeOrmConfig,
      inject: [ConfigService],
    }),
    PrismaModule,
    AuthModule,
    TaxFormModule,
  ],
})
export class AppModule {} 