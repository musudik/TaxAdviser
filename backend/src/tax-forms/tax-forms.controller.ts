import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, HttpCode, Patch } from '@nestjs/common';
import { TaxFormsService } from './tax-forms.service';
import { 
  CreateTaxFormDto, 
  UpdateTaxFormDto,
  SaveFormSectionDto,
  CreateDocumentDto 
} from './dto/tax-form.dto';

// Since we don't have the auth guard yet, we'll temporarily disable it
@Controller('api/tax-forms')
export class TaxFormsController {
  constructor(private readonly taxFormsService: TaxFormsService) {}

  @Post()
  // @UseGuards(JwtAuthGuard)
  async create(@Body() createTaxFormDto: CreateTaxFormDto) {
    return this.taxFormsService.create(createTaxFormDto);
  }

  @Get()
  // @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.taxFormsService.findAll();
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.taxFormsService.findOne(id);
  }

  @Get('user/:userId')
  // @UseGuards(JwtAuthGuard)
  async findByUser(@Param('userId') userId: string) {
    return this.taxFormsService.findByUser(userId);
  }

  @Put(':id')
  // @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateTaxFormDto: UpdateTaxFormDto) {
    return this.taxFormsService.update(id, updateTaxFormDto);
  }

  @Patch(':id/save-section')
  // @UseGuards(JwtAuthGuard)
  async saveSection(@Param('id') id: string, @Body() saveFormSectionDto: SaveFormSectionDto) {
    return this.taxFormsService.saveSection(id, saveFormSectionDto);
  }

  @Post(':id/submit')
  // @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async submitForm(@Param('id') id: string) {
    return this.taxFormsService.submitForm(id);
  }

  @Post('documents')
  // @UseGuards(JwtAuthGuard)
  async addDocument(@Body() createDocumentDto: CreateDocumentDto) {
    return this.taxFormsService.addDocument(createDocumentDto);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return this.taxFormsService.remove(id);
  }

  @Get('application/:applicationId')
  // @UseGuards(JwtAuthGuard)
  async findByApplicationId(@Param('applicationId') applicationId: string) {
    return this.taxFormsService.findByApplicationId(applicationId);
  }
} 