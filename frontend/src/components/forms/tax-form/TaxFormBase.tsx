import React, { useState, useEffect } from 'react';
// Import step components
import TFPersonalInfo from './steps/TFPersonalInfo';
import TFIncomeInfo from './steps/TFIncomeInfo';
import TFRentalIncome from './steps/TFRentalIncome';
import TFForeignIncome from './steps/TFForeignIncome';
// Replace TFExpenses with the new split components
import TFWorkRelatedExpenses from './steps/TFWorkRelatedExpenses';
import TFSpecialExpenses from './steps/TFSpecialExpenses';
import TFExtraordinaryBurdens from './steps/TFExtraordinaryBurdens';
import TFCraftsmenServices from './steps/TFCraftsmenServices';
import TFBusinessExpenses from './steps/TFBusinessExpenses';
import TFReview from './steps/TFReview';
import TFSignature from './steps/TFSignature';
import { validateTaxForm, ValidationErrors } from './validation'; // Import validation
import { generateTaxFormPdf } from '../../../lib/generateTaxFormPdf'; // Import the new utility
import axios from 'axios'; // Add axios for API calls
import { toast } from 'react-toastify';

// Define a more specific type for form data later
interface TaxFormData {
  personalInfo?: any; // Define specific structure later
  incomeInfo?: any;
  // ... other sections
  [key: string]: any; // Allow other top-level keys for now
}

// Define structure for language JSON files
interface LanguageData {
  taxForm: { // Assuming top-level key matches the folder/content
    personalInfo: any; // Define specific structure later
    incomeInfo: any;
    expenses: any;
    // ... other sections
    [key: string]: any; // Allow indexing by string keys for steps
  };
}

// Extend LanguageData for the form title
interface AppLanguageData extends LanguageData {
  formTitle: string;
}

// Initial empty form data
const initialTaxFormData: TaxFormData = {
  personalInfo: {}, // Initialize sections to prevent errors
  incomeInfo: {},
  expenses: {},
  // ... other sections
};

// Reusable FormTemplate component (assuming similar styling needs)
const FormTemplate = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative w-full max-w-3xl mx-auto bg-white p-4 md:p-6 rounded-lg shadow-sm border border-neutral-200">
      {children}
    </div>
  );
};

// Reusable Button component (assuming similar styling needs)
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

// Add this helper function before the TaxFormBase component
const mockApiResponse = (data: any) => {
  return new Promise<{ data: any }>(resolve => {
    // Simulate network delay
    setTimeout(() => {
      resolve({ data });
    }, 500);
  });
};

// Simple function to generate random IDs instead of using uuid
function generateRandomId(length = 10) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Add this below the generateRandomId function
const MOCK_SIGNATURE_DATA = 'data:image/png;base64,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';

