import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, HttpStatus } from '@nestjs/common';
import { TaxFormService } from './tax-form.service';
import { CreateTaxFormDto, UpdateTaxFormDto, TaxFormResponse } from './dto/tax-form.dto';

@Controller('tax-forms')
export class TaxFormController {
  constructor(private readonly taxFormService: TaxFormService) {}

  @Post()
  async create(@Body() createTaxFormDto: CreateTaxFormDto): Promise<TaxFormResponse> {
    try {
      return await this.taxFormService.create(createTaxFormDto);
    } catch (error) {
      throw new HttpException(
        `Failed to create tax form: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  async findAll(): Promise<TaxFormResponse[]> {
    try {
      return await this.taxFormService.findAll();
    } catch (error) {
      throw new HttpException(
        `Failed to fetch tax forms: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('application/:applicationId')
  async findByApplicationId(@Param('applicationId') applicationId: string): Promise<TaxFormResponse> {
    try {
      const result = await this.taxFormService.findByApplicationId(applicationId);
      if (!result) {
        throw new HttpException('Tax form not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        `Failed to fetch tax form by application ID: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string): Promise<TaxFormResponse[]> {
    try {
      return await this.taxFormService.findByUserId(userId);
    } catch (error) {
      throw new HttpException(
        `Failed to fetch tax forms by user ID: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TaxFormResponse> {
    try {
      const result = await this.taxFormService.findOne(id);
      if (!result) {
        throw new HttpException('Tax form not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        `Failed to fetch tax form: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaxFormDto: UpdateTaxFormDto,
  ): Promise<TaxFormResponse> {
    try {
      const result = await this.taxFormService.update(id, updateTaxFormDto);
      if (!result) {
        throw new HttpException('Tax form not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        `Failed to update tax form: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<TaxFormResponse> {
    try {
      const result = await this.taxFormService.remove(id);
      if (!result) {
        throw new HttpException('Tax form not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        `Failed to delete tax form: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post(':id/submit')
  async submit(@Param('id') id: string): Promise<TaxFormResponse> {
    try {
      const result = await this.taxFormService.submit(id);
      if (!result) {
        throw new HttpException('Tax form not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        `Failed to submit tax form: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 