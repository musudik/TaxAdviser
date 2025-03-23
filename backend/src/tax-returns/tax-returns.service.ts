import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaxReturnDto, UpdateTaxReturnDto } from './dto/tax-return.dto';

@Injectable()
export class TaxReturnsService {
  constructor(private prisma: PrismaService) {}

  async create(createTaxReturnDto: CreateTaxReturnDto) {
    try {
      const result = await this.prisma.taxReturn.create({
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
    return this.prisma.taxReturn.findMany({
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const taxReturn = await this.prisma.taxReturn.findUnique({
      where: { id },
    });

    if (!taxReturn) {
      throw new NotFoundException(`Tax return with ID ${id} not found`);
    }

    return taxReturn;
  }

  async findByClient(clientId: string) {
    return this.prisma.taxReturn.findMany({
      where: { clientId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findByPartner(partnerId: string) {
    return this.prisma.taxReturn.findMany({
      where: { partnerId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async update(id: string, updateTaxReturnDto: UpdateTaxReturnDto) {
    try {
      const existingTaxReturn = await this.prisma.taxReturn.findUnique({
        where: { id },
      });

      if (!existingTaxReturn) {
        throw new NotFoundException(`Tax return with ID ${id} not found`);
      }

      return this.prisma.taxReturn.update({
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
      const existingTaxReturn = await this.prisma.taxReturn.findUnique({
        where: { id },
      });

      if (!existingTaxReturn) {
        throw new NotFoundException(`Tax return with ID ${id} not found`);
      }

      await this.prisma.taxReturn.delete({
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