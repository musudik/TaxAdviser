import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaxFormDto, UpdateTaxFormDto, TaxFormResponse, JsonSection, SignatureSection } from './dto/tax-form.dto';
import { TaxForm } from '@prisma/client';

@Injectable()
export class TaxFormService {
  constructor(private prisma: PrismaService) {}

  // Create a new tax form
  async create(createTaxFormDto: CreateTaxFormDto): Promise<TaxFormResponse> {
    try {
      // Create object with only valid fields for the schema
      const taxFormData: any = {
        applicationId: createTaxFormDto.applicationId,
        userId: createTaxFormDto.userId,
        currentStep: createTaxFormDto.currentStep || 0,
        personalInfo: createTaxFormDto.personalInfo || {},
        incomeInfo: createTaxFormDto.incomeInfo || {},
        rentalIncome: createTaxFormDto.rentalIncome || {},
        foreignIncome: createTaxFormDto.foreignIncome || {},
        workRelatedExpenses: createTaxFormDto.workRelatedExpenses || {},
        specialExpenses: createTaxFormDto.specialExpenses || {},
        extraordinaryBurdens: createTaxFormDto.extraordinaryBurdens || {},
        craftsmenServices: createTaxFormDto.craftsmenServices || {},
        businessExpenses: createTaxFormDto.businessExpenses || {},
        signature: createTaxFormDto.signature || {},
        language: createTaxFormDto.language || 'en',
      };

      const result = await this.prisma.taxForm.create({
        data: taxFormData
      });

      // Map to TaxFormResponse type
      return this.mapToTaxFormResponse(result);
    } catch (error) {
      console.error("Error creating tax form:", error);
      throw error;
    }
  }

  // Find all tax forms
  async findAll(): Promise<TaxFormResponse[]> {
    const results = await this.prisma.taxForm.findMany();
    return results.map(this.mapToTaxFormResponse);
  }

  // Find tax form by ID
  async findOne(id: string): Promise<TaxFormResponse> {
    const result = await this.prisma.taxForm.findUnique({
      where: { id },
    });
    if (!result) return null;
    return this.mapToTaxFormResponse(result);
  }

  // Find tax form by application ID
  async findByApplicationId(applicationId: string): Promise<TaxFormResponse> {
    const result = await this.prisma.taxForm.findUnique({
      where: { applicationId },
    });
    if (!result) return null;
    return this.mapToTaxFormResponse(result);
  }

  // Find tax forms by user ID
  async findByUserId(userId: string): Promise<TaxFormResponse[]> {
    const results = await this.prisma.taxForm.findMany({
      where: { userId },
    });
    return results.map(this.mapToTaxFormResponse);
  }

  // Update a tax form
  async update(id: string, updateTaxFormDto: UpdateTaxFormDto): Promise<TaxFormResponse> {
    // Filter out properties that might not exist in the schema
    const updateData: any = { ...updateTaxFormDto };
    
    const result = await this.prisma.taxForm.update({
      where: { id },
      data: updateData,
    });
    
    return this.mapToTaxFormResponse(result);
  }

  // Remove a tax form
  async remove(id: string): Promise<TaxFormResponse> {
    const result = await this.prisma.taxForm.delete({
      where: { id },
    });
    return this.mapToTaxFormResponse(result);
  }

  // Submit a tax form
  async submit(id: string): Promise<TaxFormResponse> {
    const result = await this.prisma.taxForm.update({
      where: { id },
      data: {
        status: 'submitted',
        submittedAt: new Date(),
      },
    });
    return this.mapToTaxFormResponse(result);
  }

  // Helper method to map Prisma result to TaxFormResponse
  private mapToTaxFormResponse(data: any): TaxFormResponse {
    const signature = data.signature || {};
    const placeAndDate = signature.placeAndDate || {};
    
    return {
      id: data.id,
      applicationId: data.applicationId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      userId: data.userId,
      currentStep: data.currentStep,
      status: data.status,
      personalInfo: data.personalInfo as JsonSection,
      incomeInfo: data.incomeInfo as JsonSection,
      rentalIncome: data.rentalIncome as JsonSection,
      foreignIncome: data.foreignIncome as JsonSection,
      workRelatedExpenses: data.workRelatedExpenses as JsonSection,
      specialExpenses: data.specialExpenses as JsonSection,
      extraordinaryBurdens: data.extraordinaryBurdens as JsonSection,
      craftsmenServices: data.craftsmenServices as JsonSection,
      businessExpenses: data.businessExpenses as JsonSection,
      signature: data.signature as SignatureSection,
      placeAndDate: placeAndDate as JsonSection,
      language: data.language || 'en',
      submittedAt: data.submittedAt,
    };
  }
} 