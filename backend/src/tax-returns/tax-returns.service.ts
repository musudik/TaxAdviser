import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaxReturnDto, UpdateTaxReturnDto } from './dto/tax-return.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TaxReturnsService {
  constructor(private prisma: PrismaService) {}

  async create(createTaxReturnDto: CreateTaxReturnDto) {
    try {
      // We need to access the actual Prisma client
      const client = this.prisma as any;
      const result = await client.taxReturn.create({
        data: {
          ...createTaxReturnDto,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      return { id: result.id };
    } catch (error) {
      console.error('Error creating tax return:', error);
      throw new Error('Could not create tax return');
    }
  }

  async findAll() {
    const client = this.prisma as any;
    return client.taxReturn.findMany({
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const client = this.prisma as any;
    const taxReturn = await client.taxReturn.findUnique({
      where: { id },
    });

    if (!taxReturn) {
      throw new NotFoundException(`Tax return with ID ${id} not found`);
    }

    return taxReturn;
  }

  async findByClient(clientId: string) {
    const client = this.prisma as any;
    return client.taxReturn.findMany({
      where: { clientId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findByPartner(partnerId: string) {
    const client = this.prisma as any;
    return client.taxReturn.findMany({
      where: { partnerId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async update(id: string, updateTaxReturnDto: UpdateTaxReturnDto) {
    try {
      const client = this.prisma as any;
      const existingTaxReturn = await client.taxReturn.findUnique({
        where: { id },
      });

      if (!existingTaxReturn) {
        throw new NotFoundException(`Tax return with ID ${id} not found`);
      }

      return client.taxReturn.update({
        where: { id },
        data: {
          ...updateTaxReturnDto,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error updating tax return:', error);
      throw new Error('Could not update tax return');
    }
  }

  async remove(id: string) {
    try {
      const client = this.prisma as any;
      const existingTaxReturn = await client.taxReturn.findUnique({
        where: { id },
      });

      if (!existingTaxReturn) {
        throw new NotFoundException(`Tax return with ID ${id} not found`);
      }

      await client.taxReturn.delete({
        where: { id },
      });

      return { message: 'Tax return deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error deleting tax return:', error);
      throw new Error('Could not delete tax return');
    }
  }
} 