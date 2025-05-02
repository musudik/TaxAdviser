// TaxForm Data Transfer Object (DTO) interfaces

// Base interface for any JSON section
export interface JsonSection {
  [key: string]: any;
}

// SignatureSection - Define structure for the signature object
export interface SignatureSection extends JsonSection {
  place?: string;
  date?: string;
  fullName?: string;
  signature?: string;
  confirmSignature?: boolean;
  placeAndDate?: JsonSection;
}

// ExpensesSection - Define structure for the expenses object
export interface ExpensesSection extends JsonSection {
  workRelatedExpenses?: JsonSection;
  specialExpenses?: JsonSection;
  extraordinaryBurdens?: JsonSection;
  craftsmenServices?: JsonSection;
}

// CreateTaxFormDto - Used when creating a new tax form
export interface CreateTaxFormDto {
  applicationId: string;
  userId?: string;
  currentStep?: number;
  personalInfo?: JsonSection;
  incomeInfo?: JsonSection;
  rentalIncome?: JsonSection;
  foreignIncome?: JsonSection;
  expenses?: ExpensesSection;
  workRelatedExpenses?: JsonSection;
  specialExpenses?: JsonSection;
  extraordinaryBurdens?: JsonSection;
  craftsmenServices?: JsonSection;
  businessExpenses?: JsonSection;
  businessInfo?: JsonSection;
  taxYear?: JsonSection;
  signature?: SignatureSection;
  language?: string;
}

// UpdateTaxFormDto - Used when updating an existing tax form
export interface UpdateTaxFormDto {
  applicationId?: string;
  userId?: string;
  currentStep?: number;
  status?: string;
  personalInfo?: JsonSection;
  incomeInfo?: JsonSection;
  rentalIncome?: JsonSection;
  foreignIncome?: JsonSection;
  expenses?: ExpensesSection;
  workRelatedExpenses?: JsonSection;
  specialExpenses?: JsonSection;
  extraordinaryBurdens?: JsonSection;
  craftsmenServices?: JsonSection;
  businessExpenses?: JsonSection;
  businessInfo?: JsonSection;
  taxYear?: JsonSection;
  signature?: SignatureSection;
  language?: string;
  submittedAt?: Date;
}

// TaxFormResponse - Used for API responses
export interface TaxFormResponse {
  id: string;
  applicationId: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  currentStep: number;
  status: string;
  personalInfo?: JsonSection;
  incomeInfo?: JsonSection;
  rentalIncome?: JsonSection;
  foreignIncome?: JsonSection;
  expenses?: ExpensesSection;
  workRelatedExpenses?: JsonSection;
  specialExpenses?: JsonSection;
  extraordinaryBurdens?: JsonSection;
  craftsmenServices?: JsonSection;
  businessExpenses?: JsonSection;
  businessInfo?: JsonSection;
  taxYear?: JsonSection;
  signature?: SignatureSection;
  placeAndDate?: JsonSection; // Keep for backwards compatibility with frontend
  language: string;
  submittedAt?: Date;
  // Fields extracted for easier searching/filtering
  firstName?: string;
  lastName?: string;
  submissionYear?: string;
} 