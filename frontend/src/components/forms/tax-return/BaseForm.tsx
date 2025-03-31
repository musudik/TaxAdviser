import React, { useState, useEffect } from 'react';
import { saveTaxReturnForm } from '../../../db-services/lib/taxReturnService';
import { exportTaxReturnToPdf } from './utils/pdfExport';
import BusinessStep from './steps/BusinessStep';
import EmploymentStep from './steps/EmploymentStep';
import ExpensesStep from './steps/ExpensesStep';
import ForeignIncomeStep from './steps/ForeignIncomeStep';
import InvestmentsStep from './steps/InvestmentsStep';
import PersonalInfoStep from './steps/PersonalInfoStep';
import RentalStep from './steps/RentalStep';
import ReviewStep from './steps/ReviewStep';
import SignatureStep from './steps/SignatureStep';
import { TaxFormData, initialTaxFormData, Address } from './taxTypes';
import { validateTaxForm } from './validation';
import { useLocation } from 'react-router-dom';
import languageData from './i18n/language.json';

// Simple FormTemplate component
const FormTemplate = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
      {children}
    </div>
  );
};

// Simple Button component
const Button = ({ 
  children, 
  onClick, 
  type = "button", 
  className = "", 
  disabled = false 
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  type?: "button" | "submit" | "reset"; 
  className?: string;
  disabled?: boolean;
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md transition-colors ${className}`}
    >
      {children}
    </button>
  );
};

const TaxReturnForm: React.FC = () => {
  const location = useLocation();
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [formData, setFormData] = useState<TaxFormData>(initialTaxFormData);
  const [currentStep, setCurrentStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState<Record<string, any> | null>(null);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Define steps
  const steps = [
    { name: 'Personal Info', component: PersonalInfoStep },
    { name: 'Expenses & Deductions', component: ExpensesStep },
    { name: 'Employment Income', component: EmploymentStep },
    { name: 'Business Income', component: BusinessStep },
    { name: 'Investments', component: InvestmentsStep },
    { name: 'Rental Income', component: RentalStep },
    { name: 'Foreign Income', component: ForeignIncomeStep },
    { name: 'Review', component: ReviewStep },
    { name: 'Sign & Submit', component: SignatureStep }
  ];

  // Extract partnerId and clientId from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const partnerParam = params.get('partner');
    const clientParam = params.get('client');

    console.log('URL Parameters:', { partnerParam, clientParam });

    // Set the partner and client IDs, even if they're null
    // The form will handle missing IDs during submission
    setPartnerId(partnerParam);
    setClientId(clientParam);
  }, [location.search]);

  // Handle form field changes
  const handleChange = (section: keyof TaxFormData, field: string, value: any) => {
    setFormData(prevData => {
      // Create a deep copy of the previous data
      const newData = JSON.parse(JSON.stringify(prevData)) as TaxFormData;
      
      // Special handling for address changes to ensure they are properly updated
      if (section === 'personalInfo' && field.startsWith('address.')) {
        const addressField = field.split('.')[1];
        
        // Update the specific address field based on the field name
        switch (addressField) {
          case 'street':
            newData.personalInfo.address.street = value;
            break;
          case 'houseNumber':
            newData.personalInfo.address.houseNumber = value;
            break;
          case 'postalCode':
            newData.personalInfo.address.postalCode = value;
            break;
          case 'city':
            newData.personalInfo.address.city = value;
            break;
          default:
            console.warn(`Unknown address field: ${addressField}`);
            return prevData; // Don't update if field is unknown
        }
        
        return newData;
      }
      
      // Handle children array updates
      if (section === 'personalInfo' && field.startsWith('children.')) {
        const parts = field.split('.');
        if (parts.length === 3) {
          const index = parseInt(parts[1]);
          const childField = parts[2];
          
          if (!isNaN(index) && Array.isArray(newData.personalInfo.children) && 
              index >= 0 && index < newData.personalInfo.children.length) {
            
            // Update the specific child field (firstName, lastName, etc.)
            newData.personalInfo.children[index] = {
              ...newData.personalInfo.children[index],
              [childField]: value
            };
            
            console.log(`Updating child[${index}].${childField} to:`, value);
            return newData;
          }
        }
      }
      
      // Handle other nested fields with dot notation (e.g., 'address.street')
      if (field.includes('.')) {
        const [parentField, childField] = field.split('.');
        
        // Handle nested fields based on the section and parent field
        if (section === 'personalInfo') {
          if (parentField === 'address' && childField) {
            // Handle address fields
            switch (childField) {
              case 'street':
                newData.personalInfo.address.street = value;
                break;
              case 'houseNumber':
                newData.personalInfo.address.houseNumber = value;
                break;
              case 'postalCode':
                newData.personalInfo.address.postalCode = value;
                break;
              case 'city':
                newData.personalInfo.address.city = value;
                break;
              default:
                console.warn(`Unknown address field: ${childField}`);
                return prevData;
            }
          }
        } else if (section === 'incomeInfo') {
          // Handle incomeInfo nested fields
          if (parentField === 'rentalPropertyAddress' && childField) {
            // Handle rental property address fields
            switch (childField) {
              case 'street':
                newData.incomeInfo.rentalPropertyAddress.street = value;
                break;
              case 'houseNumber':
                newData.incomeInfo.rentalPropertyAddress.houseNumber = value;
                break;
              case 'postalCode':
                newData.incomeInfo.rentalPropertyAddress.postalCode = value;
                break;
              case 'city':
                newData.incomeInfo.rentalPropertyAddress.city = value;
                break;
              default:
                console.warn(`Unknown rental address field: ${childField}`);
                return prevData;
            }
          }
        }
      } else {
        // For simple fields, update directly based on the section
        if (section === 'personalInfo') {
          // @ts-ignore - We know these fields exist
          newData.personalInfo[field] = value;
        } else if (section === 'incomeInfo') {
          // @ts-ignore - We know these fields exist
          newData.incomeInfo[field] = value;
        } else if (section === 'deductions') {
          // @ts-ignore - We know these fields exist
          newData.deductions[field] = value;
        } else if (section === 'taxCredits') {
          // @ts-ignore - We know these fields exist
          newData.taxCredits[field] = value;
        } else if (section === 'signature') {
          // Special handling for signature section
          if (field === '') {
            // If field is empty, replace the entire signature object
            newData.signature = value;
          } else if (newData.signature) {
            // Otherwise, update a specific field in the signature object
            newData.signature = {
              ...newData.signature,
              [field]: value
            };
          } else {
            // If signature object doesn't exist yet, create it with the field
            newData.signature = {
              place: field === 'place' ? value : '',
              date: field === 'date' ? value : '',
              signature: field === 'signature' ? value : ''
            };
          }
        }
      }
      
      return newData;
    });
  };

  // Handle next button click
  const handleNext = () => {
    // Validate current step
    const errors = validateTaxForm(formData, currentStep);
    
    // Update validation errors state
    setValidationErrors(errors);
    setShowValidationErrors(true);
    
    // Check if there are any errors in the current step
    const hasStepErrors = hasErrorsInCurrentStep(errors);
    console.log('Step Validation:', { currentStep, hasErrors: hasStepErrors, errors });
    
    if (!hasStepErrors) {
      // If moving to signature step, initialize signature object if needed
      if (currentStep === 7 && !formData.signature) {
        setFormData(prev => ({
          ...prev,
          signature: {
            place: '',
            date: '',
            signature: ''
          }
        }));
      }
      
      // Move to next step
      setCurrentStep(currentStep + 1);
    }
  };

  // Helper function to check if current step has errors
  const hasErrorsInCurrentStep = (errors: Record<string, any> | null): boolean => {
    if (!errors) return false;
    
    console.log('currentStep:', currentStep);
    switch (currentStep) {
      case 0: // Personal Info
        const personalInfoHasErrors = Object.entries(errors.personalInfo || {}).some(([key, value]) => {
          // Skip children array when checking general personalInfo errors
          if (key === 'children') return false;
          
          // For nested objects (like address)
          if (typeof value === 'object' && value !== null) {
            return Object.values(value).some(v => !!v);
          }
          return !!value;
        });
        
        // Separately check for children errors - only when hasChildren is true
        let childrenHasErrors = false;
        if (formData.personalInfo.hasChildren === true && 
            errors.personalInfo && 
            errors.personalInfo.children) {
          
          // Go through each child's errors and check if any are true
          childrenHasErrors = Object.values(errors.personalInfo.children).some(childErrors => {
            return Object.values(childErrors as Record<string, boolean>).some(error => !!error);
          });
        }
        
        console.log('Personal Info validation:', { personalInfoHasErrors, childrenHasErrors });
        return !!(personalInfoHasErrors || childrenHasErrors);
        
      case 1: // Expenses
        const deductionsHasErrors = hasErrorsInSection(errors, 'deductions');
        console.log('Deductions validation:', { deductionsHasErrors });
        return !!deductionsHasErrors;
        
      case 2: // Employment
        // First check if isEmployed is undefined or null
        if (formData.incomeInfo.isEmployed === undefined || formData.incomeInfo.isEmployed === null) {
          console.log('Employment validation: isEmployed is undefined/null');
          return true;
        }
        
        // If employed, check all required fields
        if (formData.incomeInfo.isEmployed) {
          const employmentFields = ['employer', 'employmentIncome'];

          // Check hasTaxCertificate is answered
          if (formData.incomeInfo.hasTaxCertificate === undefined || formData.incomeInfo.hasTaxCertificate === null) {
            console.log('Employment validation: hasTaxCertificate is undefined/null');
            return true;
          }
          
          // Add taxCertificateFile validation if hasTaxCertificate is true
          if (formData.incomeInfo.hasTaxCertificate) {
            employmentFields.push('taxCertificateFile');
          }
          
          // Check hasTravelSubsidy is answered
          if (formData.incomeInfo.hasTravelSubsidy === undefined || formData.incomeInfo.hasTravelSubsidy === null) {
            console.log('Employment validation: hasTravelSubsidy is undefined/null');
            return true;
          }
          
          // Add travelDistance validation if hasTravelSubsidy is true
          if (formData.incomeInfo.hasTravelSubsidy) {
            employmentFields.push('travelDistance');
          }
          
          const employmentHasErrors = hasErrorsInSection(errors, 'incomeInfo', employmentFields);
          console.log('Employment validation:', { employmentHasErrors });
          return !!employmentHasErrors;
        }
        
        return false;
        
      case 3: // Business
        // First check if isBusinessOwner is answered
        if (formData.incomeInfo.isBusinessOwner === undefined || formData.incomeInfo.isBusinessOwner === null) {
          console.log('Business validation: isBusinessOwner is undefined/null');
          return true;
        }
        
        // If business owner, check required fields
        if (formData.incomeInfo.isBusinessOwner) {
          const businessFields = ['businessType', 'businessEarnings', 'businessExpenses'];
          const businessHasErrors = hasErrorsInSection(errors, 'incomeInfo', businessFields);
          console.log('Business validation:', { businessHasErrors });
          return !!businessHasErrors;
        }
        
        return false;
      case 4: // Investments
        // First check if hasStockIncome is answered
        if (formData.incomeInfo.hasStockIncome === undefined || formData.incomeInfo.hasStockIncome === null) {
          console.log('Investments validation: hasStockIncome is undefined/null');
          return true;
        }
        
        // If has stock income, check required fields
        if (formData.incomeInfo.hasStockIncome) {
          // First check the basic investment fields
          let investmentFieldsHaveErrors = false;
          
          // Dividend earnings must be provided and valid
          if (formData.incomeInfo.dividendEarnings === undefined || 
              formData.incomeInfo.dividendEarnings === null || 
              Number(formData.incomeInfo.dividendEarnings) < 0) {
            console.log('Investments validation: dividendEarnings is invalid');
            investmentFieldsHaveErrors = true;
          }
          
          // Check hasBankCertificate is answered
          if (formData.incomeInfo.hasBankCertificate === undefined || formData.incomeInfo.hasBankCertificate === null) {
            console.log('Investments validation: hasBankCertificate is undefined/null');
            return true;
          }
          
          // Add bankCertificateFile validation if hasBankCertificate is true
          if (formData.incomeInfo.hasBankCertificate && !formData.incomeInfo.bankCertificateFile) {
            console.log('Investments validation: bankCertificateFile is missing');
            investmentFieldsHaveErrors = true;
          }
          
          // Check hasStockSales is answered
          if (formData.incomeInfo.hasStockSales === undefined || formData.incomeInfo.hasStockSales === null) {
            console.log('Investments validation: hasStockSales is undefined/null');
            return true;
          }
          
          // Add stockProfitLoss if hasStockSales is true
          if (formData.incomeInfo.hasStockSales && formData.incomeInfo.stockProfitLoss === undefined) {
            console.log('Investments validation: stockProfitLoss is missing');
            investmentFieldsHaveErrors = true;
          }
          
          // Check hasForeignStocks is answered
          if (formData.incomeInfo.hasForeignStocks === undefined || formData.incomeInfo.hasForeignStocks === null) {
            console.log('Investments validation: hasForeignStocks is undefined/null');
            return true;
          }
          
          // Add foreign stock fields if hasForeignStocks is true
          if (formData.incomeInfo.hasForeignStocks) {
            if (formData.incomeInfo.foreignTaxPaid === undefined || 
                formData.incomeInfo.foreignTaxPaid === null ||
                Number(formData.incomeInfo.foreignTaxPaid) < 0) {
              console.log('Investments validation: foreignTaxPaid is invalid');
              investmentFieldsHaveErrors = true;
            }
            
            if (!formData.incomeInfo.foreignTaxCertificateFile) {
              console.log('Investments validation: foreignTaxCertificateFile is missing');
              investmentFieldsHaveErrors = true;
            }
          }
          
          console.log('Investments validation result:', { investmentFieldsHaveErrors });
          return investmentFieldsHaveErrors;
        }
        
        return false;
        
      case 5: // Rental
        // First check if hasRentalProperty is answered
        if (formData.incomeInfo.hasRentalProperty === undefined || formData.incomeInfo.hasRentalProperty === null) {
          console.log('Rental validation: hasRentalProperty is undefined/null');
          return true;
        }
        
        // If has rental property, check required fields
        if (formData.incomeInfo.hasRentalProperty) {
          const rentalFields = ['rentalIncome', 'rentalCosts'];
          
          // Check rental property address fields
          const rentalAddressHasErrors = !formData.incomeInfo.rentalPropertyAddress ||
            !formData.incomeInfo.rentalPropertyAddress.street ||
            !formData.incomeInfo.rentalPropertyAddress.houseNumber ||
            !formData.incomeInfo.rentalPropertyAddress.postalCode ||
            !formData.incomeInfo.rentalPropertyAddress.city;
          
          const rentalFieldsHaveErrors = hasErrorsInSection(errors, 'incomeInfo', rentalFields);
          
          console.log('Rental validation:', { rentalFieldsHaveErrors, rentalAddressHasErrors });
          return !!(rentalFieldsHaveErrors || rentalAddressHasErrors);
        }
        
        return false;
        
      case 6: // Foreign Income
        // First check if hasForeignIncome is answered
        if (formData.incomeInfo.hasForeignIncome === undefined || formData.incomeInfo.hasForeignIncome === null) {
          console.log('Foreign Income validation: hasForeignIncome is undefined/null');
          return true;
        }
        
        // If has foreign income, check required fields
        if (formData.incomeInfo.hasForeignIncome) {
          const foreignFields = [
            'foreignIncomeCountry',
            'foreignIncomeType',
            'foreignIncomeAmount',
            'foreignIncomeTaxPaid',
            'foreignIncomeTaxCertificateFile'
          ];
          const foreignHasErrors = hasErrorsInSection(errors, 'incomeInfo', foreignFields);
          console.log('Foreign Income validation:', { foreignHasErrors });
          return !!foreignHasErrors;
        }
        
        return false;
        
      case 7: // Review
        // No validation needed for review step
        return false;
        
      case 8: // Signature
        // Check all signature fields are filled
        const signatureFields = ['place', 'date', 'signature'];
        const signatureHasErrors = signatureFields.some(field => 
          !formData.signature?.[field as keyof typeof formData.signature]
        );
        console.log('Signature validation:', { signatureHasErrors });
        return signatureHasErrors;
        
      default:
        return false;
    }
  };

  // Modified helper function to check if a section has errors
  const hasErrorsInSection = (errors: Record<string, any> | null, section: string, fields?: string[]): boolean => {
    if (!errors || !errors[section]) return false;
    
    const sectionErrors = errors[section];
    
    // If specific fields are provided, check only those fields
    if (fields) {
      return fields.some(field => {
        // Handle nested fields (e.g., 'rentalPropertyAddress.street')
        if (field.includes('.')) {
          const [parentField, childField] = field.split('.');
          return sectionErrors[parentField] && sectionErrors[parentField][childField];
        }
        
        // Direct form data validation for empty or invalid fields (even if validation errors don't exist yet)
        if (section === 'incomeInfo') {
          // Primary validation for Employment Step
          if (field === 'employer' && formData.incomeInfo.isEmployed) {
            return !formData.incomeInfo.employer || formData.incomeInfo.employer.trim() === '';
          }
          if (field === 'employmentIncome' && formData.incomeInfo.isEmployed) {
            return formData.incomeInfo.employmentIncome === undefined || 
                   formData.incomeInfo.employmentIncome === null || 
                   formData.incomeInfo.employmentIncome <= 0;
          }
          if (field === 'taxCertificateFile' && formData.incomeInfo.isEmployed && formData.incomeInfo.hasTaxCertificate) {
            return !formData.incomeInfo.taxCertificateFile;
          }
          if (field === 'travelDistance' && formData.incomeInfo.isEmployed && formData.incomeInfo.hasTravelSubsidy) {
            return formData.incomeInfo.travelDistance === undefined ||
                   formData.incomeInfo.travelDistance === null ||
                   formData.incomeInfo.travelDistance <= 0;
          }
          
          // Primary validation for Business Step
          if (field === 'businessType' && formData.incomeInfo.isBusinessOwner) {
            return !formData.incomeInfo.businessType || formData.incomeInfo.businessType.trim() === '';
          }
          if (field === 'businessEarnings' && formData.incomeInfo.isBusinessOwner) {
            return formData.incomeInfo.businessEarnings === undefined ||
                   formData.incomeInfo.businessEarnings === null ||
                   formData.incomeInfo.businessEarnings < 0;
          }
          if (field === 'businessExpenses' && formData.incomeInfo.isBusinessOwner) {
            return formData.incomeInfo.businessExpenses === undefined ||
                   formData.incomeInfo.businessExpenses === null ||
                   formData.incomeInfo.businessExpenses < 0;
          }
          
          // Primary validation for Investments Step
          if (field === 'dividendEarnings' && formData.incomeInfo.hasStockIncome) {
            return formData.incomeInfo.dividendEarnings === undefined ||
                   formData.incomeInfo.dividendEarnings === null ||
                   formData.incomeInfo.dividendEarnings < 0;
          }
          if (field === 'bankCertificateFile' && formData.incomeInfo.hasStockIncome && formData.incomeInfo.hasBankCertificate) {
            return !formData.incomeInfo.bankCertificateFile;
          }
          if (field === 'stockProfitLoss' && formData.incomeInfo.hasStockIncome && formData.incomeInfo.hasStockSales) {
            return formData.incomeInfo.stockProfitLoss === undefined;
          }
          if (field === 'foreignTaxPaid' && formData.incomeInfo.hasStockIncome && formData.incomeInfo.hasForeignStocks) {
            return formData.incomeInfo.foreignTaxPaid === undefined ||
                   formData.incomeInfo.foreignTaxPaid === null ||
                   formData.incomeInfo.foreignTaxPaid < 0;
          }
          if (field === 'foreignTaxCertificateFile' && formData.incomeInfo.hasStockIncome && formData.incomeInfo.hasForeignStocks) {
            return !formData.incomeInfo.foreignTaxCertificateFile;
          }
          
          // Primary validation for Rental Step
          if (field === 'rentalIncome' && formData.incomeInfo.hasRentalProperty) {
            return formData.incomeInfo.rentalIncome === undefined ||
                   formData.incomeInfo.rentalIncome === null ||
                   formData.incomeInfo.rentalIncome < 0;
          }
          if (field === 'rentalCosts' && formData.incomeInfo.hasRentalProperty) {
            return formData.incomeInfo.rentalCosts === undefined ||
                   formData.incomeInfo.rentalCosts === null ||
                   formData.incomeInfo.rentalCosts < 0;
          }
          
          // Primary validation for Foreign Income Step
          if (field === 'foreignIncomeCountry' && formData.incomeInfo.hasForeignIncome) {
            return !formData.incomeInfo.foreignIncomeCountry || formData.incomeInfo.foreignIncomeCountry.trim() === '';
          }
          if (field === 'foreignIncomeType' && formData.incomeInfo.hasForeignIncome) {
            return !formData.incomeInfo.foreignIncomeType || formData.incomeInfo.foreignIncomeType.trim() === '';
          }
          if (field === 'foreignIncomeAmount' && formData.incomeInfo.hasForeignIncome) {
            return formData.incomeInfo.foreignIncomeAmount === undefined ||
                   formData.incomeInfo.foreignIncomeAmount === null ||
                   formData.incomeInfo.foreignIncomeAmount < 0;
          }
          if (field === 'foreignIncomeTaxPaid' && formData.incomeInfo.hasForeignIncome) {
            return formData.incomeInfo.foreignIncomeTaxPaid === undefined ||
                   formData.incomeInfo.foreignIncomeTaxPaid === null ||
                   formData.incomeInfo.foreignIncomeTaxPaid < 0;
          }
          if (field === 'foreignIncomeTaxCertificateFile' && formData.incomeInfo.hasForeignIncome) {
            return !formData.incomeInfo.foreignIncomeTaxCertificateFile;
          }
        }
        
        // Deductions validation (expenses step)
        if (section === 'deductions') {
          // Handle numeric fields that should be ≥ 0
          const numericFields = [
            'commutingExpenses', 'businessTripsCosts', 'workEquipment', 'homeOfficeAllowance',
            'membershipFees', 'applicationCosts', 'doubleHouseholdCosts', 'churchTax',
            'donationsAndFees', 'childcareCosts', 'supportPayments', 'privateSchoolFees',
            'retirementProvisions', 'otherInsuranceExpenses', 'professionalTrainingCosts',
            'medicalExpenses', 'rehabilitationCosts', 'careCosts', 'disabilityExpenses',
            'funeralCosts', 'relativesSupportCosts', 'divorceCosts', 'statutoryHealthInsurance',
            'privateHealthInsurance', 'statutoryPensionInsurance', 'privatePensionInsurance',
            'unemploymentInsurance', 'accidentLiabilityInsurance', 'disabilityInsurance',
            'termLifeInsurance', 'householdServices', 'craftsmenServices', 'gardeningServices',
            'cleaningServices', 'caretakerServices', 'householdCareCosts', 'householdSupportServices',
            'chimneySweepFees', 'emergencySystemCosts'
          ];
          
          if (numericFields.includes(field)) {
            const value = formData.deductions[field as keyof typeof formData.deductions];
            if (value !== undefined && value !== null) {
              return (value as number) < 0;
            }
          }
          
          // Craftsmen services
          if (field === 'craftsmenAmount' && formData.deductions.hasCraftsmenPayments) {
            return formData.deductions.craftsmenAmount === undefined ||
                  formData.deductions.craftsmenAmount === null ||
                  formData.deductions.craftsmenAmount < 0;
          }
          if (field === 'craftsmenInvoiceFile' && formData.deductions.hasCraftsmenPayments) {
            return !formData.deductions.craftsmenInvoiceFile;
          }
          
          // Maintenance payments
          if (field === 'maintenanceRecipient' && formData.deductions.hasMaintenancePayments) {
            return !formData.deductions.maintenanceRecipient || formData.deductions.maintenanceRecipient.trim() === '';
          }
          if (field === 'maintenanceAmount' && formData.deductions.hasMaintenancePayments) {
            return formData.deductions.maintenanceAmount === undefined ||
                  formData.deductions.maintenanceAmount === null ||
                  formData.deductions.maintenanceAmount < 0;
          }
          
          // Special expenses
          if (field === 'specialExpensesType' && formData.deductions.hasSpecialExpensesDetailed) {
            return !formData.deductions.specialExpensesType || formData.deductions.specialExpensesType.trim() === '';
          }
          if (field === 'specialExpensesAmount' && formData.deductions.hasSpecialExpensesDetailed) {
            return formData.deductions.specialExpensesAmount === undefined ||
                  formData.deductions.specialExpensesAmount === null ||
                  formData.deductions.specialExpensesAmount < 0;
          }
          
          // Private insurance
          if (field === 'insuranceTypes' && formData.deductions.hasPrivateInsurance) {
            return !formData.deductions.insuranceTypes || formData.deductions.insuranceTypes.trim() === '';
          }
          if (field === 'insuranceContributions' && formData.deductions.hasPrivateInsurance) {
            return formData.deductions.insuranceContributions === undefined ||
                  formData.deductions.insuranceContributions === null ||
                  formData.deductions.insuranceContributions < 0;
          }
        }
        
        // Validation for signature step
        if (section === 'signature') {
          if (field === 'place') {
            return !formData.signature?.place || formData.signature.place.trim() === '';
          }
          if (field === 'date') {
            return !formData.signature?.date;
          }
          if (field === 'signature') {
            return !formData.signature?.signature;
          }
        }
          
        // Look for errors in validationErrors if they exist
        const sectionErrors = validationErrors?.[section];
        if (sectionErrors) {
          // If fields are provided, check only those fields
          if (fields) {
            return fields.some(field => {
              const fieldError = sectionErrors[field];
              return !!fieldError;
            });
          }
          
          // Otherwise check all fields in the section
          if (typeof sectionErrors === 'object') {
            return Object.keys(sectionErrors).some(key => sectionErrors[key]);
          }
          
          return !!sectionErrors;
        }
        
        return false;
      });
    }
    
    // Otherwise check all fields in the section
    if (typeof sectionErrors === 'object') {
      return Object.keys(sectionErrors).some(key => {
        // Skip the children field in personalInfo when not explicitly checking for it
        if (section === 'personalInfo' && key === 'children') {
          return false;
        }
        
        const error = sectionErrors[key];
        if (typeof error === 'object' && error !== null) {
          // For nested objects, check if any of their values are true
          return Object.values(error).some(nestedError => !!nestedError);
        }
        return !!error;
      });
    }
    
    return !!sectionErrors;
  };

  // Handle previous button click
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowValidationErrors(false); // Reset validation errors display for previous step
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Create a fresh validation check for the signature step
    const errors = validateTaxForm(formData, 8); // 8 is the signature step index
    setValidationErrors(errors);
    
    // Check specifically for signature field errors
    const hasSignatureErrors = formData.signature === null ||
      !formData.signature.place ||
      !formData.signature.date ||
      !formData.signature.signature;
    
    console.log('Submission validation:', { hasSignatureErrors, signature: formData.signature });
    
    if (hasSignatureErrors) {
      setShowValidationErrors(true);
      return;
    }

    // For development/testing, use a default partner ID and client ID if not present in URL
    const effectivePartnerId = partnerId || 'dev-partner-id';
    const effectiveClientId = clientId || 'dev-client-id';
    
    setIsSubmitting(true);
    
    try {
      // Create a copy of the form data with the clientId
      const formDataWithIds = {
        ...formData,
        clientId: effectiveClientId,
        submittedAt: new Date().toISOString()
      };

      // Submit the form, passing the partnerId separately to the service function
      const formId = await saveTaxReturnForm(formDataWithIds, effectivePartnerId);
      
      setFormData(prev => ({
        ...prev,
        id: formId,
        status: 'submitted',
        updatedAt: new Date().toISOString(),
        submittedAt: new Date().toISOString()
      }));
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Create a fallback ID for local usage
      const fallbackId = 'local-' + new Date().getTime();
      
      // Continue with local completion even if API submission fails
      setFormData(prev => ({
        ...prev,
        id: fallbackId,
        status: 'submitted',
        updatedAt: new Date().toISOString(),
        submittedAt: new Date().toISOString()
      }));
      
      // Show a user-friendly message but allow them to continue
      alert('Your tax return was completed but could not be saved to the server due to a network error. You can still download a PDF copy.');
      
      // Mark as submitted so user can still download the PDF
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get input class based on validation errors
  const hasError = (section: string, field: string): boolean => {
    // Check if validation errors should be shown
    if (!showValidationErrors) return false;
    
    // First, check for undefined/null values for key yes/no questions
    if (section === 'incomeInfo') {
      // Check for undefined radio button selections
      if (field === 'isEmployed' && formData.incomeInfo.isEmployed === undefined) {
        return true;
      }
      if (field === 'hasTaxCertificate' && formData.incomeInfo.isEmployed === true && 
          formData.incomeInfo.hasTaxCertificate === undefined) {
        return true;
      }
      if (field === 'hasTravelSubsidy' && formData.incomeInfo.isEmployed === true && 
          formData.incomeInfo.hasTravelSubsidy === undefined) {
        return true;
      }
      if (field === 'isBusinessOwner' && formData.incomeInfo.isBusinessOwner === undefined) {
        return true;
      }
      if (field === 'hasStockIncome' && formData.incomeInfo.hasStockIncome === undefined) {
        return true;
      }
      if (field === 'hasBankCertificate' && formData.incomeInfo.hasStockIncome === true && 
          formData.incomeInfo.hasBankCertificate === undefined) {
        return true;
      }
      if (field === 'hasStockSales' && formData.incomeInfo.hasStockIncome === true && 
          formData.incomeInfo.hasStockSales === undefined) {
        return true;
      }
      if (field === 'hasForeignStocks' && formData.incomeInfo.hasStockIncome === true && 
          formData.incomeInfo.hasForeignStocks === undefined) {
        return true;
      }
      if (field === 'hasRentalProperty' && formData.incomeInfo.hasRentalProperty === undefined) {
        return true;
      }
      if (field === 'hasForeignIncome' && formData.incomeInfo.hasForeignIncome === undefined) {
        return true;
      }
      
      // Direct form data validation for non-radio fields
      if (field === 'employer' && formData.incomeInfo.isEmployed === true) {
        return !formData.incomeInfo.employer || formData.incomeInfo.employer.trim() === '';
      }
      if (field === 'employmentIncome' && formData.incomeInfo.isEmployed === true) {
        return formData.incomeInfo.employmentIncome === undefined || 
              formData.incomeInfo.employmentIncome === null || 
              Number(formData.incomeInfo.employmentIncome) <= 0;
      }
      if (field === 'taxCertificateFile' && formData.incomeInfo.isEmployed === true && 
          formData.incomeInfo.hasTaxCertificate === true) {
        return !formData.incomeInfo.taxCertificateFile;
      }
      if (field === 'travelDistance' && formData.incomeInfo.isEmployed === true && 
          formData.incomeInfo.hasTravelSubsidy === true) {
        return formData.incomeInfo.travelDistance === undefined || 
              formData.incomeInfo.travelDistance === null || 
              Number(formData.incomeInfo.travelDistance) <= 0;
      }
    }
    
    if (section === 'personalInfo') {
      if (field === 'hasForeignResidence' && formData.personalInfo.hasForeignResidence === undefined) {
        return true;
      }
      if (field === 'hasChildren' && formData.personalInfo.hasChildren === undefined) {
        return true;
      }
      if (field === 'spouseHasIncome' && formData.personalInfo.maritalStatus === 'married' && 
          formData.personalInfo.spouseHasIncome === undefined) {
        return true;
      }
    }
    
    // Then check validation errors if they exist
    if (!validationErrors) return false;
    
    // Special handling for address fields
    if (field.startsWith('address.') && section === 'personalInfo') {
      const addressField = field.split('.')[1];
      // Check for errors in the address object
      return !!validationErrors.personalInfo?.address?.[addressField];
    }
    
    // Handle other nested fields
    if (field.includes('.')) {
      const [parentField, childField] = field.split('.');
      
      if (section === 'personalInfo' && parentField === 'children') {
        return false; // We handle children errors separately in PersonalInfoStep
      }
      
      return !!validationErrors[section]?.[parentField]?.[childField];
    }
    
    // Handle children errors which are now under personalInfo
    if (section === 'personalInfo' && field === 'children') {
      return !!validationErrors.personalInfo?.children &&
             Object.keys(validationErrors.personalInfo.children).length > 0;
    }
    
    return !!validationErrors[section]?.[field];
  };

  // Handle PDF export
  const handleExportPdf = () => {
    exportTaxReturnToPdf(formData);
  };

  // Render current step
  const renderStep = () => {
    const CurrentStep = steps[currentStep].component;
    
    return (
      <>
        <CurrentStep
          formData={formData}
          handleChange={handleChange}
          validationErrors={validationErrors}
          hasError={hasError}
          setFormData={setFormData}
          onFormDataChange={(updatedData) => setFormData(updatedData)}
          showValidationErrors={showValidationErrors}
          handleAddressChange={(field, value) => {
            // Create a copy of the current form data
            const updatedPersonalInfo = { ...formData.personalInfo };
            const updatedAddress = { ...updatedPersonalInfo.address };
            
            // Update the specific address field based on the field name
            switch (field) {
              case 'street':
                updatedAddress.street = value;
                break;
              case 'houseNumber':
                updatedAddress.houseNumber = value;
                break;
              case 'postalCode':
                updatedAddress.postalCode = value;
                break;
              case 'city':
                updatedAddress.city = value;
                break;
              default:
                console.warn(`Unknown address field: ${field}`);
                return; // Don't update if field is unknown
            }
            
            updatedPersonalInfo.address = updatedAddress;
            
            // Update the form data with the new personal info
            setFormData({
              ...formData,
              personalInfo: updatedPersonalInfo
            });
            
            // Log the update for debugging
            console.log(`Address field updated: ${field}=${value}`);
          }}
          getInputClass={() => "auth-input"}
        />
        
        {isSubmitted ? (
          <div className="text-center mt-6">
            <div className="mt-5 flex justify-center space-x-4">
              <Button
                onClick={handleExportPdf}
                className="auth-btn-secondary"
              >
                {languageData.de.common.exportPdf} / {languageData.en.common.exportPdf}
              </Button>
              <Button
                onClick={() => window.location.href = '/'}
                className="auth-btn"
              >
                Return to Home
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center mt-6 w-full">
            {currentStep > 0 ? (
              <Button
                onClick={handlePrevious}
                className="auth-btn-secondary"
                type="button"
              >
                {languageData.de.common.back} / {languageData.en.common.back}
              </Button>
            ) : (
              <div></div>
            )}
            
            <div className="flex space-x-4">
              {currentStep === steps.length - 1 ? (
                <>
                  <Button
                    onClick={handleExportPdf}
                    className="auth-btn-secondary"
                    type="button"
                  >
                    {languageData.de.common.exportPdf} / {languageData.en.common.exportPdf}
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="auth-btn"
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {isSubmitting ? 
                      `${languageData.de.common.submitting} / ${languageData.en.common.submitting}` : 
                      `${languageData.de.common.submit} / ${languageData.en.common.submit}`
                    }
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleNext}
                  className="auth-btn"
                  type="button"
                >
                  {languageData.de.common.next} / {languageData.en.common.next}
                </Button>
              )}
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <FormTemplate>
      {!isSubmitted && (
        <div className="mb-6">
          <div className="flex justify-between w-full mb-2">
            <span className="text-sm font-medium text-neutral-700">
              Step {currentStep + 1} of {steps.length} - {steps[currentStep].name}
            </span>
            <span className="text-sm text-neutral-500">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {renderStep()}
    </FormTemplate>
  );
};

export default TaxReturnForm;
  