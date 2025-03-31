import React from 'react';
import { Label, FormSection, Input, Select } from '../utils/UIComponents';
import { TaxFormData } from '../taxTypes';
import languageData from '../i18n/language.json';

interface BusinessStepProps {
  formData: TaxFormData;
  handleChange: (section: keyof TaxFormData, field: string, value: any) => void;
  validationErrors: Record<string, any> | null;
  hasError: (section: string, field: string) => boolean;
  showValidationErrors: boolean;
  getInputClass?: (section: string, field: string) => string;
}

const BusinessStep: React.FC<BusinessStepProps> = ({
  formData,
  handleChange,
  validationErrors,
  hasError,
  showValidationErrors,
  getInputClass = () => "auth-input"
}) => {
  // Common input class that handles validation state
  const getInputClassWithError = (section: string, field: string) => {
    const baseClass = getInputClass(section, field);
    return hasError(section, field) && showValidationErrors
      ? `${baseClass} border-2 border-red-500` 
      : baseClass;
  };

  // Business type options
  const businessTypeOptions = [
    { value: 'freelance', label: 'Freiberuflich / Freelance' },
    { value: 'trade', label: 'Gewerblich / Trade' },
    { value: 'agriculture', label: 'Landwirtschaftlich / Agriculture' },
    { value: 'other', label: 'Sonstige / Other' }
  ];

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
        <div className="space-y-6">
          {/* Business Owner Question */}
          <div className="form-group">
            <Label 
              htmlFor="isBusinessOwner"
              germanText={<div className="font-bold">{languageData.de.incomeInfo.isBusinessOwner}</div>}
              englishText={<div className="text-neutral-600">{languageData.en.incomeInfo.isBusinessOwner}</div>}
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
                />
                <label htmlFor="isBusinessOwnerYes" className="ml-2 text-neutral-700">
                  <span className="font-bold">Ja</span> / <span className="text-neutral-600">Yes</span>
                </label>
              </div>
            </div>
            {hasError('incomeInfo', 'isBusinessOwner') && showValidationErrors && (
              <p className="text-red-500 text-sm mt-1">
                {formData.incomeInfo.isBusinessOwner === undefined 
                  ? 'Bitte wählen Sie eine Option aus / Please select an option'
                  : typeof validationErrors?.incomeInfo?.isBusinessOwner === 'string'
                    ? validationErrors.incomeInfo.isBusinessOwner
                    : 'Bitte wählen Sie eine Option aus / Please select an option'
                }
              </p>
            )}
          </div>

          {/* Show business details if user is a business owner */}
          {formData.incomeInfo.isBusinessOwner && (
            <>
              {/* Business Type */}
              <div className="form-group">
                <Label 
                  htmlFor="businessType"
                  germanText={<div className="font-bold">{languageData.de.incomeInfo.businessType}</div>}
                  englishText={<div className="text-neutral-600">{languageData.en.incomeInfo.businessType}</div>}
                />
                <Select
                  id="businessType"
                  value={formData.incomeInfo.businessType || ''}
                  onChange={(e) => handleChange('incomeInfo', 'businessType', e.target.value)}
                  className={getInputClassWithError('incomeInfo', 'businessType')}
                  required
                >
                  <option value="">-- {languageData.de.common.select} / {languageData.en.common.select} --</option>
                  {businessTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                {hasError('incomeInfo', 'businessType') && showValidationErrors && (
                  <p className="text-red-500 text-sm mt-1">
                    {typeof validationErrors?.incomeInfo?.businessType === 'string'
                      ? validationErrors.incomeInfo.businessType
                      : 'Bitte wählen Sie einen Geschäftstyp aus / Please select a business type'}
                  </p>
                )}
              </div>

              {/* Business Earnings */}
              <div className="form-group">
                <Label 
                  htmlFor="businessEarnings"
                  germanText={<div className="font-bold">{languageData.de.incomeInfo.businessEarnings}</div>}
                  englishText={<div className="text-neutral-600">{languageData.en.incomeInfo.businessEarnings}</div>}
                />
                <Input
                  id="businessEarnings"
                  type="number"
                  value={formData.incomeInfo.businessEarnings || ''}
                  onChange={(e) => handleNumberChange('incomeInfo', 'businessEarnings', e.target.value)}
                  className={getInputClassWithError('incomeInfo', 'businessEarnings')}
                  required
                />
                {hasError('incomeInfo', 'businessEarnings') && showValidationErrors && (
                  <p className="text-red-500 text-sm mt-1">
                    {typeof validationErrors?.incomeInfo?.businessEarnings === 'string'
                      ? validationErrors.incomeInfo.businessEarnings
                      : 'Bitte geben Sie einen gültigen Betrag ein / Please enter a valid amount'}
                  </p>
                )}
              </div>

              {/* Business Expenses */}
              <div className="form-group">
                <Label 
                  htmlFor="businessExpenses"
                  germanText={<div className="font-bold">{languageData.de.incomeInfo.businessExpenses}</div>}
                  englishText={<div className="text-neutral-600">{languageData.en.incomeInfo.businessExpenses}</div>}
                />
                <Input
                  id="businessExpenses"
                  type="number"
                  value={formData.incomeInfo.businessExpenses || ''}
                  onChange={(e) => handleChange('incomeInfo', 'businessExpenses', e.target.value)}
                  className={getInputClassWithError('incomeInfo', 'businessExpenses')}
                  required
                />
                {hasError('incomeInfo', 'businessExpenses') && showValidationErrors && (
                  <p className="text-red-500 text-sm mt-1">
                    {typeof validationErrors?.incomeInfo?.businessExpenses === 'string'
                      ? validationErrors.incomeInfo.businessExpenses
                      : 'Bitte geben Sie einen gültigen Betrag ein / Please enter a valid amount'}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </FormSection>
    </div>
  );
};

export default BusinessStep; 