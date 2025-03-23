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
        }
      }
      
      return newData;
    });
  };

  // Handle next button click
  const handleNext = () => {
    // Always validate the entire form before proceeding
    const errors = validateTaxForm(formData, currentStep);
    setValidationErrors(errors);
    setShowValidationErrors(true);
    
    // Special handling for children validation when hasChildren is checked
    if (currentStep === 0 && formData.personalInfo.hasChildren) {
      // Check if children array exists and has valid entries
      const hasValidChildren = Array.isArray(formData.personalInfo.children) && 
                              formData.personalInfo.children.length > 0 &&
                              formData.personalInfo.children.every(child => 
                                child.firstName && 
                                child.lastName && 
                                child.dateOfBirth && 
                                child.taxId);
      
      if (!hasValidChildren) {
        // Add children validation errors
        setValidationErrors(prev => {
          const updatedErrors = {...prev};
          if (!updatedErrors.personalInfo) {
            updatedErrors.personalInfo = {};
          }
          
          updatedErrors.personalInfo.children = formData.personalInfo.children?.map(child => ({
            firstName: !child.firstName,
            lastName: !child.lastName,
            dateOfBirth: !child.dateOfBirth,
            taxId: !child.taxId
          })) || [{ firstName: true, lastName: true, dateOfBirth: true, taxId: true }];
          
          return updatedErrors;
        });
        return; // Don't proceed if children validation fails
      }
    }
    
    // Check if current step has validation errors
    const hasErrors = hasErrorsInCurrentStep(errors);
    console.log(`Step ${currentStep} validation result:`, { hasErrors });
    
    // If there are errors, don't proceed
    if (hasErrors) {
      console.log(`Cannot proceed from step ${currentStep} due to validation errors`);
      return;
    }
    
    // If valid, proceed to next step
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setShowValidationErrors(false); // Reset validation errors display for next step
    }
  };

  // Helper function to check if current step has errors
  const hasErrorsInCurrentStep = (errors: Record<string, any> | null): boolean => {
    if (!errors) return false;
    
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
        // Check if the mandatory question is answered
        if (formData.incomeInfo.isEmployed === undefined) {
          console.log('Employment validation: isEmployed is undefined');
          return true;
        }
        
        // If employed, check other required fields
        if (formData.incomeInfo.isEmployed) {
          const employmentFields = [
            'employer', 'employmentIncome', 'grossAnnualSalary', 'hasTaxCertificate', 'hasTravelSubsidy'
          ];
          // Add taxCertificateFile if hasTaxCertificate is true
          if (formData.incomeInfo.hasTaxCertificate) {
            employmentFields.push('taxCertificateFile');
          }
          
          const employmentHasErrors = hasErrorsInSection(errors, 'incomeInfo', employmentFields);
          console.log('Employment validation:', { employmentHasErrors });
          return !!employmentHasErrors;
        }
        
        return false;
        
      case 3: // Business
        // Check if the mandatory question is answered
        if (formData.incomeInfo.isBusinessOwner === undefined) {
          console.log('Business validation: isBusinessOwner is undefined');
          return true;
        }
        
        // If business owner, check other required fields
        if (formData.incomeInfo.isBusinessOwner) {
          const businessFields = [
            'businessType', 'businessEarnings', 'businessExpenses'
          ];
          const businessHasErrors = hasErrorsInSection(errors, 'incomeInfo', businessFields);
          console.log('Business validation:', { businessHasErrors });
          return !!businessHasErrors;
        }
        
        return false;
        
      case 4: // Investments
        // Check if the mandatory question is answered
        if (formData.incomeInfo.hasStockIncome === undefined) {
          console.log('Investments validation: hasStockIncome is undefined');
          return true;
        }
        
        // If has stock income, check other required fields
        if (formData.incomeInfo.hasStockIncome) {
          const investmentFields = [
            'dividendEarnings', 'hasBankCertificate', 'hasStockSales'
          ];
          
          // Add bankCertificateFile if hasBankCertificate is true
          if (formData.incomeInfo.hasBankCertificate) {
            investmentFields.push('bankCertificateFile');
          }
          
          // Add stockProfitLoss if hasStockSales is true
          if (formData.incomeInfo.hasStockSales) {
            investmentFields.push('stockProfitLoss');
          }
          
          // Add foreign stock fields if hasForeignStocks is true
          if (formData.incomeInfo.hasForeignStocks) {
            investmentFields.push('foreignTaxPaid', 'foreignTaxCertificateFile');
          }
          
          const investmentsHasErrors = hasErrorsInSection(errors, 'incomeInfo', investmentFields);
          console.log('Investments validation:', { investmentsHasErrors });
          return !!investmentsHasErrors;
        }
        
        return false;
        
      case 5: // Rental
        // Check if the mandatory question is answered
        if (formData.incomeInfo.hasRentalProperty === undefined) {
          console.log('Rental validation: hasRentalProperty is undefined');
          return true;
        }
        
        // If has rental property, check other required fields
        if (formData.incomeInfo.hasRentalProperty) {
          const rentalFields = [
            'rentalIncome', 'rentalCosts'
          ];
          
          // Check if rentalPropertyAddress has errors
          const rentalAddressHasErrors = errors.incomeInfo && 
                                        errors.incomeInfo.rentalPropertyAddress && 
                                        Object.values(errors.incomeInfo.rentalPropertyAddress).some(error => !!error);
          
          const rentalFieldsHaveErrors = hasErrorsInSection(errors, 'incomeInfo', rentalFields);
          
          console.log('Rental validation:', { rentalFieldsHaveErrors, rentalAddressHasErrors });
          return !!(rentalFieldsHaveErrors || rentalAddressHasErrors);
        }
        
        return false;
        
      case 6: // Foreign Income
        // Check if the mandatory question is answered
        if (formData.incomeInfo.hasForeignIncome === undefined) {
          console.log('Foreign Income validation: hasForeignIncome is undefined');
          return true;
        }
        
        // If has foreign income, check other required fields
        if (formData.incomeInfo.hasForeignIncome) {
          const foreignFields = [
            'foreignIncomeCountry', 'foreignIncomeType', 'foreignIncomeAmount', 
            'foreignIncomeTaxPaid', 'foreignIncomeTaxCertificateFile'
          ];
          const foreignHasErrors = hasErrorsInSection(errors, 'incomeInfo', foreignFields);
          console.log('Foreign Income validation:', { foreignHasErrors });
          return !!foreignHasErrors;
        }
        
        return false;
        
      case 7: // Review
        return false; // No validation needed for review step
        
      case 8: // Signature
        return false; // No validation needed for signature step
        
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
        return !!sectionErrors[field];
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
    const errors = validateTaxForm(formData, currentStep);
    setValidationErrors(errors);
    
    if (errors) {
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
        clientId: effectiveClientId
      };

      // Submit the form, passing the partnerId separately to the service function
      const formId = await saveTaxReturnForm(formDataWithIds, effectivePartnerId);
      
      setFormData(prev => ({
        ...prev,
        id: formId,
        status: 'submitted',
        updatedAt: new Date().toISOString()
      }));
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      let errorMessage = 'There was an error submitting your form. Please try again.';
      
      if (error instanceof Error) {
        errorMessage += ' Details: ' + error.message;
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get input class based on validation errors
  const hasError = (section: string, field: string): boolean => {
    if (!validationErrors || !showValidationErrors) return false;
    
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
  