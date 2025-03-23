import { TaxFormData, Address } from './taxTypes';

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
  const errors: Record<string, any> = {};
  
  // Required fields for all users - these are the mandatory questions for each step
  errors.isEmployed = incomeInfo.isEmployed === undefined;
  errors.isBusinessOwner = incomeInfo.isBusinessOwner === undefined;
  errors.hasStockIncome = incomeInfo.hasStockIncome === undefined;
  errors.hasRentalProperty = incomeInfo.hasRentalProperty === undefined;
  errors.hasForeignIncome = incomeInfo.hasForeignIncome === undefined;
  
  // Employment validation
  if (incomeInfo.isEmployed === true) {
    errors.employer = !incomeInfo.employer?.trim();
    errors.employmentIncome = (incomeInfo.employmentIncome === undefined || 
                              (incomeInfo.employmentIncome !== null && incomeInfo.employmentIncome < 0));
    errors.grossAnnualSalary = (incomeInfo.grossAnnualSalary === undefined || 
                               (incomeInfo.grossAnnualSalary !== null && incomeInfo.grossAnnualSalary < 0));
    errors.hasTaxCertificate = incomeInfo.hasTaxCertificate === undefined;
    
    if (incomeInfo.hasTaxCertificate === true) {
      errors.taxCertificateFile = !incomeInfo.taxCertificateFile?.trim();
    }
    
    errors.hasTravelSubsidy = incomeInfo.hasTravelSubsidy === undefined;
  }
  
  // Business validation
  if (incomeInfo.isBusinessOwner === true) {
    errors.businessType = !incomeInfo.businessType?.trim();
    errors.businessEarnings = (incomeInfo.businessEarnings === undefined || 
                              (incomeInfo.businessEarnings !== null && incomeInfo.businessEarnings < 0));
    errors.businessExpenses = (incomeInfo.businessExpenses === undefined || 
                              (incomeInfo.businessExpenses !== null && incomeInfo.businessExpenses < 0));
  }
  
  // Stock income validation
  if (incomeInfo.hasStockIncome === true) {
    errors.dividendEarnings = (incomeInfo.dividendEarnings === undefined || 
                              (incomeInfo.dividendEarnings !== null && incomeInfo.dividendEarnings < 0));
    errors.hasBankCertificate = incomeInfo.hasBankCertificate === undefined;
    errors.hasStockSales = incomeInfo.hasStockSales === undefined;
    
    if (incomeInfo.hasBankCertificate === true) {
      errors.bankCertificateFile = !incomeInfo.bankCertificateFile?.trim();
    }
    
    if (incomeInfo.hasStockSales === true) {
      errors.stockProfitLoss = incomeInfo.stockProfitLoss === undefined;
    }
    
    errors.hasForeignStocks = incomeInfo.hasForeignStocks === undefined;
    
    if (incomeInfo.hasForeignStocks === true) {
      errors.foreignTaxPaid = (incomeInfo.foreignTaxPaid === undefined || 
                              (incomeInfo.foreignTaxPaid !== null && incomeInfo.foreignTaxPaid < 0));
      errors.foreignTaxCertificateFile = !incomeInfo.foreignTaxCertificateFile?.trim();
    }
  }
  
  // Rental property validation
  if (incomeInfo.hasRentalProperty === true) {
    errors.rentalIncome = (incomeInfo.rentalIncome === undefined || 
                          (incomeInfo.rentalIncome !== null && incomeInfo.rentalIncome < 0));
    errors.rentalCosts = (incomeInfo.rentalCosts === undefined || 
                         (incomeInfo.rentalCosts !== null && incomeInfo.rentalCosts < 0));
    
    // Rental property address validation
    errors.rentalPropertyAddress = {
      street: !incomeInfo.rentalPropertyAddress?.street?.trim(),
      houseNumber: !incomeInfo.rentalPropertyAddress?.houseNumber?.trim(),
      postalCode: !isValidPostalCode(incomeInfo.rentalPropertyAddress?.postalCode || ''),
      city: !incomeInfo.rentalPropertyAddress?.city?.trim()
    };
  }
  
  // Foreign income validation
  if (incomeInfo.hasForeignIncome === true) {
    errors.foreignIncomeCountry = !incomeInfo.foreignIncomeCountry?.trim();
    errors.foreignIncomeType = !incomeInfo.foreignIncomeType?.trim();
    errors.foreignIncomeAmount = (incomeInfo.foreignIncomeAmount === undefined || 
                                (incomeInfo.foreignIncomeAmount !== null && incomeInfo.foreignIncomeAmount < 0));
    errors.foreignIncomeTaxPaid = (incomeInfo.foreignIncomeTaxPaid === undefined || 
                                 (incomeInfo.foreignIncomeTaxPaid !== null && incomeInfo.foreignIncomeTaxPaid < 0));
    errors.foreignIncomeTaxCertificateFile = !incomeInfo.foreignIncomeTaxCertificateFile?.trim();
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
  errors.hasMaintenancePayments = deductions.hasMaintenancePayments === undefined;
  
  if (deductions.hasMaintenancePayments === true) {
    errors.maintenanceRecipient = !deductions.maintenanceRecipient?.trim();
    errors.maintenanceAmount = (deductions.maintenanceAmount === undefined || 
                             (deductions.maintenanceAmount !== null && deductions.maintenanceAmount < 0));
    errors.recipientsAbroad = deductions.recipientsAbroad === undefined;
  }
  
  // Special expenses detailed validation
  errors.hasSpecialExpensesDetailed = deductions.hasSpecialExpensesDetailed === undefined;
  
  if (deductions.hasSpecialExpensesDetailed === true) {
    errors.specialExpensesType = !deductions.specialExpensesType?.trim();
    errors.specialExpensesAmount = (deductions.specialExpensesAmount === undefined || 
                                 (deductions.specialExpensesAmount !== null && deductions.specialExpensesAmount < 0));
  }
  
  // Private insurance validation
  errors.hasPrivateInsurance = deductions.hasPrivateInsurance === undefined;
  
  if (deductions.hasPrivateInsurance === true) {
    errors.insuranceTypes = !deductions.insuranceTypes?.trim();
    errors.insuranceContributions = (deductions.insuranceContributions === undefined || 
                                  (deductions.insuranceContributions !== null && deductions.insuranceContributions < 0));
  }
  
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

export const validateTaxForm = (formData: TaxFormData, currentStep: number = 0): Record<string, any> | null => {
  const errors: Record<string, any> = {};
  
  // Step 0: Personal Information
  if (currentStep === 0) {
    // Validate personal info
    const personalInfoErrors = validatePersonalInfo(formData.personalInfo);
    if (Object.values(personalInfoErrors).some(error => 
        typeof error === 'boolean' ? error : Object.values(error).some(e => e))) {
      errors.personalInfo = personalInfoErrors;
    }
  }
  // Step 1: Income Information
  else if (currentStep === 1) {
    // Validate income info
    const incomeInfoErrors = validateIncomeInfo(formData.incomeInfo);
    if (Object.values(incomeInfoErrors).some(error => 
        typeof error === 'boolean' ? error : Object.values(error).some(e => e))) {
      errors.incomeInfo = incomeInfoErrors;
    }
  }
  // Step 2: Deductions
  else if (currentStep === 2) {
    // Validate deductions
    const deductionsErrors = validateDeductions(formData.deductions);
    if (Object.values(deductionsErrors).some(error => 
        typeof error === 'boolean' ? error : Object.values(error).some(e => e))) {
      errors.deductions = deductionsErrors;
    }
  }
  // Step 3: Tax Credits
  else if (currentStep === 3) {
    // Validate tax credits
    const taxCreditsErrors = validateTaxCredits(formData.taxCredits);
    if (Object.values(taxCreditsErrors).some(error => error)) {
      errors.taxCredits = taxCreditsErrors;
    }
  }
  // Step 4: Signature
  else if (currentStep === 4 && formData.signature) {
    // Validate signature
    const signatureErrors: Record<string, boolean> = {};
    
    if (!formData.signature.place) {
      signatureErrors.place = true;
    }
    if (!formData.signature.date) {
      signatureErrors.date = true;
    }
    if (!formData.signature.time) {
      signatureErrors.time = true;
    }
    if (!formData.signature.signature) {
      signatureErrors.signature = true;
    }

    if (Object.keys(signatureErrors).length > 0) {
      errors.signature = signatureErrors;
    }
  }
  
  // Check if there are any errors
  const hasErrors = Object.keys(errors).length > 0;
  
  console.log('Form Validation Errors:', {
    hasErrors,
    errors
  });
  
  return hasErrors ? errors : null;
}; 