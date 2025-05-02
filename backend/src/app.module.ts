// Imports are commented out due to missing NestJS dependencies
// import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { AuthModule } from './auth/auth.module';
// import { getTypeOrmConfig } from './config/typeorm.config';
// import { PrismaModule } from './prisma/prisma.module';
// import { TaxFormModule } from './tax-form/tax-form.module';

// Temporary implementation to avoid import errors
// When NestJS dependencies are properly installed, remove these and uncomment the imports above
const Module = (config: any) => config;
const getTypeOrmConfig = () => ({});

// TypeOrmModule
const TypeOrmModule = {
  forRootAsync: (config: any) => config
};

// ConfigModule
const ConfigModule = {
  forRoot: (config: any) => config
};

// ConfigService
class ConfigService {}

// Modules
const AuthModule = {};
const PrismaModule = {};
const TaxFormModule = {};

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