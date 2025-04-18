import { Module } from '@nestjs/common';
import { TaxFormService } from './tax-form.service';
import { TaxFormController } from './tax-form.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TaxFormController],
  providers: [TaxFormService],
  exports: [TaxFormService],
})
export class TaxFormModule {} 