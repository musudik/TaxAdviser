import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsEnum, IsObject, IsArray, IsDateString } from 'class-validator';

export enum TaxReturnStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  REJECTED = 'rejected'
}

export class CreateTaxReturnDto {
  @IsNotEmpty()
  @IsString()
  clientId: string;

  @IsNotEmpty()
  @IsString()
  partnerId: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsEnum(TaxReturnStatus)
  status?: TaxReturnStatus;

  @IsNotEmpty()
  @IsObject()
  personalInfo: any;

  @IsOptional()
  @IsArray()
  children?: any[];

  @IsNotEmpty()
  @IsObject()
  incomeInfo: any;

  @IsNotEmpty()
  @IsObject()
  deductions: any;

  @IsNotEmpty()
  @IsObject()
  taxCredits: any;

  @IsOptional()
  @IsObject()
  signature?: any;

  @IsOptional()
  @IsDateString()
  submittedAt?: string;

  [key: string]: any;
}

export class UpdateTaxReturnDto {
  @IsOptional()
  @IsString()
  clientId?: string;

  @IsOptional()
  @IsString()
  partnerId?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsEnum(TaxReturnStatus)
  status?: TaxReturnStatus;

  @IsOptional()
  @IsObject()
  personalInfo?: any;

  @IsOptional()
  @IsArray()
  children?: any[];

  @IsOptional()
  @IsObject()
  incomeInfo?: any;

  @IsOptional()
  @IsObject()
  deductions?: any;

  @IsOptional()
  @IsObject()
  taxCredits?: any;

  @IsOptional()
  @IsObject()
  signature?: any;

  @IsOptional()
  @IsDateString()
  submittedAt?: string;

  [key: string]: any;
} 