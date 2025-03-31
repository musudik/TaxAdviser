import React from 'react';
import { FormSection, Label } from '../utils/UIComponents';
import { TaxFormData } from '../taxTypes';
import languageData from '../i18n/language.json';

interface ForeignIncomeStepProps {
  formData: TaxFormData;
  handleChange: (section: keyof TaxFormData, field: string, value: any) => void;
  validationErrors: Record<string, any> | null;
  hasError: (section: string, field: string) => boolean;
  getInputClass?: (section: string, field: string) => string;
  showValidationErrors?: boolean;
}

const ForeignIncomeStep: React.FC<ForeignIncomeStepProps> = ({
  formData,
  handleChange,
  validationErrors,
  hasError,
  getInputClass = () => "auth-input",
  showValidationErrors = false
}) => {
  // Common input class that handles validation state
  const getInputClassWithError = (section: string, field: string) => {
    const baseClass = getInputClass(section, field);
    return hasError(section, field) && showValidationErrors
      ? `${baseClass} border-2 border-red-500` 
      : baseClass;
  };

  // Helper function for number fields
  const handleNumberChange = (section: keyof TaxFormData, field: string, value: string) => {
    const parsedValue = value === '' ? null : parseFloat(value);
    handleChange(section, field, parsedValue);
  };

  return (
    <FormSection
      germanTitle={languageData.de.steps.foreign}
      englishTitle={languageData.en.steps.foreign}
    >
      <div className="space-y-6">
        {/* Foreign income status */}
        <div className="form-group">
          <Label className="block space-y-1"
            htmlFor="foreignIncome"
            germanText={<div className="font-bold">{languageData.de.incomeInfo.hasForeignIncome}</div>}
            englishText={<div className="text-neutral-600">{languageData.en.incomeInfo.hasForeignIncome}</div>}
          />
          <div className="flex space-x-4 mt-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="foreignIncomeNo"
                name="foreignIncome"
                checked={formData.incomeInfo.hasForeignIncome === false}
                onChange={() => handleChange('incomeInfo', 'hasForeignIncome', false)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                required
              />
              <label htmlFor="foreignIncomeNo" className="ml-2 text-neutral-700">
                <span className="font-bold">Nein</span> / <span className="text-neutral-600">No</span>
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="foreignIncomeYes"
                name="foreignIncome"
                checked={formData.incomeInfo.hasForeignIncome === true}
                onChange={() => handleChange('incomeInfo', 'hasForeignIncome', true)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                required
              />
              <label htmlFor="foreignIncomeYes" className="ml-2 text-neutral-700">
                <span className="font-bold">Ja</span> / <span className="text-neutral-600">Yes</span>
              </label>
            </div>
          </div>
          {hasError('incomeInfo', 'hasForeignIncome') && showValidationErrors && (
            <p className="text-red-500 text-sm mt-1">
              {formData.incomeInfo.hasForeignIncome === undefined 
                ? 'Bitte wählen Sie eine Option aus / Please select an option'
                : typeof validationErrors?.incomeInfo?.hasForeignIncome === 'string'
                  ? validationErrors.incomeInfo.hasForeignIncome
                  : 'Bitte wählen Sie eine Option aus / Please select an option'
              }
            </p>
          )}
        </div>
        
        {/* Conditional fields when has foreign income */}
        {formData.incomeInfo.hasForeignIncome && (
          <div className="space-y-4 ml-6">
            {/* Country of origin */}
            <div className="form-group">
              <Label className="block space-y-1"
                htmlFor="foreignIncomeCountry"
                germanText={<div className="font-bold">{languageData.de.foreignIncome.countryQuestion}</div>}
                englishText={<div className="text-neutral-600">{languageData.en.foreignIncome.countryQuestion}</div>}
              />
              <input
                type="text"
                value={formData.incomeInfo.foreignIncomeCountry || ''}
                onChange={(e) => handleChange('incomeInfo', 'foreignIncomeCountry', e.target.value)}
                className={getInputClassWithError('incomeInfo', 'foreignIncomeCountry')}
                required
              />
              {hasError('incomeInfo', 'foreignIncomeCountry') && showValidationErrors && (
                <p className="text-red-500 text-sm mt-1">
                  {languageData.de.validation.required} / {languageData.en.validation.required}
                </p>
              )}
            </div>
            
            {/* Income type */}
            <div className="form-group">
              <Label className="block space-y-1"
                htmlFor="foreignIncomeType"
                germanText={<div className="font-bold">{languageData.de.foreignIncome.incomeTypeQuestion}</div>}
                englishText={<div className="text-neutral-600">{languageData.en.foreignIncome.incomeTypeQuestion}</div>}
              />
              <input
                type="text"
                value={formData.incomeInfo.foreignIncomeType || ''}
                onChange={(e) => handleChange('incomeInfo', 'foreignIncomeType', e.target.value)}
                className={getInputClassWithError('incomeInfo', 'foreignIncomeType')}
                required
              />
              {hasError('incomeInfo', 'foreignIncomeType') && showValidationErrors && (
                <p className="text-red-500 text-sm mt-1">
                  {languageData.de.validation.required} / {languageData.en.validation.required}
                </p>
              )}
            </div>
            
            {/* Total foreign income */}
            <div className="form-group">
              <Label className="block space-y-1"
                htmlFor="foreignIncomeAmount"
                germanText={<div className="font-bold">{languageData.de.foreignIncome.totalAmountQuestion}</div>}
                englishText={<div className="text-neutral-600">{languageData.en.foreignIncome.totalAmountQuestion}</div>}
              />
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.incomeInfo.foreignIncomeAmount || ''}
                onChange={(e) => handleNumberChange('incomeInfo', 'foreignIncomeAmount', e.target.value)}
                className={getInputClassWithError('incomeInfo', 'foreignIncomeAmount')}
                required
              />
              {hasError('incomeInfo', 'foreignIncomeAmount') && showValidationErrors && (
                <p className="text-red-500 text-sm mt-1">
                  {languageData.de.validation.positiveNumber} / {languageData.en.validation.positiveNumber}
                </p>
              )}
            </div>
            
            {/* Foreign tax paid */}
            <div className="form-group">
              <Label className="block space-y-1"
                htmlFor="foreignIncomeTaxPaid"
                germanText={<div className="font-bold">{languageData.de.foreignIncome.taxPaidQuestion}</div>}
                englishText={<div className="text-neutral-600">{languageData.en.foreignIncome.taxPaidQuestion}</div>}
              />
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.incomeInfo.foreignIncomeTaxPaid || ''}
                onChange={(e) => handleNumberChange('incomeInfo', 'foreignIncomeTaxPaid', e.target.value)}
                className={getInputClassWithError('incomeInfo', 'foreignIncomeTaxPaid')}
                required
              />
              {hasError('incomeInfo', 'foreignIncomeTaxPaid') && showValidationErrors && (
                <p className="text-red-500 text-sm mt-1">
                  {languageData.de.validation.positiveNumber} / {languageData.en.validation.positiveNumber}
                </p>
              )}
            </div>
            
            {/* Foreign tax certificate */}
            <div>
              <Label className="block space-y-1"
                htmlFor="foreignIncomeTaxCertificateFile"
                germanText={<div className="font-bold">{languageData.de.foreignIncome.certificateUpload}</div>}
                englishText={<div className="text-neutral-600">{languageData.en.foreignIncome.certificateUpload}</div>}
              />

              <input
                type="file"
                multiple
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleChange('incomeInfo', 'foreignIncomeTaxCertificateFile', e.target.files[0].name);
                  }
                }}
                  className="mt-1 block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                required
              />

              {/* <input
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleChange('incomeInfo', 'foreignIncomeTaxCertificateFile', e.target.files[0].name);
                  }
                }}
                className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
                required
              /> */}
              {hasError('incomeInfo', 'foreignIncomeTaxCertificateFile') && showValidationErrors && (
                <p className="text-red-500 text-sm mt-1">
                  {languageData.de.validation.required} / {languageData.en.validation.required}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </FormSection>
  );
};

export default ForeignIncomeStep; 