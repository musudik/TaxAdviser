export interface Address {
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
  }
  
  export interface PersonalInfo {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    taxId: string;
    email: string;
    phone: string;
    maritalStatus: string;
    address: Address;
    hasForeignResidence: boolean;
    foreignResidenceCountry: string;
    otherForeignResidenceCountry: string;
    foreignAddress?: string;
    hasSpouse: boolean;
    spouseFirstName: string;
    spouseLastName: string;
    spouseDateOfBirth: string;
    spouseTaxId: string;
    spouseHasIncome: boolean;
    spouseIncomeType: string;
    hasChildren: boolean;
    childrenCount: number;
    children: Child[];
  }
  
  // Employment Income Step
  export interface EmploymentInfo {
    isEmployed: boolean | undefined;
    employer: string;
    employmentIncome: number | null;
    grossAnnualSalary: number | null;
    hasTaxCertificate: boolean | undefined;
    taxCertificateFile: string;
    hasTravelSubsidy: boolean | undefined;
    travelDistance?: number | null;
  }
  
  // Business Income Step
  export interface BusinessInfo {
    isBusinessOwner: boolean | undefined;
    businessType: string;
    businessEarnings: number | null;
    businessExpenses: number | null;
  }
  
  // Investments Step
  export interface InvestmentInfo {
    hasStockIncome: boolean | undefined;
    dividendEarnings: number | null;
    hasBankCertificate: boolean | undefined;
    bankCertificateFile: string;
    hasStockSales: boolean | undefined;
    stockProfitLoss: boolean | undefined;
    hasForeignStocks: boolean | undefined;
    foreignTaxPaid: number | null;
    foreignTaxCertificateFile: string;
  }
  
  // Rental Income Step
  export interface RentalInfo {
    hasRentalProperty: boolean | undefined;
    rentalIncome: number | null;
    rentalCosts: number | null;
    rentalPropertyAddress: Address;
  }
  
  // Foreign Income Step
  export interface ForeignIncomeInfo {
    hasForeignIncome: boolean | undefined;
    foreignIncomeCountry: string;
    foreignIncomeType: string;
    foreignIncomeAmount: number | null;
    foreignIncomeTaxPaid: number | null;
    foreignIncomeTaxCertificateFile: string;
  }
  
  // Main IncomeInfo that combines all income related interfaces
  export interface IncomeInfo extends 
    EmploymentInfo, 
    BusinessInfo, 
    InvestmentInfo, 
    RentalInfo, 
    ForeignIncomeInfo {
  }
  
  export interface Expenses {
    commutingExpenses: number;
    businessTripsCosts: number;
    workEquipment: number;
    homeOfficeAllowance: number;
    membershipFees: number;
    applicationCosts: number;
    doubleHouseholdCosts: number;
    churchTax: number;
    donationsAndFees: number;
    childcareCosts: number;
    supportPayments: number;
    privateSchoolFees: number;
    retirementProvisions: number;
    otherInsuranceExpenses: number;
    professionalTrainingCosts: number;
    medicalExpenses: number;
    rehabilitationCosts: number;
    careCosts: number;
    disabilityExpenses: number;
    funeralCosts: number;
    relativesSupportCosts: number;
    divorceCosts: number;
    statutoryHealthInsurance: number;
    privateHealthInsurance: number;
    statutoryPensionInsurance: number;
    privatePensionInsurance: number;
    unemploymentInsurance: number;
    accidentLiabilityInsurance: number;
    disabilityInsurance: number;
    termLifeInsurance: number;
    householdServices: number;
    craftsmenServices: number;
    gardeningServices: number;
    cleaningServices: number;
    caretakerServices: number;
    householdCareCosts: number;
    householdSupportServices: number;
    chimneySweepFees: number;
    emergencySystemCosts: number;
    hasCraftsmenPayments: boolean | undefined;
    craftsmenAmount: number | null;
    craftsmenInvoiceFile: string;
    hasMaintenancePayments: boolean | undefined;
    maintenanceRecipient: string;
    maintenanceAmount: number | null;
    recipientsAbroad: boolean | undefined;
    hasSpecialExpensesDetailed: boolean | undefined;
    specialExpensesType: string;
    specialExpensesAmount: number | null;
    hasPrivateInsurance: boolean | undefined;
    insuranceTypes: string;
    insuranceContributions: number | null;
  }
  
  export interface TaxCredits {
    childrenAllowance: number | null;
    homeOfficeDeduction: number | null;
    donationsCharity: number | null;
  }
  
  interface SignatureData {
    place: string;
    date: string;
    signature: string;
  }
  
  export interface TaxFormData {
    id: string;
    status: 'draft' | 'submitted' | 'approved' | 'rejected';
    createdAt: string;
    updatedAt: string;
    submittedAt: string | null;
    personalInfo: PersonalInfo;
    incomeInfo: IncomeInfo;
    expenses: Expenses;
    taxCredits: TaxCredits;
    signature: SignatureData | null;
  }
  
  export interface Child {
    id?: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    taxId: string;
  }
  
  // Initial form data with empty values
  export const initialTaxFormData: TaxFormData = {
    id: '',
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    submittedAt: null,
    personalInfo: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      taxId: '',
      email: '',
      phone: '',
      maritalStatus: '',
      address: {
        street: '',
        houseNumber: '',
        postalCode: '',
        city: ''
      },
      hasForeignResidence: false,
      foreignResidenceCountry: '',
      otherForeignResidenceCountry: '',
      foreignAddress: '',
      hasSpouse: false,
      spouseFirstName: '',
      spouseLastName: '',
      spouseDateOfBirth: '',
      spouseTaxId: '',
      spouseHasIncome: false,
      spouseIncomeType: '',
      hasChildren: false,
      childrenCount: 0,
      children: []
    },
    incomeInfo: {
      // Employment Info
      isEmployed: undefined,
      employer: '',
      employmentIncome: null,
      grossAnnualSalary: null,
      hasTaxCertificate: undefined,
      taxCertificateFile: '',
      hasTravelSubsidy: undefined,
      travelDistance: null,
      
      // Business Info
      isBusinessOwner: undefined,
      businessType: '',
      businessEarnings: null,
      businessExpenses: null,
      
      // Investment Info
      hasStockIncome: undefined,
      dividendEarnings: null,
      hasBankCertificate: undefined,
      bankCertificateFile: '',
      hasStockSales: undefined,
      stockProfitLoss: undefined,
      hasForeignStocks: undefined,
      foreignTaxPaid: null,
      foreignTaxCertificateFile: '',
      
      // Rental Info
      hasRentalProperty: undefined,
      rentalIncome: null,
      rentalCosts: null,
      rentalPropertyAddress: {
        street: '',
        houseNumber: '',
        postalCode: '',
        city: ''
      },
      
      // Foreign Income Info
      hasForeignIncome: undefined,
      foreignIncomeCountry: '',
      foreignIncomeType: '',
      foreignIncomeAmount: null,
      foreignIncomeTaxPaid: null,
      foreignIncomeTaxCertificateFile: ''
    },
    expenses: {
      commutingExpenses: 0,
      businessTripsCosts: 0,
      workEquipment: 0,
      homeOfficeAllowance: 0,
      membershipFees: 0,
      applicationCosts: 0,
      doubleHouseholdCosts: 0,
      churchTax: 0,
      donationsAndFees: 0,
      childcareCosts: 0,
      supportPayments: 0,
      privateSchoolFees: 0,
      retirementProvisions: 0,
      otherInsuranceExpenses: 0,
      professionalTrainingCosts: 0,
      medicalExpenses: 0,
      rehabilitationCosts: 0,
      careCosts: 0,
      disabilityExpenses: 0,
      funeralCosts: 0,
      relativesSupportCosts: 0,
      divorceCosts: 0,
      statutoryHealthInsurance: 0,
      privateHealthInsurance: 0,
      statutoryPensionInsurance: 0,
      privatePensionInsurance: 0,
      unemploymentInsurance: 0,
      accidentLiabilityInsurance: 0,
      disabilityInsurance: 0,
      termLifeInsurance: 0,
      householdServices: 0,
      craftsmenServices: 0,
      gardeningServices: 0,
      cleaningServices: 0,
      caretakerServices: 0,
      householdCareCosts: 0,
      householdSupportServices: 0,
      chimneySweepFees: 0,
      emergencySystemCosts: 0,
      hasCraftsmenPayments: undefined,
      craftsmenAmount: null,
      craftsmenInvoiceFile: '',
      hasMaintenancePayments: undefined,
      maintenanceRecipient: '',
      maintenanceAmount: null,
      recipientsAbroad: undefined,
      hasSpecialExpensesDetailed: undefined,
      specialExpensesType: '',
      specialExpensesAmount: null,
      hasPrivateInsurance: undefined,
      insuranceTypes: '',
      insuranceContributions: null
    },
    taxCredits: {
      childrenAllowance: null,
      homeOfficeDeduction: null,
      donationsCharity: null
    },
    signature: null
  };