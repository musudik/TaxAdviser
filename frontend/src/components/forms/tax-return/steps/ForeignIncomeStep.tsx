import React from 'react';
import { FormSection, Label } from '../utils/UIComponents';
import { TaxFormData } from '../taxTypes';
import languageData from '../i18n/language.json';

interface ForeignIncomeStepProps {
  formData: TaxFormData;
  handleChange: (section: keyof TaxFormData, field: string, value: any) => void;
  validationErrors: Record<string, any> | null;
  hasError: (section: string, field: string) => boolean;
}

const ForeignIncomeStep: React.FC<ForeignIncomeStepProps> = ({
  formData,
  handleChange,
  validationErrors,
  hasError
}) => {
  // Common input class that handles validation state
  const getInputClass = (section: string, field: string) => {
    return hasError(section, field) 
      ? "auth-input border-red-500" 
      : "auth-input";
  };

  return (
    <FormSection title={`${languageData.de.steps.foreign} / ${languageData.en.steps.foreign}`}>
      <div className="space-y-6">
        {/* Foreign income status */}
        <div>
          <Label className="block space-y-1 text-neutral-800 font-['Switzer-Medium']">
            <span>Haben Sie Einkünfte aus dem Ausland erzielt (ohne die zuvor genannten Investitionseinkünfte)?</span>
            <span className="text-sm text-neutral-600 font-['Switzer-Regular'] block">Did you earn income from abroad (excluding previously mentioned investment income)?</span>
          </Label>
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
              <label htmlFor="foreignIncomeNo" className="ml-2 text-neutral-700 font-['Switzer-Regular']">Nein / No</label>
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
              <label htmlFor="foreignIncomeYes" className="ml-2 text-neutral-700 font-['Switzer-Regular']">Ja / Yes</label>
            </div>
          </div>
          {hasError('incomeInfo', 'hasForeignIncome') && (
            <p className="mt-1 text-sm text-red-600 font-['Switzer-Regular']">
              {languageData.de.validation.required} / {languageData.en.validation.required}
            </p>
          )}
        </div>
        
        {/* Conditional fields when has foreign income */}
        {formData.incomeInfo.hasForeignIncome && (
          <div className="space-y-4 ml-6">
            {/* Country of origin */}
            <div>
              <Label className="block space-y-1 text-neutral-800 font-['Switzer-Medium']">
                <span>Wenn ja, aus welchem Land stammt dieses Einkommen?</span>
                <span className="text-sm text-neutral-600 font-['Switzer-Regular'] block">If yes, from which country does this income originate?</span>
              </Label>
              <input
                type="text"
                value={formData.incomeInfo.foreignIncomeCountry || ''}
                onChange={(e) => handleChange('incomeInfo', 'foreignIncomeCountry', e.target.value)}
                className={getInputClass('incomeInfo', 'foreignIncomeCountry')}
                required
              />
              {hasError('incomeInfo', 'foreignIncomeCountry') && (
                <p className="mt-1 text-sm text-red-600 font-['Switzer-Regular']">
                  {languageData.de.validation.required} / {languageData.en.validation.required}
                </p>
              )}
            </div>
            
            {/* Income type */}
            <div>
              <Label className="block space-y-1 text-neutral-800 font-['Switzer-Medium']">
                <span>Um welche Art von Einkommen handelt es sich?</span>
                <span className="text-sm text-neutral-600 font-['Switzer-Regular'] block">What type of income is this?</span>
              </Label>
              <input
                type="text"
                value={formData.incomeInfo.foreignIncomeType || ''}
                onChange={(e) => handleChange('incomeInfo', 'foreignIncomeType', e.target.value)}
                className={getInputClass('incomeInfo', 'foreignIncomeType')}
                required
              />
              {hasError('incomeInfo', 'foreignIncomeType') && (
                <p className="mt-1 text-sm text-red-600 font-['Switzer-Regular']">
                  {languageData.de.validation.required} / {languageData.en.validation.required}
                </p>
              )}
            </div>
            
            {/* Total foreign income */}
            <div>
              <Label className="block space-y-1 text-neutral-800 font-['Switzer-Medium']">
                <span>Wie hoch war das gesamte im Ausland erzielte Einkommen?</span>
                <span className="text-sm text-neutral-600 font-['Switzer-Regular'] block">What was the total foreign income earned?</span>
              </Label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.incomeInfo.foreignIncomeAmount || 0}
                onChange={(e) => handleChange('incomeInfo', 'foreignIncomeAmount', parseFloat(e.target.value) || 0)}
                className={getInputClass('incomeInfo', 'foreignIncomeAmount')}
                required
              />
              {hasError('incomeInfo', 'foreignIncomeAmount') && (
                <p className="mt-1 text-sm text-red-600 font-['Switzer-Regular']">
                  {languageData.de.validation.positiveNumber} / {languageData.en.validation.positiveNumber}
                </p>
              )}
            </div>
            
            {/* Foreign tax paid */}
            <div>
              <Label className="block space-y-1 text-neutral-800 font-['Switzer-Medium']">
                <span>Wie viel Steuer wurde im Ausland bereits gezahlt?</span>
                <span className="text-sm text-neutral-600 font-['Switzer-Regular'] block">How much tax was already paid abroad?</span>
              </Label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.incomeInfo.foreignIncomeTaxPaid || 0}
                onChange={(e) => handleChange('incomeInfo', 'foreignIncomeTaxPaid', parseFloat(e.target.value) || 0)}
                className={getInputClass('incomeInfo', 'foreignIncomeTaxPaid')}
                required
              />
              {hasError('incomeInfo', 'foreignIncomeTaxPaid') && (
                <p className="mt-1 text-sm text-red-600 font-['Switzer-Regular']">
                  {languageData.de.validation.positiveNumber} / {languageData.en.validation.positiveNumber}
                </p>
              )}
            </div>
            
            {/* Foreign tax certificate */}
            <div>
              <Label className="block space-y-1 text-neutral-800 font-['Switzer-Medium']">
                <span>Bitte laden Sie die entsprechende ausländische Steuerbescheinigung hoch:</span>
                <span className="text-sm text-neutral-600 font-['Switzer-Regular'] block">Please upload the corresponding foreign tax certificate:</span>
              </Label>
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleChange('incomeInfo', 'foreignIncomeTaxCertificateFile', e.target.files[0].name);
                  }
                }}
                className="mt-1 block w-full text-sm text-neutral-700
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-['Switzer-Medium']
                          file:bg-neutral-100 file:text-neutral-700
                          hover:file:bg-neutral-200"
                required
              />
              {hasError('incomeInfo', 'foreignIncomeTaxCertificateFile') && (
                <p className="mt-1 text-sm text-red-600 font-['Switzer-Regular']">
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