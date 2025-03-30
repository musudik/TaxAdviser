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
    const baseClass = getInputClass(section, field);
    return hasError(section, field) 
      ? `${baseClass} border-2 border-red-500` 
      : baseClass;
  };

  // Helper function for number fields to convert string to number safely
  const handleNumberChange = (section: keyof TaxFormData, field: string, value: string) => {
    const parsedValue = value === '' ? null : parseFloat(value);
    handleChange(section, field, parsedValue);
  };

  return (
    <div className="space-y-6">
      {/* Employment status question */}
      <FormSection
        germanTitle={languageData.de.incomeInfo.title}
        englishTitle={languageData.en.incomeInfo.title}
      >
        <div className="form-group mb-4">
          <Label 
            htmlFor="isEmployed"
            germanText={<div className="font-bold">{languageData.de.incomeInfo.isEmployed}</div>}
            englishText={<div className="text-neutral-600">{languageData.en.incomeInfo.isEmployed}</div>}
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
              Bitte wählen Sie aus, ob Sie angestellt sind / Please select whether you are employed
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
                germanText={<div className="font-bold">{languageData.de.incomeInfo.employer}</div>}
                englishText={<div className="text-neutral-600">{languageData.en.incomeInfo.employer}</div>}
              />
              <Input
                id="employerName"
                type="text"
                value={formData.incomeInfo.employer || ''}
                onChange={(e) => handleChange('incomeInfo', 'employer', e.target.value)}
                className={getInputClassWithError('incomeInfo', 'employer')}
                required
              />
              {hasError('incomeInfo', 'employer') && (
                <p className="text-red-500 text-sm mt-1">
                  Bitte geben Sie Ihren Arbeitgeber an / Please enter your employer
                </p>
              )}
            </div>

            <div className="form-group">
              <Label 
                htmlFor="income"
                germanText={<div className="font-bold">{languageData.de.incomeInfo.employmentIncome}</div>}
                englishText={<div className="text-neutral-600">{languageData.en.incomeInfo.employmentIncome}</div>}
              />
              <Input
                id="income"
                type="number"
                min={0}
                step={0.01}
                value={formData.incomeInfo.employmentIncome || ''}
                onChange={(e) => handleNumberChange('incomeInfo', 'employmentIncome', e.target.value)}
                className={getInputClassWithError('incomeInfo', 'employmentIncome')}
                required
              />
              {hasError('incomeInfo', 'employmentIncome') && (
                <p className="text-red-500 text-sm mt-1">
                  Bitte geben Sie Ihr Einkommen an / Please enter your income
                </p>
              )}
            </div>

            <div className="form-group">
              <Label 
                htmlFor="hasTaxCertificate"
                germanText={<div className="font-bold">{languageData.de.incomeInfo.hasTaxCertificate}</div>}
                englishText={<div className="text-neutral-600">{languageData.en.incomeInfo.hasTaxCertificate}</div>}
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
                  Bitte geben Sie an, ob Sie eine Lohnsteuerbescheinigung haben / Please indicate if you have a tax certificate
                </p>
              )}
            </div>

            {formData.incomeInfo.hasTaxCertificate && (
              <div className="form-group">
                <Label 
                  htmlFor="taxCertificateFile"
                  germanText={<div className="font-bold">{languageData.de.incomeInfo.taxCertificate}</div>}
                  englishText={<div className="text-neutral-600">{languageData.en.incomeInfo.taxCertificate}</div>}
                />
                <Input
                  id="taxCertificateFile"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    handleChange('incomeInfo', 'taxCertificateFile', file?.name || '');
                  }}
                  className={getInputClassWithError('incomeInfo', 'taxCertificateFile')}
                />
                {hasError('incomeInfo', 'taxCertificateFile') && (
                  <p className="text-red-500 text-sm mt-1">
                    Bitte laden Sie Ihre Lohnsteuerbescheinigung hoch / Please upload your tax certificate
                  </p>
                )}
              </div>
            )}

            <div className="form-group">
              <Label 
                htmlFor="hasTravelSubsidy"
                germanText={<div className="font-bold">{languageData.de.incomeInfo.hasTravelSubsidy}</div>}
                englishText={<div className="text-neutral-600">{languageData.en.incomeInfo.hasTravelSubsidy}</div>}
              />
              <div className="flex space-x-4 mt-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="hasTravelSubsidyNo"
                    name="hasTravelSubsidy"
                    checked={formData.incomeInfo.hasTravelSubsidy === false}
                    onChange={() => handleChange('incomeInfo', 'hasTravelSubsidy', false)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="hasTravelSubsidyNo" className="ml-2 text-neutral-700">
                    <span className="font-bold">Nein</span> / <span className="text-neutral-600">No</span>
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="hasTravelSubsidyYes"
                    name="hasTravelSubsidy"
                    checked={formData.incomeInfo.hasTravelSubsidy === true}
                    onChange={() => handleChange('incomeInfo', 'hasTravelSubsidy', true)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="hasTravelSubsidyYes" className="ml-2 text-neutral-700">
                    <span className="font-bold">Ja</span> / <span className="text-neutral-600">Yes</span>
                  </label>
                </div>
              </div>
              {hasError('incomeInfo', 'hasTravelSubsidy') && (
                <p className="text-red-500 text-sm mt-1">
                  Bitte geben Sie an, ob Sie einen Fahrtkostenzuschuss erhalten / Please indicate if you receive a travel subsidy
                </p>
              )}
            </div>

            {formData.incomeInfo.hasTravelSubsidy && (
              <div className="form-group">
                <Label 
                  htmlFor="travelDistance"
                  germanText={<div className="font-bold">{languageData.de.incomeInfo.travelDistance}</div>}
                  englishText={<div className="text-neutral-600">{languageData.en.incomeInfo.travelDistance}</div>}
                />
                <Input
                  id="travelDistance"
                  type="number"
                  min={0}
                  step={1}
                  value={formData.incomeInfo.travelDistance || ''}
                  onChange={(e) => handleNumberChange('incomeInfo', 'travelDistance', e.target.value)}
                  className={getInputClassWithError('incomeInfo', 'travelDistance')}
                />
              </div>
            )}
          </div>
        </FormSection>
      )}
    </div>
  );
};

export default EmploymentStep; 