import { TaxFormData, Address } from './taxTypes';

// Define the ValidationErrors type
export type ValidationErrors = Record<string, any>;

// Helper function to validate a required field
const validateRequiredField = (obj: any, field: string): boolean => {
  return obj[field] !== undefined && obj[field] !== null;
};

// Helper function to set a nested error
const setNestedError = (errors: ValidationErrors, section: string, field: string, message: string) => {
  if (!errors[section]) errors[section] = {};
  errors[section][field] = message;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  // Accepts formats: +49123456789, 0123456789, +49 123 456 789, etc.
  const phoneRegex = /^(\+?\d{1,3}[\s-]?)?\d{3,}[\s-]?\d{3,}[\s-]?\d{3,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const isValidDate = (date: string): boolean => {
  if (!date) return false;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

export const isValidTaxId = (taxId: string): boolean => {
  // German tax ID is typically 11 digits
  const taxIdRegex = /^\d{11}$/;
  return taxIdRegex.test(taxId.replace(/\s/g, ''));
};

export const isValidPostalCode = (postalCode: string): boolean => {
  // German postal code is 5 digits
  const postalCodeRegex = /^\d{5}$/;
  return postalCodeRegex.test(postalCode.replace(/\s/g, ''));
};

export const validateAddress = (address?: Address) => {
  if (!address) return {
    street: true,
    houseNumber: true,
    postalCode: true,
    city: true
  };
  
  return {
    street: !address.street?.trim(),
    houseNumber: !address.houseNumber?.trim(),
    postalCode: !isValidPostalCode(address.postalCode || ''),
    city: !address.city?.trim()
  };
};

export const validatePersonalInfo = (personalInfo: TaxFormData['personalInfo']) => {
  const errors: Record<string, any> = {};
  
  // Required fields with error messages
  errors.firstName = !personalInfo.firstName?.trim() ? 'Dieses Feld ist erforderlich / This field is required' : false;
  errors.lastName = !personalInfo.lastName?.trim() ? 'Dieses Feld ist erforderlich / This field is required' : false;
  errors.taxId = !isValidTaxId(personalInfo.taxId || '') ? 'Bitte geben Sie eine gültige Steuer-ID ein / Please enter a valid tax ID' : false;
  errors.dateOfBirth = !isValidDate(personalInfo.dateOfBirth || '') ? 'Bitte geben Sie ein gültiges Datum ein / Please enter a valid date' : false;
  errors.maritalStatus = !personalInfo.maritalStatus?.trim() ? 'Bitte wählen Sie einen Familienstand aus / Please select a marital status' : false;
  
  // Clean up false values for cleaner objects
  Object.keys(errors).forEach(key => {
    if (errors[key] === false) {
      delete errors[key];
    }
  });
  
  // Address validation - with error messages
  const addressErrors: Record<string, string | boolean> = {
    street: !personalInfo.address?.street?.trim() ? 'Dieses Feld ist erforderlich / This field is required' : false,
    houseNumber: !personalInfo.address?.houseNumber?.trim() ? 'Dieses Feld ist erforderlich / This field is required' : false,
    postalCode: !isValidPostalCode(personalInfo.address?.postalCode || '') ? 'Bitte geben Sie eine gültige Postleitzahl ein / Please enter a valid postal code' : false,
    city: !personalInfo.address?.city?.trim() ? 'Dieses Feld ist erforderlich / This field is required' : false
  };
  
  // Clean up false values
  Object.keys(addressErrors).forEach(key => {
    if (addressErrors[key] === false) {
      delete addressErrors[key];
    }
  });
  
  // Only add address errors if any field has an error
  if (Object.keys(addressErrors).length > 0) {
    errors.address = addressErrors;
  }
  
  // Foreign residence validation (if checked)
  if (personalInfo.hasForeignResidence === true) {
    errors.foreignResidenceCountry = !personalInfo.foreignResidenceCountry?.trim() ? 
      'Bitte wählen Sie ein Land aus / Please select a country' : false;
    
    // If "other" is selected, validate the other country field
    if (personalInfo.foreignResidenceCountry === 'other') {
      errors.otherForeignResidenceCountry = !personalInfo.otherForeignResidenceCountry?.trim() ?
        'Bitte geben Sie ein Land ein / Please enter a country' : false;
    }
    
    // Clean up false values
    if (errors.foreignResidenceCountry === false) delete errors.foreignResidenceCountry;
    if (errors.otherForeignResidenceCountry === false) delete errors.otherForeignResidenceCountry;
  }
  
  // Spouse validation (if checked)
  if (personalInfo.maritalStatus === 'married') {
    errors.spouseFirstName = !personalInfo.spouseFirstName?.trim() ? 
      'Dieses Feld ist erforderlich / This field is required' : false;
    errors.spouseLastName = !personalInfo.spouseLastName?.trim() ? 
      'Dieses Feld ist erforderlich / This field is required' : false;
    errors.spouseDateOfBirth = !isValidDate(personalInfo.spouseDateOfBirth || '') ? 
      'Bitte geben Sie ein gültiges Datum ein / Please enter a valid date' : false;
    errors.spouseTaxId = !isValidTaxId(personalInfo.spouseTaxId || '') ? 
      'Bitte geben Sie eine gültige Steuer-ID ein / Please enter a valid tax ID' : false;
    
    // If spouse has income, validate income type
    if (personalInfo.spouseHasIncome === true) {
      errors.spouseIncomeType = !personalInfo.spouseIncomeType?.trim() ? 
        'Bitte wählen Sie eine Einkommensart aus / Please select an income type' : false;
    }
    
    // Clean up false values
    Object.keys(errors).forEach(key => {
      if (key.startsWith('spouse') && errors[key] === false) {
        delete errors[key];
      }
    });
  }
  
  // Validate children if applicable - only when hasChildren is explicitly true
  if (personalInfo.hasChildren === true) {
    if (!personalInfo.children || personalInfo.children.length === 0) {
      // If no children are added but hasChildren is true, add an error
      errors.children = [{ 
        firstName: 'Dieses Feld ist erforderlich / This field is required', 
        lastName: 'Dieses Feld ist erforderlich / This field is required', 
        dateOfBirth: 'Dieses Feld ist erforderlich / This field is required', 
        taxId: 'Dieses Feld ist erforderlich / This field is required' 
      }];
    } else {
      const childrenErrors = validateChildren(personalInfo.children);
      
      // Only add children errors if there actually are errors
      const hasChildErrors = Object.values(childrenErrors).some(childError => 
        Object.values(childError).some(e => !!e)
      );
      
      if (hasChildErrors) {
        errors.children = childrenErrors;
      }
    }
  }
  
  return errors;
};

export const validateIncomeInfo = (incomeInfo: TaxFormData['incomeInfo']) => {
  const errors: Record<string, string> = {};
  
  // Required fields for all users - these are the mandatory questions for each step
  if (incomeInfo.isEmployed === undefined) {
    errors.isEmployed = 'Bitte beantworten Sie diese Frage / Please answer this question';
  }
  
  // Only add validation errors for employed users
  if (incomeInfo.isEmployed === true) {
    if (!incomeInfo.employer || incomeInfo.employer.trim() === '') {
      errors.employer = 'Bitte geben Sie Ihren Arbeitgeber an / Please enter your employer';
    }
    
    if (incomeInfo.employmentIncome === undefined) {
      errors.employmentIncome = 'Bitte geben Sie Ihr Beschäftigungseinkommen an / Please enter your employment income';
    } else if (incomeInfo.employmentIncome !== null && incomeInfo.employmentIncome < 0) {
      errors.employmentIncome = 'Der Wert kann nicht negativ sein / Value cannot be negative';
    }
    
    if (incomeInfo.hasTaxCertificate === undefined) {
      errors.hasTaxCertificate = 'Bitte beantworten Sie diese Frage / Please answer this question';
    }
    
    if (incomeInfo.hasTaxCertificate === true && (!incomeInfo.taxCertificateFile || incomeInfo.taxCertificateFile.trim() === '')) {
      errors.taxCertificateFile = 'Bitte laden Sie das Steuerzertifikat hoch / Please upload tax certificate';
    }
  }
  
  // Business owner validation
  if (incomeInfo.isBusinessOwner === undefined) {
    errors.isBusinessOwner = 'Bitte beantworten Sie diese Frage / Please answer this question';
  }
  
  if (incomeInfo.isBusinessOwner === true) {
    if (!incomeInfo.businessType || incomeInfo.businessType.trim() === '') {
      errors.businessType = 'Bitte wählen Sie einen Geschäftstyp / Please select a business type';
    }
    
    if (incomeInfo.businessEarnings === undefined) {
      errors.businessEarnings = 'Bitte geben Sie Ihre Geschäftseinnahmen an / Please enter your business earnings';
    } else if (incomeInfo.businessEarnings !== null && incomeInfo.businessEarnings < 0) {
      errors.businessEarnings = 'Der Wert kann nicht negativ sein / Value cannot be negative';
    }
    
    if (incomeInfo.businessExpenses === undefined) {
      errors.businessExpenses = 'Bitte geben Sie Ihre Geschäftsausgaben an / Please enter your business expenses';
    } else if (incomeInfo.businessExpenses !== null && incomeInfo.businessExpenses < 0) {
      errors.businessExpenses = 'Der Wert kann nicht negativ sein / Value cannot be negative';
    }
  }
  
  // Stock income validation
  if (incomeInfo.hasStockIncome) {
    if (incomeInfo.dividendEarnings === undefined) {
      errors.dividendEarnings = 'Bitte geben Sie Ihre Dividendeneinnahmen an / Please enter your dividend earnings';
    } else if (typeof incomeInfo.dividendEarnings === 'number' && incomeInfo.dividendEarnings < 0) {
      errors.dividendEarnings = 'Der Wert kann nicht negativ sein / Value cannot be negative';
    }
    
    if (incomeInfo.hasStockSales) {
      if (incomeInfo.stockProfitLoss === undefined) {
        errors.stockProfitLoss = 'Bitte geben Sie Ihren Gewinn/Verlust an / Please enter your profit/loss';
      } else {
        // First convert to number if it's not already a number
        const profitLossValue = typeof incomeInfo.stockProfitLoss === 'number' 
          ? incomeInfo.stockProfitLoss 
          : Number(incomeInfo.stockProfitLoss);
        
        // Check if it's a valid number (not NaN)
        if (isNaN(profitLossValue)) {
          errors.stockProfitLoss = 'Bitte geben Sie einen gültigen Wert ein / Please enter a valid value';
        }
      }
    }

    if (incomeInfo.hasBankCertificate === undefined) {
      errors.hasBankCertificate = 'Bitte beantworten Sie diese Frage / Please answer this question';
    }
    
    if (incomeInfo.hasStockSales === undefined) {
      errors.hasStockSales = 'Bitte beantworten Sie diese Frage / Please answer this question';
    }
    
    if (incomeInfo.hasBankCertificate === true && (!incomeInfo.bankCertificateFile || incomeInfo.bankCertificateFile.trim() === '')) {
      errors.bankCertificateFile = 'Bitte laden Sie das Bankzertifikat hoch / Please upload bank certificate';
    }
    
    if (incomeInfo.hasForeignStocks === undefined) {
      errors.hasForeignStocks = 'Bitte beantworten Sie diese Frage / Please answer this question';
    }
    
    if (incomeInfo.hasForeignStocks === true) {
      if (incomeInfo.foreignTaxPaid === undefined) {
        errors.foreignTaxPaid = 'Bitte geben Sie die gezahlte ausländische Steuer an / Please enter foreign tax paid';
      } else if (incomeInfo.foreignTaxPaid !== null && incomeInfo.foreignTaxPaid < 0) {
        errors.foreignTaxPaid = 'Der Wert kann nicht negativ sein / Value cannot be negative';
      }
      
      if (!incomeInfo.foreignTaxCertificateFile || incomeInfo.foreignTaxCertificateFile.trim() === '') {
        errors.foreignTaxCertificateFile = 'Bitte laden Sie das ausländische Steuerzertifikat hoch / Please upload foreign tax certificate';
      }
    }
  }
  
  // Rental property validation
  if (incomeInfo.hasRentalProperty === true) {
    if (incomeInfo.rentalIncome === undefined) {
      errors.rentalIncome = 'Bitte geben Sie Ihre Mieteinnahmen an / Please enter your rental income';
    } else if (incomeInfo.rentalIncome !== null && incomeInfo.rentalIncome < 0) {
      errors.rentalIncome = 'Der Wert kann nicht negativ sein / Value cannot be negative';
    }
    
    if (incomeInfo.rentalCosts === undefined) {
      errors.rentalCosts = 'Bitte geben Sie Ihre Mietkosten an / Please enter your rental costs';
    } else if (incomeInfo.rentalCosts !== null && incomeInfo.rentalCosts < 0) {
      errors.rentalCosts = 'Der Wert kann nicht negativ sein / Value cannot be negative';
    }
    
    // Rental property address validation
    if (!incomeInfo.rentalPropertyAddress?.street?.trim()) {
      errors['rentalPropertyAddress.street'] = 'Bitte geben Sie die Straße an / Please enter the street';
    }
    
    if (!incomeInfo.rentalPropertyAddress?.houseNumber?.trim()) {
      errors['rentalPropertyAddress.houseNumber'] = 'Bitte geben Sie die Hausnummer an / Please enter the house number';
    }
    
    if (!isValidPostalCode(incomeInfo.rentalPropertyAddress?.postalCode || '')) {
      errors['rentalPropertyAddress.postalCode'] = 'Bitte geben Sie eine gültige Postleitzahl an / Please enter a valid postal code';
    }
    
    if (!incomeInfo.rentalPropertyAddress?.city?.trim()) {
      errors['rentalPropertyAddress.city'] = 'Bitte geben Sie die Stadt an / Please enter the city';
    }
  }
  
  // Foreign income validation
  if (incomeInfo.hasForeignIncome === true) {
    if (!incomeInfo.foreignIncomeCountry?.trim()) {
      errors.foreignIncomeCountry = 'Bitte wählen Sie das Land / Please select the country';
    }
    
    if (!incomeInfo.foreignIncomeType?.trim()) {
      errors.foreignIncomeType = 'Bitte wählen Sie den Einkommenstyp / Please select the income type';
    }
    
    if (incomeInfo.foreignIncomeAmount === undefined) {
      errors.foreignIncomeAmount = 'Bitte geben Sie den Einkommensbetrag an / Please enter the income amount';
    } else if (incomeInfo.foreignIncomeAmount !== null && incomeInfo.foreignIncomeAmount < 0) {
      errors.foreignIncomeAmount = 'Der Wert kann nicht negativ sein / Value cannot be negative';
    }
    
    if (incomeInfo.foreignIncomeTaxPaid === undefined) {
      errors.foreignIncomeTaxPaid = 'Bitte geben Sie die gezahlten Steuern an / Please enter the tax paid';
    } else if (incomeInfo.foreignIncomeTaxPaid !== null && incomeInfo.foreignIncomeTaxPaid < 0) {
      errors.foreignIncomeTaxPaid = 'Der Wert kann nicht negativ sein / Value cannot be negative';
    }
    
    if (!incomeInfo.foreignIncomeTaxCertificateFile?.trim()) {
      errors.foreignIncomeTaxCertificateFile = 'Bitte laden Sie das Steuerzertifikat hoch / Please upload the tax certificate';
    }
  }
  
  return errors;
};

export const validateDeductions = (deductions: TaxFormData['deductions']) => {
  const errors: Record<string, any> = {};
  
  // Add new fields to numeric validation
  const numericFields = [
    'commutingExpenses',
    'businessTripsCosts',
    'workEquipment',
    'homeOfficeAllowance',
    'membershipFees',
    'applicationCosts',
    'doubleHouseholdCosts',
    'churchTax',
    'donationsAndFees',
    'childcareCosts',
    'supportPayments',
    'privateSchoolFees',
    'retirementProvisions',
    'otherInsuranceExpenses',
    'professionalTrainingCosts',
    'medicalExpenses',
    'rehabilitationCosts',
    'careCosts',
    'disabilityExpenses',
    'funeralCosts',
    'relativesSupportCosts',
    'divorceCosts',
    'statutoryHealthInsurance',
    'privateHealthInsurance',
    'statutoryPensionInsurance',
    'privatePensionInsurance',
    'unemploymentInsurance',
    'accidentLiabilityInsurance',
    'disabilityInsurance',
    'termLifeInsurance',
    'householdServices',
    'craftsmenServices',
    'gardeningServices',
    'cleaningServices',
    'caretakerServices',
    'householdCareCosts',
    'householdSupportServices',
    'chimneySweepFees',
    'emergencySystemCosts'
  ];

  numericFields.forEach(field => {
    const value = deductions[field as keyof typeof deductions];
    errors[field] = value !== undefined && value !== null && (value as number) < 0;
  });

  // Craftsmen services validation
  errors.hasCraftsmenPayments = deductions.hasCraftsmenPayments === undefined;
  
  if (deductions.hasCraftsmenPayments === true) {
    errors.craftsmenAmount = (deductions.craftsmenAmount === undefined || 
                            (deductions.craftsmenAmount !== null && deductions.craftsmenAmount < 0));
    errors.craftsmenInvoiceFile = !deductions.craftsmenInvoiceFile?.trim();
  }
  
  // Maintenance payments validation
  // errors.hasMaintenancePayments = deductions.hasMaintenancePayments === undefined;
  
  // if (deductions.hasMaintenancePayments === true) {
  //   errors.maintenanceRecipient = !deductions.maintenanceRecipient?.trim();
  //   errors.maintenanceAmount = (deductions.maintenanceAmount === undefined || 
  //                            (deductions.maintenanceAmount !== null && deductions.maintenanceAmount < 0));
  //   errors.recipientsAbroad = deductions.recipientsAbroad === undefined;
  // }
  
  // // Special expenses detailed validation
  // errors.hasSpecialExpensesDetailed = deductions.hasSpecialExpensesDetailed === undefined;
  
  // if (deductions.hasSpecialExpensesDetailed === true) {
  //   errors.specialExpensesType = !deductions.specialExpensesType?.trim();
  //   errors.specialExpensesAmount = (deductions.specialExpensesAmount === undefined || 
  //                                (deductions.specialExpensesAmount !== null && deductions.specialExpensesAmount < 0));
  // }
  
  // // Private insurance validation
  // errors.hasPrivateInsurance = deductions.hasPrivateInsurance === undefined;
  
  // if (deductions.hasPrivateInsurance === true) {
  //   errors.insuranceTypes = !deductions.insuranceTypes?.trim();
  //   errors.insuranceContributions = (deductions.insuranceContributions === undefined || 
  //                                 (deductions.insuranceContributions !== null && deductions.insuranceContributions < 0));
  // }
  
  return errors;
};

export const validateTaxCredits = (taxCredits: TaxFormData['taxCredits']) => {
  const errors: Record<string, boolean> = {};
  
  // All tax credit fields should be numbers >= 0
  errors.childrenAllowance = taxCredits.childrenAllowance !== null && 
                             (isNaN(Number(taxCredits.childrenAllowance)) || taxCredits.childrenAllowance < 0);
  errors.homeOfficeDeduction = taxCredits.homeOfficeDeduction !== null && 
                              (isNaN(Number(taxCredits.homeOfficeDeduction)) || taxCredits.homeOfficeDeduction < 0);
  errors.donationsCharity = taxCredits.donationsCharity !== null && 
                           (isNaN(Number(taxCredits.donationsCharity)) || taxCredits.donationsCharity < 0);
  
  return errors;
};

export const validateChildren = (children: Array<{
  id?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  taxId: string;
}> = []) => {
  const errors: Record<number, Record<string, string | boolean>> = {};
  
  children.forEach((child, index) => {
    errors[index] = {
      firstName: !child.firstName?.trim() ? 'Dieses Feld ist erforderlich / This field is required' : false,
      lastName: !child.lastName?.trim() ? 'Dieses Feld ist erforderlich / This field is required' : false,
      dateOfBirth: !isValidDate(child.dateOfBirth || '') ? 'Bitte geben Sie ein gültiges Datum ein / Please enter a valid date' : false,
      taxId: !isValidTaxId(child.taxId || '') ? 'Bitte geben Sie eine gültige Steuer-ID ein / Please enter a valid tax ID' : false
    };
    
    // Clean up false values
    Object.keys(errors[index]).forEach(key => {
      if (errors[index][key] === false) {
        delete errors[index][key];
      }
    });
    
    // If no errors for this child, remove the entry
    if (Object.keys(errors[index]).length === 0) {
      delete errors[index];
    }
  });
  
  return errors;
};

// Validate signature data
export const validateSignature = (signature: TaxFormData['signature']) => {
  const errors: Record<string, boolean> = {};
  
  if (!signature) {
    // If signature data is missing entirely, mark all fields as errors
    errors.place = true;
    errors.date = true;
    errors.signature = true;
    return errors;
  }
  
  // Validate required fields
  errors.place = !signature.place || signature.place.trim() === '';
  errors.date = !signature.date || signature.date.trim() === '';
  errors.signature = !signature.signature;
  
  return errors;
};

export const validateTaxForm = (formData: TaxFormData, step: number): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  // Validate based on current step
  switch (step) {
    case 0: // Personal Info Step
  // Validate personal info
  const personalInfoErrors = validatePersonalInfo(formData.personalInfo);
  if (Object.values(personalInfoErrors).some(error => 
      typeof error === 'boolean' ? error : Object.values(error).some(e => e))) {
    errors.personalInfo = personalInfoErrors;
      }
      break;
      
    case 1: // Expenses & Deductions Step
      // Validate deductions
      const deductionsErrors = validateDeductions(formData.expenses);
      if (Object.values(deductionsErrors).some(error => 
          typeof error === 'boolean' ? error : Object.values(error).some(e => e))) {
        errors.expenses = deductionsErrors;
      }
      break;
      
    case 2: // Employment Income Step
      // Validate employment income fields
      const employmentErrors: Record<string, any> = {};
      
      // Check if employment status is selected
      employmentErrors.isEmployed = formData.incomeInfo.isEmployed === undefined;
      
      // If employed, validate additional fields
      if (formData.incomeInfo.isEmployed === true) {
        employmentErrors.employer = !formData.incomeInfo.employer?.trim();
        employmentErrors.employmentIncome = (formData.incomeInfo.employmentIncome === undefined || 
                                           formData.incomeInfo.employmentIncome === null || 
                                           Number(formData.incomeInfo.employmentIncome) <= 0);
        employmentErrors.hasTaxCertificate = formData.incomeInfo.hasTaxCertificate === undefined;
        
        // If has tax certificate, validate certificate file
        if (formData.incomeInfo.hasTaxCertificate === true) {
          employmentErrors.taxCertificateFile = !formData.incomeInfo.taxCertificateFile;
        }
        
        // Travel subsidy validation
        employmentErrors.hasTravelSubsidy = formData.incomeInfo.hasTravelSubsidy === undefined;
        
        // If has travel subsidy, validate distance
        if (formData.incomeInfo.hasTravelSubsidy === true) {
          employmentErrors.travelDistance = (formData.incomeInfo.travelDistance === undefined || 
                                          formData.incomeInfo.travelDistance === null || 
                                          Number(formData.incomeInfo.travelDistance) <= 0);
        }
      }
      
      // Only add employment errors if there are any
      if (Object.values(employmentErrors).some(error => error)) {
        if (!errors.incomeInfo) errors.incomeInfo = {};
        Object.assign(errors.incomeInfo, employmentErrors);
      }
      break;
      
    case 3: // Business Income Step
      // Validate business income fields
      const businessErrors: Record<string, any> = {};
      
      // Check if business owner status is selected
      businessErrors.isBusinessOwner = formData.incomeInfo.isBusinessOwner === undefined;
      
      // If business owner, validate additional fields
      if (formData.incomeInfo.isBusinessOwner === true) {
        businessErrors.businessType = !formData.incomeInfo.businessType?.trim();
        businessErrors.businessEarnings = (formData.incomeInfo.businessEarnings === undefined || 
                                         formData.incomeInfo.businessEarnings === null || 
                                         Number(formData.incomeInfo.businessEarnings) < 0);
        businessErrors.businessExpenses = (formData.incomeInfo.businessExpenses === undefined || 
                                         formData.incomeInfo.businessExpenses === null || 
                                         Number(formData.incomeInfo.businessExpenses) < 0);
      }
      
      // Only add business errors if there are any
      if (Object.values(businessErrors).some(error => error)) {
        if (!errors.incomeInfo) errors.incomeInfo = {};
        Object.assign(errors.incomeInfo, businessErrors);
      }
      break;
      
    case 4: // Investments Step
      if (!validateRequiredField(formData.incomeInfo, 'hasStockIncome')) {
        setNestedError(errors, 'incomeInfo', 'hasStockIncome', 'This field is required');
      }
      
      if (formData.incomeInfo.hasStockIncome) {
        // Validate dividend earnings (must be provided and >= 0)
        if (formData.incomeInfo.dividendEarnings === undefined || 
            formData.incomeInfo.dividendEarnings === null) {
          setNestedError(errors, 'incomeInfo', 'dividendEarnings', 'This field is required');
        } else if (Number(formData.incomeInfo.dividendEarnings) < 0) {
          setNestedError(errors, 'incomeInfo', 'dividendEarnings', 'Value cannot be negative');
        }
        
        // Validate bank certificate question
        if (!validateRequiredField(formData.incomeInfo, 'hasBankCertificate')) {
          setNestedError(errors, 'incomeInfo', 'hasBankCertificate', 'This field is required');
        }
        
        // Validate bank certificate file if required
        if (formData.incomeInfo.hasBankCertificate && !formData.incomeInfo.bankCertificateFile) {
          setNestedError(errors, 'incomeInfo', 'bankCertificateFile', 'Tax certificate is required');
        }
        
        // Validate stock sales question
        if (!validateRequiredField(formData.incomeInfo, 'hasStockSales')) {
          setNestedError(errors, 'incomeInfo', 'hasStockSales', 'This field is required');
        }
        
        // Validate stock profit/loss if required
        if (formData.incomeInfo.hasStockSales) {
          if (formData.incomeInfo.stockProfitLoss === undefined || 
              formData.incomeInfo.stockProfitLoss === null) {
            setNestedError(errors, 'incomeInfo', 'stockProfitLoss', 'This field is required');
          }
        }
        
        // Validate foreign stocks question
        if (!validateRequiredField(formData.incomeInfo, 'hasForeignStocks')) {
          setNestedError(errors, 'incomeInfo', 'hasForeignStocks', 'This field is required');
        }
        
        // Validate foreign tax fields if required
        if (formData.incomeInfo.hasForeignStocks) {
          if (formData.incomeInfo.foreignTaxPaid === undefined || 
              formData.incomeInfo.foreignTaxPaid === null) {
            setNestedError(errors, 'incomeInfo', 'foreignTaxPaid', 'This field is required');
          } else if (Number(formData.incomeInfo.foreignTaxPaid) < 0) {
            setNestedError(errors, 'incomeInfo', 'foreignTaxPaid', 'Value cannot be negative');
          }
          
          if (!formData.incomeInfo.foreignTaxCertificateFile) {
            setNestedError(errors, 'incomeInfo', 'foreignTaxCertificateFile', 'Foreign tax certificate is required');
          }
        }
      }
      break;
      
    case 5: // Rental Income Step
      // Validate rental income fields
      const rentalErrors: Record<string, any> = {};
      
      // Check if has rental property is selected
      rentalErrors.hasRentalProperty = formData.incomeInfo.hasRentalProperty === undefined;
      
      // If has rental property, validate additional fields
      if (formData.incomeInfo.hasRentalProperty === true) {
        rentalErrors.rentalIncome = (formData.incomeInfo.rentalIncome === undefined || 
                                  formData.incomeInfo.rentalIncome === null || 
                                  Number(formData.incomeInfo.rentalIncome) < 0);
        rentalErrors.rentalCosts = (formData.incomeInfo.rentalCosts === undefined || 
                                 formData.incomeInfo.rentalCosts === null || 
                                 Number(formData.incomeInfo.rentalCosts) < 0);
        
        // Validate rental property address
        const addressErrors: Record<string, boolean> = {};
        addressErrors.street = !formData.incomeInfo.rentalPropertyAddress?.street?.trim();
        addressErrors.houseNumber = !formData.incomeInfo.rentalPropertyAddress?.houseNumber?.trim();
        addressErrors.postalCode = !isValidPostalCode(formData.incomeInfo.rentalPropertyAddress?.postalCode || '');
        addressErrors.city = !formData.incomeInfo.rentalPropertyAddress?.city?.trim();
        
        // Only add address errors if there are any
        if (Object.values(addressErrors).some(error => error)) {
          rentalErrors.rentalPropertyAddress = addressErrors;
        }
      }
      
      // Only add rental errors if there are any
      if (Object.values(rentalErrors).some(error => 
      typeof error === 'boolean' ? error : Object.values(error).some(e => e))) {
        if (!errors.incomeInfo) errors.incomeInfo = {};
        Object.assign(errors.incomeInfo, rentalErrors);
      }
      break;
      
    case 6: // Foreign Income Step
      // Validate foreign income fields
      const foreignIncomeErrors: Record<string, any> = {};
      
      // Check if has foreign income is selected
      foreignIncomeErrors.hasForeignIncome = formData.incomeInfo.hasForeignIncome === undefined;
      
      // If has foreign income, validate additional fields
      if (formData.incomeInfo.hasForeignIncome === true) {
        foreignIncomeErrors.foreignIncomeCountry = !formData.incomeInfo.foreignIncomeCountry?.trim();
        foreignIncomeErrors.foreignIncomeType = !formData.incomeInfo.foreignIncomeType?.trim();
        foreignIncomeErrors.foreignIncomeAmount = (formData.incomeInfo.foreignIncomeAmount === undefined || 
                                               formData.incomeInfo.foreignIncomeAmount === null || 
                                               Number(formData.incomeInfo.foreignIncomeAmount) < 0);
        foreignIncomeErrors.foreignIncomeTaxPaid = (formData.incomeInfo.foreignIncomeTaxPaid === undefined || 
                                               formData.incomeInfo.foreignIncomeTaxPaid === null || 
                                               Number(formData.incomeInfo.foreignIncomeTaxPaid) < 0);
        foreignIncomeErrors.foreignIncomeTaxCertificateFile = !formData.incomeInfo.foreignIncomeTaxCertificateFile;
      }
      
      // Only add foreign income errors if there are any
      if (Object.values(foreignIncomeErrors).some(error => error)) {
        if (!errors.incomeInfo) errors.incomeInfo = {};
        Object.assign(errors.incomeInfo, foreignIncomeErrors);
      }
      break;
      
    case 7: // Review Step
      // No validation needed for review step
      break;
      
    case 8: // Signature
      errors.signature = validateSignature(formData.signature);
      break;
      
    case 2: // Deductions Step
      // Validate hasSpecialExpensesDetailed
      if (formData.expenses.hasSpecialExpensesDetailed === undefined) {
        setNestedError(errors, 'deductions', 'hasSpecialExpensesDetailed', 'This field is required');
      }
      
      // If has special expenses, validate required fields
      if (formData.expenses.hasSpecialExpensesDetailed) {
        if (!formData.expenses.specialExpensesType || formData.expenses.specialExpensesType.trim() === '') {
          setNestedError(errors, 'deductions', 'specialExpensesType', 'This field is required');
        }
        
        if (formData.expenses.specialExpensesAmount === undefined || 
            formData.expenses.specialExpensesAmount === null || 
            Number(formData.expenses.specialExpensesAmount) < 0) {
          setNestedError(errors, 'deductions', 'specialExpensesAmount', 'Please enter a valid amount');
        }
      }
      
      // Validate hasPrivateInsurance
      if (formData.expenses.hasPrivateInsurance === undefined) {
        setNestedError(errors, 'deductions', 'hasPrivateInsurance', 'This field is required');
      }
      
      // If has private insurance, validate required fields
      if (formData.expenses.hasPrivateInsurance) {
        if (!formData.expenses.insuranceTypes || formData.expenses.insuranceTypes.trim() === '') {
          setNestedError(errors, 'deductions', 'insuranceTypes', 'This field is required');
        }
        
        if (formData.expenses.insuranceContributions === undefined || 
            formData.expenses.insuranceContributions === null || 
            Number(formData.expenses.insuranceContributions) < 0) {
          setNestedError(errors, 'deductions', 'insuranceContributions', 'Please enter a valid amount');
        }
      }
      
      // Validate existing deduction fields
      if (formData.expenses.churchTax !== undefined && formData.expenses.churchTax < 0) {
        setNestedError(errors, 'deductions', 'churchTax', 'Value cannot be negative');
      }
      
      if (formData.expenses.donationsAndFees !== undefined && formData.expenses.donationsAndFees < 0) {
        setNestedError(errors, 'deductions', 'donationsAndFees', 'Value cannot be negative');
      }
      
      if (formData.expenses.privateHealthInsurance !== undefined && formData.expenses.privateHealthInsurance < 0) {
        setNestedError(errors, 'deductions', 'privateHealthInsurance', 'Value cannot be negative');
      }
      
      if (formData.expenses.privatePensionInsurance !== undefined && formData.expenses.privatePensionInsurance < 0) {
        setNestedError(errors, 'deductions', 'privatePensionInsurance', 'Value cannot be negative');
      }
      break;
      
    default:
      // Validate all sections for any other step value
      // Personal Info
      const allPersonalInfoErrors = validatePersonalInfo(formData.personalInfo);
      if (Object.values(allPersonalInfoErrors).some(error => 
          typeof error === 'boolean' ? error : Object.values(error).some(e => e))) {
        errors.personalInfo = allPersonalInfoErrors;
      }
      
      // Income Info (all subsections)
      const allIncomeInfoErrors = validateIncomeInfo(formData.incomeInfo);
      if (Object.values(allIncomeInfoErrors).some(error => 
          typeof error === 'boolean' ? error : Object.values(error).some(e => e))) {
        errors.incomeInfo = allIncomeInfoErrors;
      }
      
      // Deductions
      const allDeductionsErrors = validateDeductions(formData.expenses);
      if (Object.values(allDeductionsErrors).some(error => 
          typeof error === 'boolean' ? error : Object.values(error).some(e => e))) {
        errors.expenses = allDeductionsErrors;
      }
      
      // Tax Credits (keeping for backward compatibility)
      const allTaxCreditsErrors = validateTaxCredits(formData.taxCredits);
      if (Object.values(allTaxCreditsErrors).some(error => error)) {
        errors.taxCredits = allTaxCreditsErrors;
      }
      
      // Signature
      if (formData.signature) {
        const allSignatureErrors: Record<string, boolean> = {};
        allSignatureErrors.place = !formData.signature.place?.trim();
        allSignatureErrors.date = !formData.signature.date;
        allSignatureErrors.signature = !formData.signature.signature;
        
        if (Object.values(allSignatureErrors).some(error => error)) {
          errors.signature = allSignatureErrors;
        }
      }
      break;
  }
  
  // Check if there are any errors
  const hasErrors = Object.keys(errors).length > 0;
  
  console.log('Form Validation Errors:', {
    currentStep: step,
    hasErrors,
    errors
  });
  
  return errors;
}; 