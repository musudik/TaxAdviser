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
      // Extract expenses from the DTO if present
      const expenses = createTaxFormDto.expenses || {};

      // Create object with only valid fields for the schema
      const taxFormData: any = {
        applicationId: createTaxFormDto.applicationId || `TAX-${Date.now()}`,
        userId: createTaxFormDto.userId,
        currentStep: createTaxFormDto.currentStep || 0,
        personalInfo: createTaxFormDto.personalInfo || {},
        incomeInfo: createTaxFormDto.incomeInfo || {},
        rentalIncome: createTaxFormDto.rentalIncome || {},
        foreignIncome: createTaxFormDto.foreignIncome || {},
        // Use expenses object if specific expense types aren't directly provided
        workRelatedExpenses: createTaxFormDto.workRelatedExpenses || expenses.workRelatedExpenses || {},
        specialExpenses: createTaxFormDto.specialExpenses || expenses.specialExpenses || {},
        extraordinaryBurdens: createTaxFormDto.extraordinaryBurdens || expenses.extraordinaryBurdens || {},
        craftsmenServices: createTaxFormDto.craftsmenServices || expenses.craftsmenServices || {},
        businessExpenses: createTaxFormDto.businessExpenses || {},
        signature: createTaxFormDto.signature || {},
        language: createTaxFormDto.language || 'en',
      };

      // Log the data for debugging
      console.log('Tax form data being saved:', JSON.stringify(taxFormData, null, 2));

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
    try {
      // Extract expenses from the DTO if present
      const expenses = updateTaxFormDto.expenses || {};
      
      // Prepare update data
      const updateData: any = { 
        ...updateTaxFormDto,
        // Handle expense fields from nested expenses object if present
        workRelatedExpenses: updateTaxFormDto.workRelatedExpenses || expenses.workRelatedExpenses,
        specialExpenses: updateTaxFormDto.specialExpenses || expenses.specialExpenses,
        extraordinaryBurdens: updateTaxFormDto.extraordinaryBurdens || expenses.extraordinaryBurdens,
        craftsmenServices: updateTaxFormDto.craftsmenServices || expenses.craftsmenServices,
      };
      
      // Remove the expenses field as it's not in the database schema
      if (updateData.expenses) {
        delete updateData.expenses;
      }
      
      // Log the data for debugging
      console.log('Tax form data being updated:', JSON.stringify(updateData, null, 2));
      
      const result = await this.prisma.taxForm.update({
        where: { id },
        data: updateData,
      });
      
      return this.mapToTaxFormResponse(result);
    } catch (error) {
      console.error("Error updating tax form:", error);
      throw error;
    }
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
    
    // Reconstruct the expenses object for the response
    const expenses = {
      workRelatedExpenses: data.workRelatedExpenses || {},
      specialExpenses: data.specialExpenses || {},
      extraordinaryBurdens: data.extraordinaryBurdens || {},
      craftsmenServices: data.craftsmenServices || {},
    };
    
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
      expenses: expenses as JsonSection, // Add the reconstructed expenses object
      signature: data.signature as SignatureSection,
      placeAndDate: placeAndDate as JsonSection,
      language: data.language || 'en',
      submittedAt: data.submittedAt,
      businessInfo: data.businessInfo || {},
      taxYear: data.taxYear || {},
    };
  }
} 