// Add this as a constant outside the component
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const TaxFormBase: React.FC = () => {
  const [formData, setFormData] = useState<TaxFormData>(initialTaxFormData);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'es' | 'fr' | 'it'>('en');
  const [i18nData, setI18nData] = useState<AppLanguageData | null>(null);
  const [germanI18nData, setGermanI18nData] = useState<AppLanguageData | null>(null);
  const [loadingLang, setLoadingLang] = useState(true);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors | null>(null);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [formId, setFormId] = useState<string | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null); // Added application ID
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Function to generate random alphanumeric application ID
  const generateApplicationId = (): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }; 

  // Effect to generate application ID on first render if not already set
  useEffect(() => {
    if (!applicationId) {
      setApplicationId(generateApplicationId());
    }
  }, []);

  // Check for applicationId in URL and load form if present
  useEffect(() => {
    const loadFormByApplicationId = async () => {
      const params = new URLSearchParams(window.location.search);
      const appId = params.get('applicationId');
      
      if (!appId) return; // No application ID in URL
      
      // Try to load from localStorage first if in development mode or configured to use localStorage
      if (import.meta.env.DEV || (import.meta.env.VITE_USE_LOCAL_STORAGE === 'true')) {
        const savedData = localStorage.getItem(`tax-form-${appId}`);
        
        if (savedData) {
          try {
            const parsedData = JSON.parse(savedData);
            console.log('Loaded form data from localStorage:', parsedData);
            
            // Extract form data from the saved data
            setFormData({
              personalInfo: parsedData.personalInfo || {},
              incomeInfo: parsedData.incomeInfo || {},
              rentalIncome: parsedData.rentalIncome || {},
              foreignIncome: parsedData.foreignIncome || {},
              workRelatedExpenses: parsedData.workRelatedExpenses || {},
              specialExpenses: parsedData.specialExpenses || {},
              extraordinaryBurdens: parsedData.extraordinaryBurdens || {},
              craftsmenServices: parsedData.craftsmenServices || {},
              businessExpenses: parsedData.businessExpenses || {},
              signature: parsedData.signature || {},
              placeAndDate: parsedData.placeAndDate || {}
            });
            
            setFormId(parsedData.id);
            setApplicationId(parsedData.applicationId);
            
            if (parsedData.currentStep !== undefined) {
              setCurrentStep(parsedData.currentStep);
            }
            
            toast.success(`Loaded form with Application ID: ${appId} (from local storage)`);
            return; // Exit early since we loaded from localStorage
          } catch (error) {
            console.error('Error parsing localStorage data:', error);
            // Continue to API call if localStorage parsing fails
          }
        }
      }
      
      // Try to load from the API if localStorage didn't work or if we're not in development mode
      try {
        // Real API call to get form data by application ID
        console.log(`Loading form with application ID: ${appId}`);
        const response = await axios.get(`${API_BASE_URL}/tax-forms/application/${appId}`);
        
        if (response.data) {
          console.log('Loaded form data:', response.data);
          
          // Extract the form data from the response
          const formDataFromResponse = { 
            personalInfo: response.data.personalInfo || {},
            incomeInfo: response.data.incomeInfo || {},
            rentalIncome: response.data.rentalIncome || {},
            foreignIncome: response.data.foreignIncome || {},
            workRelatedExpenses: response.data.workRelatedExpenses || {},
            specialExpenses: response.data.specialExpenses || {},
            extraordinaryBurdens: response.data.extraordinaryBurdens || {},
            craftsmenServices: response.data.craftsmenServices || {},
            businessExpenses: response.data.businessExpenses || {},
            signature: response.data.signature || {},
            placeAndDate: response.data.placeAndDate || {}
          };
          
          // Set form data, ID, and application ID
          setFormData(formDataFromResponse);
          setFormId(response.data.id);
          setApplicationId(response.data.applicationId);
          
          // Set current step (optional - could start from beginning)
          if (response.data.currentStep !== undefined) {
            setCurrentStep(response.data.currentStep);
          }
          
          // Show success message
          toast.success(`Successfully loaded form with Application ID: ${appId}`);
        }
      } catch (error) {
        console.error('Error loading form by application ID:', error);
        
        // Try to load from localStorage as fallback if API failed
        const savedData = localStorage.getItem(`tax-form-${appId}`);
        
        if (savedData) {
          try {
            const parsedData = JSON.parse(savedData);
            console.log('Loaded form data from localStorage (after API failure):', parsedData);
            
            // Extract form data from the saved data
            setFormData({
              personalInfo: parsedData.personalInfo || {},
              incomeInfo: parsedData.incomeInfo || {},
              rentalIncome: parsedData.rentalIncome || {},
              foreignIncome: parsedData.foreignIncome || {},
              workRelatedExpenses: parsedData.workRelatedExpenses || {},
              specialExpenses: parsedData.specialExpenses || {},
              extraordinaryBurdens: parsedData.extraordinaryBurdens || {},
              craftsmenServices: parsedData.craftsmenServices || {},
              businessExpenses: parsedData.businessExpenses || {},
              signature: parsedData.signature || {},
              placeAndDate: parsedData.placeAndDate || {}
            });
            
            setFormId(parsedData.id);
            setApplicationId(parsedData.applicationId);
            
            if (parsedData.currentStep !== undefined) {
              setCurrentStep(parsedData.currentStep);
            }
            
            toast.info(`Loaded form with Application ID: ${appId} (from local storage after API failure)`);
          } catch (localStorageError) {
            console.error('Error loading from localStorage after API failure:', localStorageError);
            toast.error('Could not find a form with the provided Application ID. Please check and try again.');
          }
        } else {
          // If no data in localStorage and API failed, create a new form with the given appId
          setApplicationId(appId);
          updateUrlWithApplicationId(appId);
          toast.info("Creating a new form with the provided Application ID");
        }
      }
    };
    
    loadFormByApplicationId();
  }, []);

  // Define steps with actual components - update with the new split steps
  const steps = [
    { name: 'Personal Info', component: TFPersonalInfo, key: 'personalInfo' },
    { name: 'Income Info', component: TFIncomeInfo, key: 'incomeInfo' },
    { name: 'Rental Income', component: TFRentalIncome, key: 'rentalIncome' },
    { name: 'Foreign Income', component: TFForeignIncome, key: 'foreignIncome' },
    { name: 'Work-Related Expenses', component: TFWorkRelatedExpenses, key: 'workRelatedExpenses' },
    { name: 'Special Expenses', component: TFSpecialExpenses, key: 'specialExpenses' },
    { name: 'Extraordinary Burdens', component: TFExtraordinaryBurdens, key: 'extraordinaryBurdens' },
    { name: 'Craftsmen Services', component: TFCraftsmenServices, key: 'craftsmenServices' },
    { name: 'Business Expenses', component: TFBusinessExpenses, key: 'businessExpenses' },
    { name: 'Review', component: TFReview, key: 'review' },
    { name: 'Signature', component: TFSignature, key: 'signature' }
  ];

  // Effect to load language files dynamically
  useEffect(() => {
    const loadLanguage = async () => {
      setLoadingLang(true);
      try {
        // Dynamically import the selected language file
        const langModule = await import(`./i18n/${selectedLanguage}.json`);
        setI18nData(langModule.default || langModule);

        // Always load German for the main labels
        if (!germanI18nData) {
          const germanModule = await import('./i18n/de.json');
          setGermanI18nData(germanModule.default || germanModule);
        }
      } catch (error) {
        console.error(`Failed to load language file: ${selectedLanguage}.json`, error);
        // Fallback or default language loading logic if needed
        if (!i18nData) { // Load English as fallback if primary fails
            try {
                const fallbackModule = await import('./i18n/en.json');
                setI18nData(fallbackModule.default || fallbackModule);
            } catch (fallbackError) {
                 console.error('Failed to load fallback language file: en.json', fallbackError);
            }
        }
      } finally {
        setLoadingLang(false);
      }
    };

    loadLanguage();
  }, [selectedLanguage, germanI18nData]); // Rerun when language changes or German data isn't loaded

  // Updated handleChange to handle nested fields
  const handleChange = (section: keyof TaxFormData, field: string, value: any) => {
    console.log('handleChange:', { section, field, value }); // Debug log
    setFormData(prevData => {
      // Create a new object without using JSON.stringify
      const newData = { ...prevData };
      
      // Ensure the section exists
      if (!newData[section]) {
        newData[section] = {};
      }

      // Handle nested fields (e.g., address.street)
      if (field.includes('.')) {
        const keys = field.split('.');
        let currentLevel = { ...newData[section] };
        const sectionCopy = currentLevel;

        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          if (!currentLevel[key]) {
            currentLevel[key] = {};
          }
          currentLevel[key] = { ...currentLevel[key] };
          currentLevel = currentLevel[key];
        }
        currentLevel[keys[keys.length - 1]] = value;
        newData[section] = sectionCopy;
      } else {
        // Handle direct fields within the section
        newData[section] = {
          ...newData[section],
          [field]: value
        };
      }

      console.log('New formData:', newData); // Debug log
      return newData;
    });
  };

  // Helper method to update URL with application ID
  const updateUrlWithApplicationId = (appId: string) => {
    if (!appId) return;
    
    // Get current URL and parameters
    const url = new URL(window.location.href);
    url.searchParams.set('applicationId', appId);
    
    // Update URL without reloading page
    window.history.pushState({}, '', url.toString());
  };

  // Handle next button click - with validation AND auto-save
  const handleNext = async () => {
    if (!i18nData) return; // Don't validate if translations aren't loaded

    // Validate current step
    const errors = validateTaxForm(formData, currentStep, i18nData);
    setValidationErrors(errors);
    setShowValidationErrors(true); // Always show errors when Next is clicked

    // Check if there are any errors for the current step
    const hasErrors = Object.keys(errors).length > 0;
    console.log('Step Validation:', { currentStep, hasErrors, errors });

    if (!hasErrors) {
      // Save current progress before moving to next step
      setIsSaving(true);
      try {
        await handleSave();
        
        // Move to next step only after saving
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1);
          setShowValidationErrors(false); // Hide errors for the new step
          setValidationErrors(null);
        }
      } catch (error) {
        console.error('Error saving form before navigation:', error);
        // Still allow navigation even if save fails
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1);
          setShowValidationErrors(false);
          setValidationErrors(null);
        }
      } finally {
        setIsSaving(false);
      }
    } else {
      // Optionally, scroll to the first error or provide other feedback
      console.log("Validation failed, staying on step", currentStep);
    }
  };

  // Handle previous button click
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowValidationErrors(false); // Reset validation display
      setValidationErrors(null);
    }
  };

  // Handle saving the current form state
  const handleSave = async () => {
    if (!i18nData) return; // Don't save if translations aren't loaded
    
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      const currentStepKey = steps[currentStep].key;
      const currentStepData = formData[currentStepKey] || {};
      
      // Check if we're in development mode or if the API is not available
      if (import.meta.env.DEV || (import.meta.env.VITE_USE_LOCAL_STORAGE === 'true')) {
        console.log('Using local storage for saving form data (development mode)');
        
        // Generate a form ID if it doesn't exist
        const savedFormId = formId || generateRandomId();
        setFormId(savedFormId);
        
        // Generate an application ID if it doesn't exist
        const savedAppId = applicationId || generateApplicationId();
        setApplicationId(savedAppId);
        
        // Update URL with application ID
        updateUrlWithApplicationId(savedAppId);
        
        // Save the entire form data to localStorage
        const formDataToSave = {
          id: savedFormId,
          userId: 'local-user',
          applicationId: savedAppId,
          status: 'in_progress',
          currentStep,
          ...formData,
          updatedAt: new Date().toISOString(),
        };
        
        localStorage.setItem(`tax-form-${savedAppId}`, JSON.stringify(formDataToSave));
        console.log('Form data saved to localStorage with application ID:', savedAppId);
        
        setSaveSuccess(true);
        toast.success("Progress saved successfully (local storage)");
      } else {
        // Use the real API endpoints if available
        try {
          if (formId) {
            // Update existing form - save current section only
            console.log(`Saving form section ${currentStepKey} to form ${formId}`);
            
            // Real API endpoint
            const response = await axios.patch(`${API_BASE_URL}/tax-forms/${formId}`, {
              sectionName: currentStepKey,
              sectionData: currentStepData,
              currentStep: currentStep,
              applicationId: applicationId // Include the application ID
            });
            
            console.log('Update response:', response.data);
          } else {
            // Create new form with current data
            console.log('Creating new form record');
            
            // For real API integration
            // Get the actual userId from auth context or service
            const userId = 'current-user-id'; // TODO: Replace with actual authenticated user ID
            
            const data = {
              userId,
              taxYear: new Date().getFullYear(),
              status: 'in_progress',
              currentStep,
              applicationId: applicationId, // Include the application ID
              [currentStepKey]: currentStepData,
            };
            
            console.log('Sending data to create form:', data);
            
            // Real API endpoint
            const response = await axios.post(`${API_BASE_URL}/tax-forms`, data);
            
            console.log('Creation response:', response.data);
            
            // Save the form ID for future updates
            if (response.data && response.data.id) {
              setFormId(response.data.id);
              
              // If we get an application ID back from the server, update state and URL
              if (response.data.applicationId) {
                setApplicationId(response.data.applicationId);
                updateUrlWithApplicationId(response.data.applicationId);
              }
            } else {
              console.error('Response did not include form ID', response.data);
            }
          }
          
          setSaveSuccess(true);
          toast.success("Progress saved successfully");
        } catch (apiError) {
          console.error('API error, falling back to local storage:', apiError);
          
          // Fallback to localStorage if API calls fail
          const savedFormId = formId || generateRandomId();
          setFormId(savedFormId);
          
          const savedAppId = applicationId || generateApplicationId();
          setApplicationId(savedAppId);
          
          updateUrlWithApplicationId(savedAppId);
          
          // Save to localStorage as fallback
          const formDataToSave = {
            id: savedFormId,
            userId: 'local-user',
            applicationId: savedAppId,
            status: 'in_progress',
            currentStep,
            ...formData,
            updatedAt: new Date().toISOString(),
          };
          
          localStorage.setItem(`tax-form-${savedAppId}`, JSON.stringify(formDataToSave));
          console.log('Form data saved to localStorage with application ID:', savedAppId);
          
          setSaveSuccess(true);
          toast.info("Progress saved locally (server unavailable)");
        }
      }
      
      // Always update URL if we have an application ID (in case user wants to bookmark)
      if (applicationId) {
        updateUrlWithApplicationId(applicationId);
      }
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving form:', error);
      toast.error("Could not save form data. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle form submission - updated to use the API or localStorage
  const handleSubmit = async () => {
    console.log('Attempting form submission...', formData);
    
    // Re-validate the entire form or at least the signature step before final submission
    const errors = validateTaxForm(formData, currentStep, i18nData);
    setValidationErrors(errors);
    setShowValidationErrors(true);

    const hasErrors = Object.keys(errors).length > 0;
    console.log('Final Validation:', { hasErrors, errors });

    if (hasErrors) {
      console.log("Submission prevented due to validation errors.");
      toast.error("Please fix validation errors before submitting");
      return; // Stop submission if errors exist
    }

    setIsSubmitting(true);
    
    try {
      // Ensure we have a signature - use mock if none exists 
      if (!formData.signature) {
        setFormData(prevData => ({
          ...prevData,
          signature: MOCK_SIGNATURE_DATA
        }));
      }
      
      // Check if we're in development mode or if API is not available
      if (import.meta.env.DEV || (import.meta.env.VITE_USE_LOCAL_STORAGE === 'true')) {
        console.log('Using localStorage for form submission (development mode)');
        
        // Save the current form data with updated status
        const savedFormId = formId || generateRandomId();
        const savedAppId = applicationId || generateApplicationId();
        
        // The complete form data to save
        const formDataToSave = {
          id: savedFormId,
          userId: 'local-user',
          applicationId: savedAppId,
          status: 'completed',
          currentStep,
          ...formData,
          updatedAt: new Date().toISOString(),
          submittedAt: new Date().toISOString()
        };
        
        // Save to localStorage
        localStorage.setItem(`tax-form-${savedAppId}`, JSON.stringify(formDataToSave));
        console.log('Form submitted and saved to localStorage with application ID:', savedAppId);
        
        // Generate PDF
        try {
          await generateTaxFormPdf(formData, germanI18nData, i18nData);
          console.log('PDF generated successfully');
        } catch (pdfError) {
          console.error('Error generating PDF:', pdfError);
          toast.error('Could not generate PDF. Please try again or contact support.');
        }
        
        // Show success message
        toast.success('Form submitted successfully (saved locally)');
      } else {
        // Try to use the real API
        try {
          // Real API Integration
          if (formId) {
            // First ensure the current step is saved
            await axios.patch(`${API_BASE_URL}/tax-forms/${formId}`, {
              sectionName: 'signature',
              sectionData: formData.signature || {},
              currentStep,
              applicationId: applicationId,
              status: 'completed' // Update status to completed
            });
            
            // Now submit the form
            await axios.post(`${API_BASE_URL}/tax-forms/${formId}/submit`);
          } else {
            // If no form ID, we need to create the form first
            const userId = 'current-user-id'; // Replace with actual user ID from auth
            const data = {
              userId,
              taxYear: new Date().getFullYear(),
              status: 'completed',
              currentStep,
              applicationId: applicationId,
              ...formData // Include all form data
            };
            
            const response = await axios.post(`${API_BASE_URL}/tax-forms`, data);
            
            setFormId(response.data.id);
            
            // Now submit the form
            await axios.post(`${API_BASE_URL}/tax-forms/${response.data.id}/submit`);
          }
          
          // Generate PDF after successful API submission
          try {
            console.log("Generating PDF...");
            await generateTaxFormPdf(formData, germanI18nData, i18nData);
            console.log("PDF generation successful.");
          } catch (pdfError) {
            console.error("Error generating PDF:", pdfError);
            toast.error("Could not generate PDF summary. Please try again or contact support.");
          }
          
          // Show success message or redirect user
          toast.success("Form submitted successfully!");
        } catch (apiError) {
          console.error('API error, falling back to localStorage for submission:', apiError);
          
          // Fallback to localStorage if API calls fail
          const savedFormId = formId || generateRandomId();
          const savedAppId = applicationId || generateApplicationId();
          
          // Update state
          setFormId(savedFormId);
          setApplicationId(savedAppId);
          
          // The complete form data to save
          const formDataToSave = {
            id: savedFormId,
            userId: 'local-user',
            applicationId: savedAppId,
            status: 'completed',
            currentStep,
            ...formData,
            updatedAt: new Date().toISOString(),
            submittedAt: new Date().toISOString()
          };
          
          // Save to localStorage
          localStorage.setItem(`tax-form-${savedAppId}`, JSON.stringify(formDataToSave));
          console.log('Form submitted and saved to localStorage with application ID:', savedAppId);
          
          // Generate PDF
          try {
            await generateTaxFormPdf(formData, germanI18nData, i18nData);
            console.log("PDF generation successful.");
          } catch (pdfError) {
            console.error("Error generating PDF:", pdfError);
            toast.error("Could not generate PDF summary. Please try again or contact support.");
          }
          
          toast.info("Form submitted successfully (server unavailable, saved locally)");
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Failed to submit form. Please try again or contact support.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle language change
  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(event.target.value as 'en' | 'es' | 'fr' | 'it');
  };

  // Render current step
  const renderStep = () => {
    if (loadingLang || !i18nData || !germanI18nData) {
      return <div>Loading language...</div>; // Loading indicator
    }

    const StepComponent = steps[currentStep].component;
    const stepKey = steps[currentStep].key; // Get the key for translations

    // Extract specific translations for the current step
    // Use optional chaining and provide empty objects as fallbacks
    const germanT_form = germanI18nData?.taxForm?.[stepKey] || {};
    const t = i18nData?.taxForm?.[stepKey] || {};

    // Special props for Review step
    if (stepKey === 'review') {
      return (
        <StepComponent
          formData={formData}
          germanT={germanT_form}
          selectedT={t}
          germanI18nData={germanI18nData}
          i18nData={i18nData}
          // Pass these props even though they might not be used by Review component
          handleChange={handleChange}
          selectedLanguage={selectedLanguage}
          validationErrors={validationErrors}
          showValidationErrors={showValidationErrors}
        />
      );
    }

    return (
      <StepComponent
        formData={formData}
        handleChange={handleChange}
        selectedLanguage={selectedLanguage}
        // Pass the full objects for potential top-level access if needed (e.g., in Review)
        i18nData={i18nData}
        germanI18nData={germanI18nData}
        // Pass the specific step translations with the expected prop names
        germanT={germanT_form} // Prop name expected by step components
        selectedT={t}         // Prop name expected by step components
        validationErrors={validationErrors} // Pass errors
        showValidationErrors={showValidationErrors} // Pass flag
      />
    );
  };

  // Updated language options with flags
  const languageOptions = [
    { value: 'en', label: '🇬🇧 English' },
    { value: 'es', label: '🇪🇸 Español' },
    { value: 'fr', label: '🇫🇷 Français' },
    { value: 'it', label: '🇮🇹 Italiano' },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 py-8 px-4">
      {/* Main Form Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-center text-neutral-800 mb-2">
        {/* Display German first, then selected language */}
        {germanI18nData?.formTitle || 'Deutsche Steuererklärung'}
      </h1>
      <h2 className="text-md md:text-lg text-center text-neutral-600 mb-8">
        {i18nData?.formTitle || 'German Tax Return'}
      </h2>

      <FormTemplate>
        {/* Application ID display if available and not on first step */}
        {applicationId && currentStep > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4 text-center">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Application ID:</span> {applicationId}
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Please save this ID to track your application.
            </p>
          </div>
        )}

        {/* Language Selector - Positioned Top Right */}
        {/* Using absolute positioning relative to FormTemplate */}
        {/* FormTemplate needs `relative` class if not already present */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10"> {/* Added z-index */}
          <select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="px-3 py-1.5 border rounded-md bg-white text-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
            aria-label="Select Language"
          >
            {languageOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label} {/* Emojis included here */}
              </option>
            ))}
          </select>
        </div>

        {/* Progress Bar - Added pt-12 to account for absolute positioned dropdown */}
        <div className="mb-6 pt-12 md:pt-8">
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

        {/* Save Success Message */}
        {saveSuccess && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md border border-green-200">
            Form progress saved successfully.
          </div>
        )}

        {/* Render Current Step */}
        <div className="min-h-[300px]">
          {renderStep()}
        </div>

        {/* Navigation Buttons - Added responsive classes */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-center mt-6 w-full space-y-4 md:space-y-0">
          {/* Back Button container */}
          <div className={`w-full md:w-auto ${currentStep === 0 ? 'invisible' : ''}`}>
            {currentStep > 0 && (
              <Button
                onClick={handlePrevious}
                className="auth-btn-secondary w-full md:w-auto"
                type="button"
                disabled={isSaving || isSubmitting}
              >
                Back
              </Button>
            )}
          </div>

          {/* Action Buttons container */}
          <div className="w-full md:w-auto flex flex-col-reverse md:flex-row space-y-2 md:space-y-0 md:space-x-2 space-y-reverse">
            {/* Next/Submit Button */}
            {currentStep === steps.length - 1 ? (
              <Button
                onClick={handleSubmit}
                className="auth-btn w-full md:w-auto"
                type="submit"
                disabled={isSaving || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="auth-btn w-full md:w-auto"
                type="button"
                disabled={isSaving || isSubmitting}
              >
                {isSaving ? 'Saving...' : 'Next'}
              </Button>
            )}
          </div>
        </div>
      </FormTemplate>
    </div>
  );
};

export default TaxFormBase; 