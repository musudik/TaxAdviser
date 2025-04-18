import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsEnum, IsObject, IsArray, IsDateString, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export enum TaxReturnStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  REJECTED = 'rejected'
}

// Address DTO
export class AddressDto {
  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  houseNumber: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @IsString()
  @IsNotEmpty()
  city: string;
}

// Spouse DTO
export class SpouseDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @IsString()
  @IsOptional()
  taxId?: string;

  @IsBoolean()
  @IsOptional()
  hasIncome?: boolean;

  @IsString()
  @IsOptional()
  incomeType?: string;

  @IsBoolean()
  @IsOptional()
  jointTaxation?: boolean;
}

// Child DTO
export class ChildDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;

  @IsString()
  @IsOptional()
  taxId?: string;
}

// Foreign Residence DTO
export class ForeignResidenceDto {
  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsOptional()
  otherCountry?: string;
}

// Personal Info DTO
export class PersonalInfoDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsString()
  @IsNotEmpty()
  taxId: string;

  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;

  @IsString()
  @IsNotEmpty()
  maritalStatus: string;

  @IsBoolean()
  @IsOptional()
  hasSpouse?: boolean;

  @IsObject()
  @ValidateNested()
  @Type(() => SpouseDto)
  @IsOptional()
  spouse?: SpouseDto;

  @IsBoolean()
  @IsOptional()
  hasForeignResidence?: boolean;

  @IsObject()
  @ValidateNested()
  @Type(() => ForeignResidenceDto)
  @IsOptional()
  foreignResidence?: ForeignResidenceDto;

  @IsBoolean()
  @IsOptional()
  hasChildren?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChildDto)
  @IsOptional()
  children?: ChildDto[];
}

// Expense Item DTO (for nested expense objects)
export class ExpenseItemDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  amount: string;

  @IsArray()
  @IsOptional()
  file?: any[];
}

// Signature DTO
export class SignatureDto {
  @IsString()
  @IsOptional()
  place?: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsOptional()
  signature?: string;

  @IsBoolean()
  @IsOptional()
  confirmSignature?: boolean;
}

// Tax Year DTO
export class TaxYearDto {
  @IsString()
  @IsNotEmpty()
  year: string;
}

// Create Tax Return DTO
export class CreateTaxReturnDto {
  @IsObject()
  @ValidateNested()
  @Type(() => TaxYearDto)
  @IsNotEmpty()
  taxYear: TaxYearDto;

  @IsObject()
  @ValidateNested()
  @Type(() => PersonalInfoDto)
  @IsNotEmpty()
  personalInfo: PersonalInfoDto;

  @IsObject()
  @IsNotEmpty()
  incomeInfo: any;

  @IsObject()
  @IsNotEmpty()
  expenses: any;

  @IsObject()
  @IsOptional()
  businessInfo?: any;

  @IsObject()
  @ValidateNested()
  @Type(() => SignatureDto)
  @IsOptional()
  signature?: SignatureDto;

  @IsOptional()
  @IsEnum(TaxReturnStatus)
  status?: TaxReturnStatus;

  @IsOptional()
  @IsDateString()
  submittedAt?: string;

  // Additional fields for client identification
  @IsString()
  @IsOptional()
  clientId?: string;

  @IsString()
  @IsOptional()
  partnerId?: string;

  @IsString()
  @IsOptional()
  applicationId?: string;
}

// Update Tax Return DTO
export class UpdateTaxReturnDto {
  @IsObject()
  @ValidateNested()
  @Type(() => TaxYearDto)
  @IsOptional()
  taxYear?: TaxYearDto;

  @IsObject()
  @ValidateNested()
  @Type(() => PersonalInfoDto)
  @IsOptional()
  personalInfo?: PersonalInfoDto;

  @IsObject()
  @IsOptional()
  incomeInfo?: any;

  @IsObject()
  @IsOptional()
  expenses?: any;

  @IsObject()
  @IsOptional()
  businessInfo?: any;

  @IsObject()
  @ValidateNested()
  @Type(() => SignatureDto)
  @IsOptional()
  signature?: SignatureDto;

  @IsOptional()
  @IsEnum(TaxReturnStatus)
  status?: TaxReturnStatus;

  @IsOptional()
  @IsDateString()
  submittedAt?: string;

  // Additional fields for client identification
  @IsString()
  @IsOptional()
  clientId?: string;

  @IsString()
  @IsOptional()
  partnerId?: string;

  @IsString()
  @IsOptional()
  applicationId?: string;
}

// Response DTO
export class TaxReturnResponseDto extends CreateTaxReturnDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsDateString()
  @IsNotEmpty()
  createdAt: string;

  @IsDateString()
  @IsNotEmpty()
  updatedAt: string;

  // Helper properties for easy indexing/searching
  @IsString()
  get firstName(): string {
    return this.personalInfo?.firstName || '';
  }

  @IsString()
  get lastName(): string {
    return this.personalInfo?.lastName || '';
  }

  @IsString()
  get yearOfSubmission(): string {
    return this.taxYear?.year || '';
  }
} 