import { IsNotEmpty, IsOptional, IsString, IsNumber, IsEnum, IsObject, IsInt, IsArray, IsDateString, Min, Max } from 'class-validator';

export enum TaxFormStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  SUBMITTED = 'submitted',
  PROCESSING = 'processing'
}

export class CreateTaxFormDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsInt()
  @Min(2000)
  @Max(2100)
  taxYear: number;

  @IsOptional()
  @IsEnum(TaxFormStatus)
  status?: TaxFormStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  currentStep?: number;

  @IsOptional()
  @IsString()
  applicationId?: string;

  @IsOptional()
  @IsObject()
  personalInfo?: Record<string, any>;

  @IsOptional()
  @IsObject()
  incomeInfo?: Record<string, any>;

  @IsOptional()
  @IsObject()
  rentalIncome?: Record<string, any>;

  @IsOptional()
  @IsObject()
  foreignIncome?: Record<string, any>;

  @IsOptional()
  @IsObject()
  workRelatedExpenses?: Record<string, any>;

  @IsOptional()
  @IsObject()
  specialExpenses?: Record<string, any>;

  @IsOptional()
  @IsObject()
  extraordinaryBurdens?: Record<string, any>;

  @IsOptional()
  @IsObject()
  craftsmenServices?: Record<string, any>;

  @IsOptional()
  @IsObject()
  businessExpenses?: Record<string, any>;

  @IsOptional()
  @IsObject()
  signature?: Record<string, any>;

  @IsOptional()
  @IsDateString()
  submittedAt?: string;
}

export class UpdateTaxFormDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsInt()
  @Min(2000)
  @Max(2100)
  taxYear?: number;

  @IsOptional()
  @IsEnum(TaxFormStatus)
  status?: TaxFormStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  currentStep?: number;

  @IsOptional()
  @IsString()
  applicationId?: string;

  @IsOptional()
  @IsObject()
  personalInfo?: Record<string, any>;

  @IsOptional()
  @IsObject()
  incomeInfo?: Record<string, any>;

  @IsOptional()
  @IsObject()
  rentalIncome?: Record<string, any>;

  @IsOptional()
  @IsObject()
  foreignIncome?: Record<string, any>;

  @IsOptional()
  @IsObject()
  workRelatedExpenses?: Record<string, any>;

  @IsOptional()
  @IsObject()
  specialExpenses?: Record<string, any>;

  @IsOptional()
  @IsObject()
  extraordinaryBurdens?: Record<string, any>;

  @IsOptional()
  @IsObject()
  craftsmenServices?: Record<string, any>;

  @IsOptional()
  @IsObject()
  businessExpenses?: Record<string, any>;

  @IsOptional()
  @IsObject()
  signature?: Record<string, any>;

  @IsOptional()
  @IsDateString()
  submittedAt?: string;

  @IsOptional()
  @IsDateString()
  lastSavedAt?: string;
}

// DTO for saving the current state of a specific form section
export class SaveFormSectionDto {
  @IsNotEmpty()
  @IsString()
  sectionName: string;

  @IsNotEmpty()
  @IsObject()
  sectionData: Record<string, any>;

  @IsOptional()
  @IsInt()
  currentStep?: number;

  @IsOptional()
  @IsString()
  applicationId?: string;
}

// DTO for document uploads
export class CreateDocumentDto {
  @IsNotEmpty()
  @IsString()
  taxFormId: string;

  @IsNotEmpty()
  @IsString()
  section: string;

  @IsOptional()
  @IsString()
  subsection?: string;

  @IsNotEmpty()
  @IsString()
  fieldName: string;

  @IsNotEmpty()
  @IsString()
  originalFilename: string;

  @IsNotEmpty()
  @IsString()
  storageUrl: string;

  @IsOptional()
  @IsString()
  downloadUrl?: string;

  @IsNotEmpty()
  @IsString()
  fileType: string;

  @IsNotEmpty()
  @IsNumber()
  fileSize: number;
} 