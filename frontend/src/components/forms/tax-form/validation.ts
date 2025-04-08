// Define the structure for form data (expand as needed)
interface TaxFormData {
  personalInfo?: { [key: string]: any };
  // Add other sections later
}

// Define the structure for validation errors
export interface ValidationErrors {
  [section: string]: {
    [field: string]: string | { [key: string]: string };
  };
}

// --- Validation Helper Functions ---
const isEmpty = (value: any): boolean => {
  return value === null || value === undefined || String(value).trim() === '';
};

const isValidDate = (value: string): boolean => {
  if (!value) return false;
  const date = new Date(value);
  return date instanceof Date && !isNaN(date.getTime());
};

const isValidEmail = (value: string): boolean => {
  if (!value) return true; // Email is optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

const isValidPhone = (value: string): boolean => {
  if (!value) return true; // Phone is optional
  const phoneRegex = /^\+?[\d\s-]{8,}$/;
  return phoneRegex.test(value);
};

const isValidTaxId = (value: string): boolean => {
  if (!value) return false;
  // Implement specific tax ID validation logic here
  // For now, just check if it's not empty and has at least 8 characters
  return value.length >= 8;
};

const isValidPostalCode = (value: string): boolean => {
  if (!value) return false;
  // German postal code format: 5 digits
  const postalCodeRegex = /^\d{5}$/;
  return postalCodeRegex.test(value);
};

// Add helper functions for expenses validation
const isValidWorkingDays = (value: number): boolean => {
  return !isNaN(value) && value >= 0 && value <= 230;
};

const isValidAmount = (value: number): boolean => {
  return !isNaN(value) && value >= 0;
};

const isValidAddress = (address: any): boolean => {
  return !isEmpty(address?.street) &&
         !isEmpty(address?.houseNumber) &&
         isValidPostalCode(address?.postalCode) &&
         !isEmpty(address?.city);
};

// --- Main Validation Function ---
export const validateTaxForm = (
  formData: any,
  step: number,
  i18n: any
): ValidationErrors => {
  const errors: ValidationErrors = {};
  const validationMessages = i18n?.validation || {};
  let section: string;

  const setError = (section: string, field: string, messageKey: string) => {
    if (!errors[section]) {
      errors[section] = {};
    }
    if (field.includes('.')) {
      const keys = field.split('.');
      let current = errors[section] as any;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current[key]) {
          current[key] = {};
        }
        current = current[key];
      }
      current[keys[keys.length - 1]] = messageKey;
    } else {
      errors[section][field] = messageKey;
    }
  };

  switch (step) {
    case 0: // Personal Info Step
      const pi = formData.personalInfo || {};
      section = 'personalInfo';

      // Basic Information
      if (isEmpty(pi.firstName)) setError(section, 'firstName', 'required');
      if (isEmpty(pi.lastName)) setError(section, 'lastName', 'required');
      if (!isValidTaxId(pi.taxId)) setError(section, 'taxId', 'invalidTaxId');
      if (!isValidDate(pi.dateOfBirth)) setError(section, 'dateOfBirth', 'invalidDate');
      if (isEmpty(pi.maritalStatus)) setError(section, 'maritalStatus', 'selectionRequired');
      
      // Optional fields with format validation
      if (pi.email && !isValidEmail(pi.email)) setError(section, 'email', 'invalidEmail');
      if (pi.phone && !isValidPhone(pi.phone)) setError(section, 'phone', 'invalidPhone');

      // Address (all fields mandatory)
      if (isEmpty(pi.address?.street)) setError(section, 'address.street', 'required');
      if (isEmpty(pi.address?.houseNumber)) setError(section, 'address.houseNumber', 'required');
      if (!isValidPostalCode(pi.address?.postalCode)) setError(section, 'address.postalCode', 'invalidPostalCode');
      if (isEmpty(pi.address?.city)) setError(section, 'address.city', 'required');

      // Foreign Residence (conditional validation)
      if (pi.hasForeignResidence === undefined) {
        setError(section, 'hasForeignResidence', 'selectionRequired');
      } else if (pi.hasForeignResidence === true) {
        if (isEmpty(pi.foreignResidence?.country)) {
          setError(section, 'foreignResidence.country', 'selectionRequired');
        }
        if (pi.foreignResidence?.country === 'other' && isEmpty(pi.foreignResidence?.otherCountry)) {
          setError(section, 'foreignResidence.otherCountry', 'required');
        }
      }

      // Spouse Information (conditional based on marital status)
      const requiresSpouseInfo = pi.maritalStatus === 'married' || pi.maritalStatus === 'registered_partnership';
      if (requiresSpouseInfo) {
        if (isEmpty(pi.spouse?.firstName)) setError(section, 'spouse.firstName', 'required');
        if (isEmpty(pi.spouse?.lastName)) setError(section, 'spouse.lastName', 'required');
        if (!isValidDate(pi.spouse?.dateOfBirth)) setError(section, 'spouse.dateOfBirth', 'invalidDate');
        if (!isValidTaxId(pi.spouse?.taxId)) setError(section, 'spouse.taxId', 'invalidTaxId');
        
        if (pi.spouse?.hasIncome === undefined) {
          setError(section, 'spouse.hasIncome', 'selectionRequired');
        } else if (pi.spouse?.hasIncome === true) {
          if (isEmpty(pi.spouse?.incomeType)) {
            setError(section, 'spouse.incomeType', 'selectionRequired');
          }
          if (pi.spouse?.jointTaxation === undefined) {
            setError(section, 'spouse.jointTaxation', 'selectionRequired');
          }
        }
      }

      // Children Information (conditional validation)
      if (pi.hasChildren === undefined) {
        setError(section, 'hasChildren', 'selectionRequired');
      } else if (pi.hasChildren === true) {
        // Validate that there is at least one child if hasChildren is true
        if (!Array.isArray(pi.children) || pi.children.length === 0) {
          setError(section, 'children', 'childRequired');
        } else {
          // Validate each child's information
          pi.children.forEach((child: any, index: number) => {
            // First Name validation
            if (isEmpty(child.firstName)) {
              setError(section, `children.${index}.firstName`, 'required');
            }
            
            // Last Name validation
            if (isEmpty(child.lastName)) {
              setError(section, `children.${index}.lastName`, 'required');
            }
            
            // Date of Birth validation
            if (!isValidDate(child.dateOfBirth)) {
              setError(section, `children.${index}.dateOfBirth`, 'invalidDate');
            } else {
              // Additional validation to ensure child's date of birth is not in the future
              const childDob = new Date(child.dateOfBirth);
              const today = new Date();
              if (childDob > today) {
                setError(section, `children.${index}.dateOfBirth`, 'invalidDate');
              }
            }
            
            // Tax ID validation
            if (!isValidTaxId(child.taxId)) {
              setError(section, `children.${index}.taxId`, 'invalidTaxId');
            }
          });
        }
      }

      break;

    case 1: // Income Info Step
      const ii = formData.incomeInfo || {};
      section = 'incomeInfo';

      // Employment Section
      if (ii.employment?.isEmployed === undefined) {
        setError(section, 'employment.isEmployed', 'selectionRequired');
      } else if (ii.employment?.isEmployed === true) {
        // Employer validation
        if (isEmpty(ii.employment?.employer)) {
          setError(section, 'employment.employer', 'required');
        }

        // Employment Income validation
        if (isEmpty(ii.employment?.employmentIncome)) {
          setError(section, 'employment.employmentIncome', 'required');
        } else if (Number(ii.employment?.employmentIncome) < 0) {
          setError(section, 'employment.employmentIncome', 'invalidAmount');
        }

        // Tax Certificate validation
        if (ii.employment?.hasTaxCertificate === undefined) {
          setError(section, 'employment.hasTaxCertificate', 'selectionRequired');
        } else if (ii.employment?.hasTaxCertificate === true) {
          if (!ii.employment?.taxCertificate || !Array.isArray(ii.employment?.taxCertificate) || ii.employment?.taxCertificate.length === 0) {
            setError(section, 'employment.taxCertificate', 'fileRequired');
          }
        }

        // Travel Subsidy validation
        if (ii.employment?.hasTravelSubsidy === undefined) {
          setError(section, 'employment.hasTravelSubsidy', 'selectionRequired');
        } else if (ii.employment?.hasTravelSubsidy === true) {
          if (isEmpty(ii.employment?.travelDistance)) {
            setError(section, 'employment.travelDistance', 'required');
          } else if (Number(ii.employment?.travelDistance) <= 0) {
            setError(section, 'employment.travelDistance', 'invalidDistance');
          }
        }
      }

      // Business Expenses Section
      if (ii.business?.isBusinessOwner === undefined) {
        setError(section, 'business.isBusinessOwner', 'selectionRequired');
      } else if (ii.business?.isBusinessOwner === true) {
        // Business Type validation
        if (isEmpty(ii.business?.businessType)) {
          setError(section, 'business.businessType', 'required');
        }

        // Business Earnings validation
        if (isEmpty(ii.business?.businessEarnings)) {
          setError(section, 'business.businessEarnings', 'required');
        } else if (Number(ii.business?.businessEarnings) < 0) {
          setError(section, 'business.businessEarnings', 'invalidAmount');
        }

        // Business Expenses validation
        if (isEmpty(ii.business?.businessExpenses)) {
          setError(section, 'business.businessExpenses', 'required');
        } else if (Number(ii.business?.businessExpenses) < 0) {
          setError(section, 'business.businessExpenses', 'invalidAmount');
        }
      }
      break;

    case 2: // Rental Income Step
      const ri = formData.incomeInfo || {};
      section = 'incomeInfo';

      // Rental Income Section
      if (ri.hasRentalProperty === undefined) {
        setError(section, 'hasRentalProperty', 'selectionRequired');
      } else if (ri.hasRentalProperty === true) {
        // Rental Income validation
        if (isEmpty(ri.rentalIncome)) {
          setError(section, 'rentalIncome', 'required');
        } else if (!isValidAmount(Number(ri.rentalIncome))) {
          setError(section, 'rentalIncome', 'invalidAmount');
        }

        // Rental Costs validation
        if (isEmpty(ri.rentalCosts)) {
          setError(section, 'rentalCosts', 'required');
        } else if (!isValidAmount(Number(ri.rentalCosts))) {
          setError(section, 'rentalCosts', 'invalidAmount');
        }

        // Rental Property Address validation
        const address = ri.rentalPropertyAddress || {};
        if (isEmpty(address.street)) {
          setError(section, 'rentalPropertyAddress.street', 'required');
        }
        if (isEmpty(address.houseNumber)) {
          setError(section, 'rentalPropertyAddress.houseNumber', 'required');
        }
        if (!isValidPostalCode(address.postalCode)) {
          setError(section, 'rentalPropertyAddress.postalCode', 'invalidPostalCode');
        }
        if (isEmpty(address.city)) {
          setError(section, 'rentalPropertyAddress.city', 'required');
        }
      }
      break;

    case 3: // Foreign Income Step
      const fi = formData.incomeInfo || {};
      section = 'incomeInfo';

      // Foreign Income Section
      if (fi.hasForeignIncome === undefined) {
        setError(section, 'hasForeignIncome', 'selectionRequired');
      } else if (fi.hasForeignIncome === true) {
        // Country validation
        if (isEmpty(fi.foreignIncomeCountry)) {
          setError(section, 'foreignIncomeCountry', 'required');
        }

        // Income Type validation
        if (isEmpty(fi.foreignIncomeType)) {
          setError(section, 'foreignIncomeType', 'required');
        }

        // Foreign Income Amount validation
        if (isEmpty(fi.foreignIncomeAmount)) {
          setError(section, 'foreignIncomeAmount', 'required');
        } else if (!isValidAmount(Number(fi.foreignIncomeAmount))) {
          setError(section, 'foreignIncomeAmount', 'invalidAmount');
        }

        // Foreign Tax Paid validation
        if (isEmpty(fi.foreignIncomeTaxPaid)) {
          setError(section, 'foreignIncomeTaxPaid', 'required');
        } else if (!isValidAmount(Number(fi.foreignIncomeTaxPaid))) {
          setError(section, 'foreignIncomeTaxPaid', 'invalidAmount');
        }

        // Tax Certificate validation
        if (!fi.foreignIncomeTaxCertificateFile || 
            (Array.isArray(fi.foreignIncomeTaxCertificateFile) && fi.foreignIncomeTaxCertificateFile.length === 0)) {
          setError(section, 'foreignIncomeTaxCertificateFile', 'fileRequired');
        }
      }
      break;

    case 4: // Expenses Step
      const ex = formData.expenses || {};
      section = 'expenses';

      // Work-Related Expenses - Commutation
      if (ex.workRelatedExpenses?.commutation?.hasCommutingExpenses === undefined) {
        setError(section, 'workRelatedExpenses.commutation.hasCommutingExpenses', 'selectionRequired');
      } else if (ex.workRelatedExpenses?.commutation?.hasCommutingExpenses === true) {
        // Working Days Count
        if (isEmpty(ex.workRelatedExpenses?.commutation?.workingDaysCount)) {
          setError(section, 'workRelatedExpenses.commutation.workingDaysCount', 'required');
        } else if (!isValidWorkingDays(Number(ex.workRelatedExpenses?.commutation?.workingDaysCount))) {
          setError(section, 'workRelatedExpenses.commutation.workingDaysCount', 'invalidWorkingDays');
        }

        // Route Validation
        const route = ex.workRelatedExpenses?.commutation?.route;
        if (!isValidAddress(route?.from)) {
          setError(section, 'workRelatedExpenses.commutation.route.from', 'invalidAddress');
        }
        if (!isValidAddress(route?.firstOfficeAddress)) {
          setError(section, 'workRelatedExpenses.commutation.route.firstOfficeAddress', 'invalidAddress');
        }
      }

      // Home Office
      if (ex.workRelatedExpenses?.homeOffice?.hasHomeOffice === undefined) {
        setError(section, 'workRelatedExpenses.homeOffice.hasHomeOffice', 'selectionRequired');
      } else if (ex.workRelatedExpenses?.homeOffice?.hasHomeOffice === true) {
        if (isEmpty(ex.workRelatedExpenses?.homeOffice?.workingDaysCount)) {
          setError(section, 'workRelatedExpenses.homeOffice.workingDaysCount', 'required');
        } else if (!isValidWorkingDays(Number(ex.workRelatedExpenses?.homeOffice?.workingDaysCount))) {
          setError(section, 'workRelatedExpenses.homeOffice.workingDaysCount', 'invalidWorkingDays');
        }
      }

      // Application Costs
      if (!isEmpty(ex.workRelatedExpenses?.applicationCosts?.online) && 
          !isValidAmount(Number(ex.workRelatedExpenses?.applicationCosts?.online))) {
        setError(section, 'workRelatedExpenses.applicationCosts.online', 'invalidAmount');
      }
      if (!isEmpty(ex.workRelatedExpenses?.applicationCosts?.inPerson) && 
          !isValidAmount(Number(ex.workRelatedExpenses?.applicationCosts?.inPerson))) {
        setError(section, 'workRelatedExpenses.applicationCosts.inPerson', 'invalidAmount');
      }

      // Special Expenses
      const specialExpenses = ex.specialExpenses || {};
      ['churchTax', 'donationsAndFees', 'childcareCosts', 'privateSchoolFees', 
       'retirementProvisions', 'otherInsuranceExpenses', 'professionalTrainingCosts'].forEach(field => {
        if (!isEmpty(specialExpenses[field]) && !isValidAmount(Number(specialExpenses[field]))) {
          setError(section, `specialExpenses.${field}`, 'invalidAmount');
        }
      });

      // Extraordinary Expenses
      const extraordinaryExpenses = ex.extraordinaryExpenses || {};
      ['medicalExpenses', 'rehabilitationCosts', 'careCosts', 'disabilityExpenses', 
       'funeralCosts', 'relativesSupportCosts', 'divorceCosts'].forEach(field => {
        if (!isEmpty(extraordinaryExpenses[field]) && !isValidAmount(Number(extraordinaryExpenses[field]))) {
          setError(section, `extraordinaryExpenses.${field}`, 'invalidAmount');
        }
      });

      // Insurance Premiums
      const insurancePremiums = ex.insurancePremiums || {};
      
      // Statutory Health Insurance
      if (!isEmpty(insurancePremiums.statutoryHealthInsurance?.statutory) && 
          !isValidAmount(Number(insurancePremiums.statutoryHealthInsurance?.statutory))) {
        setError(section, 'insurancePremiums.statutoryHealthInsurance.statutory', 'invalidAmount');
      }
      if (!isEmpty(insurancePremiums.statutoryHealthInsurance?.longterm) && 
          !isValidAmount(Number(insurancePremiums.statutoryHealthInsurance?.longterm))) {
        setError(section, 'insurancePremiums.statutoryHealthInsurance.longterm', 'invalidAmount');
      }

      // Private Health Insurance
      if (!isEmpty(insurancePremiums.privateHealthInsurance?.private) && 
          !isValidAmount(Number(insurancePremiums.privateHealthInsurance?.private))) {
        setError(section, 'insurancePremiums.privateHealthInsurance.private', 'invalidAmount');
      }
      if (!isEmpty(insurancePremiums.privateHealthInsurance?.longterm) && 
          !isValidAmount(Number(insurancePremiums.privateHealthInsurance?.longterm))) {
        setError(section, 'insurancePremiums.privateHealthInsurance.longterm', 'invalidAmount');
      }

      // Craftsmen Services
      if (ex.craftsmenServices?.hasMaintenancePayments === undefined) {
        setError(section, 'craftsmenServices.hasMaintenancePayments', 'selectionRequired');
      } else if (ex.craftsmenServices?.hasMaintenancePayments === true) {
        if (isEmpty(ex.craftsmenServices?.maintenanceRecipient)) {
          setError(section, 'craftsmenServices.maintenanceRecipient', 'required');
        }
        if (isEmpty(ex.craftsmenServices?.maintenanceAmount)) {
          setError(section, 'craftsmenServices.maintenanceAmount', 'required');
        } else if (!isValidAmount(Number(ex.craftsmenServices?.maintenanceAmount))) {
          setError(section, 'craftsmenServices.maintenanceAmount', 'invalidAmount');
        }
        if (!ex.craftsmenServices?.invoiceCraftsmenServices) {
          setError(section, 'craftsmenServices.invoiceCraftsmenServices', 'fileRequired');
        }
      }

      // Rental and Leasing
      const rental = ex.rentalAndLeasing || {};
      if (!isEmpty(rental.ownerFirstName) || !isEmpty(rental.ownerLastName) || !isEmpty(rental.purchaseDate)) {
        if (isEmpty(rental.ownerFirstName)) setError(section, 'rentalAndLeasing.ownerFirstName', 'required');
        if (isEmpty(rental.ownerLastName)) setError(section, 'rentalAndLeasing.ownerLastName', 'required');
        if (isEmpty(rental.purchaseDate)) {
          setError(section, 'rentalAndLeasing.purchaseDate', 'required');
        } else if (!isValidDate(rental.purchaseDate)) {
          setError(section, 'rentalAndLeasing.purchaseDate', 'invalidDate');
        }
        if (!isValidAddress(rental.address)) {
          setError(section, 'rentalAndLeasing.address', 'invalidAddress');
        }
      }
      break;

    case 5: // Business Expenses Step
      const be = formData.businessInfo || {};
      section = 'businessInfo';

      // Business Owner Question
      if (be.isBusinessOwner === undefined) {
        setError(section, 'isBusinessOwner', 'selectionRequired');
      } else if (be.isBusinessOwner === true) {
        // Business Type validation
        if (isEmpty(be.businessType)) {
          setError(section, 'businessType', 'selectionRequired');
        }

        // Business Earnings validation
        if (isEmpty(be.businessEarnings)) {
          setError(section, 'businessEarnings', 'required');
        } else if (!isValidAmount(Number(be.businessEarnings))) {
          setError(section, 'businessEarnings', 'invalidAmount');
        }

        // Business Expenses validation
        if (isEmpty(be.businessExpenses)) {
          setError(section, 'businessExpenses', 'required');
        } else if (!isValidAmount(Number(be.businessExpenses))) {
          setError(section, 'businessExpenses', 'invalidAmount');
        }

        // Business Address validation
        const address = be.businessAddress || {};
        if (isEmpty(address.street)) {
          setError(section, 'businessAddress.street', 'required');
        }
        if (isEmpty(address.houseNumber)) {
          setError(section, 'businessAddress.houseNumber', 'required');
        }
        if (!isValidPostalCode(address.postalCode)) {
          setError(section, 'businessAddress.postalCode', 'invalidPostalCode');
        }
        if (isEmpty(address.city)) {
          setError(section, 'businessAddress.city', 'required');
        }
      }
      break;

    case 9: // Signature Step (Final Step)
      const sig = formData.signature || {};
      section = 'signature';

      // Consent validation
      if (sig.acceptTerms !== true) {
        setError(section, 'acceptTerms', 'required');
      }

      // Digital Signature validation
      if (isEmpty(sig.fullName)) {
        setError(section, 'fullName', 'required');
      }
      if (isEmpty(sig.date)) {
        setError(section, 'date', 'required');
      } else if (!isValidDate(sig.date)) {
        setError(section, 'date', 'invalidDate');
      }
      if (sig.confirmSignature !== true) {
        setError(section, 'confirmSignature', 'required');
      }

      // Data Protection validation
      if (sig.acceptDataProtection !== true) {
        setError(section, 'acceptDataProtection', 'required');
      }
      break;

    // Add other step validations here
    default:
      break;
  }

  console.log('Validation Errors:', errors);
  return errors;
}; 