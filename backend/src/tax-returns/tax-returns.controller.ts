import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { TaxReturnsService } from './tax-returns.service';
import { CreateTaxReturnDto, UpdateTaxReturnDto } from './dto/tax-return.dto';

// Since we don't have the auth guard yet, we'll temporarily disable it
@Controller('api/tax-returns')
export class TaxReturnsController {
  constructor(private readonly taxReturnsService: TaxReturnsService) {}

  @Post()
  // @UseGuards(JwtAuthGuard)
  async create(@Body() createTaxReturnDto: CreateTaxReturnDto) {
    return this.taxReturnsService.create(createTaxReturnDto);
  }

  @Get()
  // @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.taxReturnsService.findAll();
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.taxReturnsService.findOne(id);
  }

  @Get('client/:clientId')
  // @UseGuards(JwtAuthGuard)
  async findByClient(@Param('clientId') clientId: string) {
    return this.taxReturnsService.findByClient(clientId);
  }

  @Get('partner/:partnerId')
  // @UseGuards(JwtAuthGuard)
  async findByPartner(@Param('partnerId') partnerId: string) {
    return this.taxReturnsService.findByPartner(partnerId);
  }

  @Put(':id')
  // @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateTaxReturnDto: UpdateTaxReturnDto) {
    return this.taxReturnsService.update(id, updateTaxReturnDto);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return this.taxReturnsService.remove(id);
  }
} 