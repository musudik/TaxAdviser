import React from 'react';
import { Label, FormSection, Input, Select } from '../utils/UIComponents';
import { TaxFormData } from '../taxTypes';
import languageData from '../i18n/language.json';

interface EmploymentStepProps {
  formData: TaxFormData;
  handleChange: (section: keyof TaxFormData, field: string, value: any) => void;
  validationErrors: Record<string, any> | null;
  hasError: (section: string, field: string) => boolean;
  showValidationErrors: boolean;
  getInputClass?: (section: string, field: string) => string;
}

const EmploymentStep: React.FC<EmploymentStepProps> = ({
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

  return (
    <div>
      <FormSection 
        germanTitle={languageData.de.incomeInfo.title} 
        englishTitle={languageData.en.incomeInfo.title}
      >
        <div className="space-y-6">
          {/* Employment Status Question */}
          <div className="form-group">
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
            {hasError('incomeInfo', 'isEmployed') && showValidationErrors && (
              <p className="text-red-500 text-sm mt-1">
                {typeof validationErrors?.incomeInfo?.isEmployed === 'string'
                  ? validationErrors.incomeInfo.isEmployed
                  : 'Bitte wählen Sie eine Option aus / Please select an option'}
              </p>
            )}
          </div>

          {formData.incomeInfo.isEmployed && (
            <>
              {/* Employer Name */}
              <div className="form-group">
                <Label 
                  htmlFor="employer"
                  germanText={<div className="font-bold">{languageData.de.incomeInfo.employer}</div>}
                  englishText={<div className="text-neutral-600">{languageData.en.incomeInfo.employer}</div>}
                />
                <Input
                  id="employer"
                  type="text"
                  value={formData.incomeInfo.employer || ''}
                  onChange={(e) => handleChange('incomeInfo', 'employer', e.target.value)}
                  className={getInputClassWithError('incomeInfo', 'employer')}
                  required
                />
                {hasError('incomeInfo', 'employer') && showValidationErrors && (
                  <p className="text-red-500 text-sm mt-1">
                    {typeof validationErrors?.incomeInfo?.employer === 'string'
                      ? validationErrors.incomeInfo.employer
                      : 'Dieses Feld ist erforderlich / This field is required'}
                  </p>
                )}
              </div>

              {/* Employment Income */}
              <div className="form-group">
                <Label 
                  htmlFor="employmentIncome"
                  germanText={<div className="font-bold">{languageData.de.incomeInfo.employmentIncome}</div>}
                  englishText={<div className="text-neutral-600">{languageData.en.incomeInfo.employmentIncome}</div>}
                />
                <Input
                  id="employmentIncome"
                  type="number"
                  value={formData.incomeInfo.employmentIncome || ''}
                  onChange={(e) => handleChange('incomeInfo', 'employmentIncome', e.target.value)}
                  className={getInputClassWithError('incomeInfo', 'employmentIncome')}
                  required
                />
                {hasError('incomeInfo', 'employmentIncome') && showValidationErrors && (
                  <p className="text-red-500 text-sm mt-1">
                    {typeof validationErrors?.incomeInfo?.employmentIncome === 'string'
                      ? validationErrors.incomeInfo.employmentIncome
                      : 'Bitte geben Sie einen gültigen Betrag ein / Please enter a valid amount'}
                  </p>
                )}
              </div>

              {/* Tax Certificate Question */}
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
                {hasError('incomeInfo', 'hasTaxCertificate') && showValidationErrors && (
                  <p className="text-red-500 text-sm mt-1">
                    {typeof validationErrors?.incomeInfo?.hasTaxCertificate === 'string'
                      ? validationErrors.incomeInfo.hasTaxCertificate
                      : 'Bitte wählen Sie eine Option aus / Please select an option'}
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
                    onChange={(e) => handleChange('incomeInfo', 'taxCertificateFile', e.target.files?.[0] || null)}
                    className="mt-1 block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                    required
                  />
                  {hasError('incomeInfo', 'taxCertificateFile') && showValidationErrors && (
                    <p className="text-red-500 text-sm mt-1">
                      {typeof validationErrors?.incomeInfo?.taxCertificateFile === 'string'
                        ? validationErrors.incomeInfo.taxCertificateFile
                        : 'Bitte laden Sie die Steuerbescheinigung hoch / Please upload the tax certificate'}
                    </p>
                  )}
                </div>
              )}

              {/* Travel Subsidy Question */}
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
                {hasError('incomeInfo', 'hasTravelSubsidy') && showValidationErrors && (
                  <p className="text-red-500 text-sm mt-1">
                    {typeof validationErrors?.incomeInfo?.hasTravelSubsidy === 'string'
                      ? validationErrors.incomeInfo.hasTravelSubsidy
                      : 'Bitte wählen Sie eine Option aus / Please select an option'}
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
                    value={formData.incomeInfo.travelDistance || ''}
                    onChange={(e) => handleChange('incomeInfo', 'travelDistance', e.target.value)}
                    className={getInputClassWithError('incomeInfo', 'travelDistance')}
                    required
                  />
                  {hasError('incomeInfo', 'travelDistance') && showValidationErrors && (
                    <p className="text-red-500 text-sm mt-1">
                      {typeof validationErrors?.incomeInfo?.travelDistance === 'string'
                        ? validationErrors.incomeInfo.travelDistance
                        : 'Bitte geben Sie die Entfernung ein / Please enter the travel distance'}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </FormSection>
    </div>
  );
};

export default EmploymentStep; 