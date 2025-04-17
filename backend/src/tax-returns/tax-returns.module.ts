import { Module } from '@nestjs/common';
import { TaxFormsController } from './tax-forms.controller';
import { TaxFormsService } from './tax-forms.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TaxFormsController],
  providers: [TaxFormsService],
  exports: [TaxFormsService]
})
export class TaxFormsModule {} 