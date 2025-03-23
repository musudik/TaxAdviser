import React from 'react';
import { Label, FormSection, Input } from '../utils/UIComponents';
import { TaxFormData } from '../taxTypes';
import languageData from '../i18n/language.json';

interface BusinessStepProps {
  formData: TaxFormData;
  handleChange: (section: keyof TaxFormData, field: string, value: any) => void;
  validationErrors: Record<string, any> | null;
  hasError: (section: string, field: string) => boolean;
  getInputClass?: (section: string, field: string) => string;
}

const BusinessStep: React.FC<BusinessStepProps> = ({
  formData,
  handleChange,
  validationErrors,
  hasError,
  getInputClass = () => "auth-input"
}) => {
  // Common input class that handles validation state
  const getInputClassWithError = (section: string, field: string) => {
    return hasError(section, field) 
      ? `border-red-500` 
      : '';
  };

  // Helper function for number fields to convert string to number safely
  const handleNumberChange = (section: keyof TaxFormData, field: string, value: string) => {
    const parsedValue = value === '' ? null : parseFloat(value);
    handleChange(section, field, parsedValue);
  };

  return (
    <div>
      <FormSection 
        germanTitle={languageData.de.incomeInfo.businessTitle}
        englishTitle={languageData.en.incomeInfo.businessTitle}
      >
        <div className="space-y-4">
          {/* Business owner status */}
          <div className="form-group">
            <Label 
              htmlFor="isBusinessOwner"
              germanText={languageData.de.incomeInfo.isBusinessOwner}
              englishText={languageData.en.incomeInfo.isBusinessOwner}
            />
            <div className="flex space-x-4 mt-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="isBusinessOwnerNo"
                  name="isBusinessOwner"
                  checked={formData.incomeInfo.isBusinessOwner === false}
                  onChange={() => handleChange('incomeInfo', 'isBusinessOwner', false)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  required
                />
                <label htmlFor="isBusinessOwnerNo" className="ml-2 text-neutral-700">
                  <span className="font-bold">Nein</span> / <span className="text-neutral-600">No</span>
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="isBusinessOwnerYes"
                  name="isBusinessOwner"
                  checked={formData.incomeInfo.isBusinessOwner === true}
                  onChange={() => handleChange('incomeInfo', 'isBusinessOwner', true)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  required
                />
                <label htmlFor="isBusinessOwnerYes" className="ml-2 text-neutral-700">
                  <span className="font-bold">Ja</span> / <span className="text-neutral-600">Yes</span>
                </label>
              </div>
            </div>
            {hasError('incomeInfo', 'isBusinessOwner') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.incomeInfo?.isBusinessOwner}
              </p>
            )}
          </div>
          
          {/* Conditional fields when business owner */}
          {formData.incomeInfo.isBusinessOwner && (
            <div className="space-y-4 ml-6">
              {/* Business type */}
              <div className="form-group">
                <Label 
                  htmlFor="businessType"
                  germanText={languageData.de.incomeInfo.businessType}
                  englishText={languageData.en.incomeInfo.businessType}
                />
                <Input
                  id="businessType"
                  type="text"
                  value={formData.incomeInfo.businessType || ''}
                  onChange={(e) => handleChange('incomeInfo', 'businessType', e.target.value)}
                  className={getInputClassWithError('incomeInfo', 'businessType')}
                  required
                />
                {hasError('incomeInfo', 'businessType') && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors?.incomeInfo?.businessType}
                  </p>
                )}
              </div>
              
              {/* Business earnings */}
              <div className="form-group">
                <Label 
                  htmlFor="businessEarnings"
                  germanText={languageData.de.incomeInfo.businessEarnings}
                  englishText={languageData.en.incomeInfo.businessEarnings}
                />
                <Input
                  id="businessEarnings"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.incomeInfo.businessEarnings || ''}
                  onChange={(e) => handleNumberChange('incomeInfo', 'businessEarnings', e.target.value)}
                  className={getInputClassWithError('incomeInfo', 'businessEarnings')}
                  required
                />
                {hasError('incomeInfo', 'businessEarnings') && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors?.incomeInfo?.businessEarnings}
                  </p>
                )}
              </div>
              
              {/* Business expenses */}
              <div className="form-group">
                <Label 
                  htmlFor="businessExpenses"
                  germanText={languageData.de.incomeInfo.businessExpenses}
                  englishText={languageData.en.incomeInfo.businessExpenses}
                />
                <Input
                  id="businessExpenses"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.incomeInfo.businessExpenses || ''}
                  onChange={(e) => handleNumberChange('incomeInfo', 'businessExpenses', e.target.value)}
                  className={getInputClassWithError('incomeInfo', 'businessExpenses')}
                  required
                />
                {hasError('incomeInfo', 'businessExpenses') && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors?.incomeInfo?.businessExpenses}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </FormSection>
    </div>
  );
};

export default BusinessStep; 