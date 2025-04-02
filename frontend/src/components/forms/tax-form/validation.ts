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

// --- Main Validation Function ---
export const validateTaxForm = (
  formData: any,
  step: number,
  i18n: any
): ValidationErrors => {
  const errors: ValidationErrors = {};
  const validationMessages = i18n?.validation || {};

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
      const section = 'personalInfo';

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

    // Add other step validations here
    default:
      break;
  }

  console.log('Validation Errors:', errors);
  return errors;
}; 