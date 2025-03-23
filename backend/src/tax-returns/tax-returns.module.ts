import { Module } from '@nestjs/common';
import { TaxReturnsController } from './tax-returns.controller';
import { TaxReturnsService } from './tax-returns.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [TaxReturnsController],
  providers: [TaxReturnsService, PrismaService],
  exports: [TaxReturnsService],
})
export class TaxReturnsModule {} 