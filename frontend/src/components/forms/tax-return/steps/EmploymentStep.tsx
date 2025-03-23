import React from 'react';
import { Label, FormSection, Input } from '../utils/UIComponents';
import { TaxFormData } from '../taxTypes';
import languageData from '../i18n/language.json';

interface EmploymentStepProps {
  formData: TaxFormData;
  handleChange: (section: keyof TaxFormData, field: string, value: any) => void;
  validationErrors: Record<string, any> | null;
  hasError: (section: string, field: string) => boolean;
  getInputClass?: (section: string, field: string) => string;
}

const EmploymentStep: React.FC<EmploymentStepProps> = ({
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

  return (
    <div>
      {/* Employment status question */}
      <FormSection
        germanTitle="Beschäftigungsstatus"
        englishTitle="Employment Status"
      >
        <div className="form-group mb-4">
          <Label 
            htmlFor="isEmployed"
            germanText={languageData.de.incomeInfo.isEmployed}
            englishText={languageData.en.incomeInfo.isEmployed}
          />
          <div className="flex space-x-4 mt-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="isEmployedNo"
                name="isEmployed"
                checked={formData.incomeInfo.isEmployed === false}
                onChange={() => handleChange('incomeInfo', 'isEmployed', false)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="isEmployedNo" className="ml-2 text-neutral-700">
                <span className="font-bold">Nein</span> / <span className="text-neutral-600">No</span>
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="isEmployedYes"
                name="isEmployed"
                checked={formData.incomeInfo.isEmployed === true}
                onChange={() => handleChange('incomeInfo', 'isEmployed', true)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="isEmployedYes" className="ml-2 text-neutral-700">
                <span className="font-bold">Ja</span> / <span className="text-neutral-600">Yes</span>
              </label>
            </div>
          </div>
          {hasError('incomeInfo', 'isEmployed') && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors?.incomeInfo?.isEmployed}
            </p>
          )}
        </div>
      </FormSection>

      {/* Only show employment details if employed */}
      {formData.incomeInfo.isEmployed && (
        <FormSection 
          germanTitle={languageData.de.incomeInfo.employmentIncome}
          englishTitle={languageData.en.incomeInfo.employmentIncome}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <Label 
                htmlFor="employerName"
                germanText={languageData.de.incomeInfo.employer}
                englishText={languageData.en.incomeInfo.employer}
              />
              <Input
                id="employerName"
                type="text"
                value={formData.incomeInfo.employer || ''}
                onChange={(e) => handleChange('incomeInfo', 'employer', e.target.value)}
                className={getInputClassWithError('incomeInfo', 'employer')}
              />
              {hasError('incomeInfo', 'employer') && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors?.incomeInfo?.employer}
                </p>
              )}
            </div>

            <div className="form-group">
              <Label 
                htmlFor="income"
                germanText={languageData.de.incomeInfo.employmentIncome}
                englishText={languageData.en.incomeInfo.employmentIncome}
              />
              <Input
                id="income"
                type="number"
                value={formData.incomeInfo.employmentIncome || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  const parsedValue = value === '' ? null : parseFloat(value);
                  handleChange('incomeInfo', 'employmentIncome', parsedValue);
                }}
                className={getInputClassWithError('incomeInfo', 'employmentIncome')}
              />
              {hasError('incomeInfo', 'employmentIncome') && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors?.incomeInfo?.employmentIncome}
                </p>
              )}
            </div>

            <div className="form-group">
              <Label 
                htmlFor="hasTaxCertificate"
                germanText={languageData.de.incomeInfo.hasTaxCertificate}
                englishText={languageData.en.incomeInfo.hasTaxCertificate}
              />
              <div className="flex space-x-4 mt-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="hasTaxCertificateNo"
                    name="hasTaxCertificate"
                    checked={formData.incomeInfo.hasTaxCertificate === false}
                    onChange={() => handleChange('incomeInfo', 'hasTaxCertificate', false)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="hasTaxCertificateNo" className="ml-2 text-neutral-700">
                    <span className="font-bold">Nein</span> / <span className="text-neutral-600">No</span>
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="hasTaxCertificateYes"
                    name="hasTaxCertificate"
                    checked={formData.incomeInfo.hasTaxCertificate === true}
                    onChange={() => handleChange('incomeInfo', 'hasTaxCertificate', true)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="hasTaxCertificateYes" className="ml-2 text-neutral-700">
                    <span className="font-bold">Ja</span> / <span className="text-neutral-600">Yes</span>
                  </label>
                </div>
              </div>
              {hasError('incomeInfo', 'hasTaxCertificate') && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors?.incomeInfo?.hasTaxCertificate}
                </p>
              )}
            </div>
          </div>
        </FormSection>
      )}
    </div>
  );
};

export default EmploymentStep; 