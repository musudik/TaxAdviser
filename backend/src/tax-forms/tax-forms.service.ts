import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  CreateTaxFormDto, 
  UpdateTaxFormDto, 
  SaveFormSectionDto,
  CreateDocumentDto,
  TaxFormStatus
} from './dto/tax-form.dto';

@Injectable()
export class TaxFormsService {
  constructor(private prisma: PrismaService) {}

  async create(createTaxFormDto: CreateTaxFormDto) {
    try {
      // Generate applicationId if not provided
      if (!createTaxFormDto.applicationId) {
        createTaxFormDto.applicationId = this.generateApplicationId();
      }

      const result = await this.prisma.taxForm.create({
        data: {
          ...createTaxFormDto,
          status: createTaxFormDto.status || TaxFormStatus.DRAFT,
          currentStep: createTaxFormDto.currentStep || 0,
          lastSavedAt: new Date(),
        },
      });
      return { id: result.id, applicationId: result.applicationId };
    } catch (error) {
      console.error('Error creating tax form:', error);
      throw new BadRequestException('Could not create tax form: ' + error.message);
    }
  }

  async findAll() {
    return this.prisma.taxForm.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        documents: true,
      },
    });
  }

  async findOne(id: string) {
    const taxForm = await this.prisma.taxForm.findUnique({
      where: { id },
      include: {
        documents: true,
      },
    });

    if (!taxForm) {
      throw new NotFoundException(`Tax form with ID ${id} not found`);
    }

    return taxForm;
  }

  async findByUser(userId: string) {
    return this.prisma.taxForm.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        documents: true,
      },
    });
  }

  async update(id: string, updateTaxFormDto: UpdateTaxFormDto) {
    try {
      const existingTaxForm = await this.prisma.taxForm.findUnique({
        where: { id },
      });

      if (!existingTaxForm) {
        throw new NotFoundException(`Tax form with ID ${id} not found`);
      }

      return this.prisma.taxForm.update({
        where: { id },
        data: {
          ...updateTaxFormDto,
          lastSavedAt: new Date(),
        },
        include: {
          documents: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error updating tax form:', error);
      throw new BadRequestException('Could not update tax form: ' + error.message);
    }
  }

  async saveSection(id: string, saveFormSectionDto: SaveFormSectionDto) {
    try {
      const existingTaxForm = await this.prisma.taxForm.findUnique({
        where: { id },
      });

      if (!existingTaxForm) {
        throw new NotFoundException(`Tax form with ID ${id} not found`);
      }

      const { sectionName, sectionData, currentStep } = saveFormSectionDto;
      
      // Validate section name is a valid form section
      const validSections = [
        'personalInfo', 
        'incomeInfo', 
        'rentalIncome',
        'foreignIncome',
        'workRelatedExpenses',
        'specialExpenses',
        'extraordinaryBurdens',
        'craftsmenServices',
        'businessExpenses',
        'signature'
      ];
      
      if (!validSections.includes(sectionName)) {
        throw new BadRequestException(`Invalid section name: ${sectionName}`);
      }

      // Create update data with only the specified section
      const updateData: any = {
        [sectionName]: sectionData,
        lastSavedAt: new Date(),
      };
      
      // Update currentStep if provided
      if (currentStep !== undefined) {
        updateData.currentStep = currentStep;
      }

      // Log the activity
      await this.prisma.formActivity.create({
        data: {
          taxFormId: id,
          userId: existingTaxForm.userId,
          action: 'saved',
          sectionName,
          details: { updatedFields: Object.keys(sectionData) },
        },
      });

      // Update the form with just the section data
      return this.prisma.taxForm.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error saving form section:', error);
      throw new BadRequestException('Could not save form section: ' + error.message);
    }
  }

  async submitForm(id: string) {
    try {
      const existingTaxForm = await this.prisma.taxForm.findUnique({
        where: { id },
      });

      if (!existingTaxForm) {
        throw new NotFoundException(`Tax form with ID ${id} not found`);
      }

      // Check if form is complete - require signature at minimum
      if (!existingTaxForm.signature) {
        throw new BadRequestException('Cannot submit form without signature');
      }

      // Update form status and submitted date
      const updatedForm = await this.prisma.taxForm.update({
        where: { id },
        data: {
          status: TaxFormStatus.SUBMITTED,
          submittedAt: new Date(),
          lastSavedAt: new Date(),
        },
        include: {
          documents: true,
        },
      });

      // Log the activity
      await this.prisma.formActivity.create({
        data: {
          taxFormId: id,
          userId: existingTaxForm.userId,
          action: 'submitted',
          details: { submittedAt: updatedForm.submittedAt },
        },
      });

      return updatedForm;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error submitting form:', error);
      throw new BadRequestException('Could not submit form: ' + error.message);
    }
  }

  async addDocument(createDocumentDto: CreateDocumentDto) {
    try {
      // Check if the tax form exists
      const existingTaxForm = await this.prisma.taxForm.findUnique({
        where: { id: createDocumentDto.taxFormId },
      });

      if (!existingTaxForm) {
        throw new NotFoundException(`Tax form with ID ${createDocumentDto.taxFormId} not found`);
      }

      // Create the document
      const document = await this.prisma.document.create({
        data: {
          ...createDocumentDto,
          uploadStatus: 'success', // Assume upload succeeded since we already have the URL
        },
      });

      // Log the activity
      await this.prisma.formActivity.create({
        data: {
          taxFormId: createDocumentDto.taxFormId,
          userId: existingTaxForm.userId,
          action: 'uploaded_document',
          sectionName: createDocumentDto.section,
          details: { 
            fileName: createDocumentDto.originalFilename,
            fieldName: createDocumentDto.fieldName,
            fileType: createDocumentDto.fileType,
            fileSize: createDocumentDto.fileSize,
          },
        },
      });

      return document;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error adding document:', error);
      throw new BadRequestException('Could not add document: ' + error.message);
    }
  }

  async remove(id: string) {
    try {
      const existingTaxForm = await this.prisma.taxForm.findUnique({
        where: { id },
      });

      if (!existingTaxForm) {
        throw new NotFoundException(`Tax form with ID ${id} not found`);
      }

      // Delete related documents and activity logs first (if cascade doesn't work)
      await this.prisma.document.deleteMany({
        where: { taxFormId: id },
      });
      
      await this.prisma.formActivity.deleteMany({
        where: { taxFormId: id },
      });

      // Then delete the form
      await this.prisma.taxForm.delete({
        where: { id },
      });

      return { message: 'Tax form deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error deleting tax form:', error);
      throw new BadRequestException('Could not delete tax form: ' + error.message);
    }
  }

  // Add this method to find by application ID
  async findByApplicationId(applicationId: string) {
    const taxForm = await this.prisma.taxForm.findUnique({
      where: { applicationId },
      include: {
        documents: true,
      },
    });

    if (!taxForm) {
      throw new NotFoundException(`Tax form with application ID ${applicationId} not found`);
    }

    return taxForm;
  }

  // Helper method to generate application ID
  private generateApplicationId(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
} 