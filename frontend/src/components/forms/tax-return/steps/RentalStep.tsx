import React from 'react';
import { FormSection, Label } from '../utils/UIComponents';
import { TaxFormData } from '../taxTypes';
import languageData from '../i18n/language.json';

interface RentalStepProps {
  formData: TaxFormData;
  handleChange: (section: keyof TaxFormData, field: string, value: any) => void;
  validationErrors: Record<string, any> | null;
  hasError: (section: string, field: string) => boolean;
}

const RentalStep: React.FC<RentalStepProps> = ({
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

  // Helper to check nested address errors
  const hasAddressError = (field: string) => {
    return validationErrors?.incomeInfo?.rentalPropertyAddress?.[field];
  };

  return (
    <FormSection title={`${languageData.de.steps.rental} / ${languageData.en.steps.rental}`}>
      <div className="space-y-6">
        {/* Rental property status */}
        <div>
          <Label className="block space-y-1 text-neutral-800 font-['Switzer-Medium']">
            <span>Vermieten Sie eine Immobilie oder einen Teil einer Immobilie?</span>
            <span className="text-sm text-neutral-600 font-['Switzer-Regular'] block">Do you rent out a property or part of a property?</span>
          </Label>
          <div className="flex space-x-4 mt-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="rentalPropertyNo"
                name="rentalProperty"
                checked={formData.incomeInfo.hasRentalProperty === false}
                onChange={() => handleChange('incomeInfo', 'hasRentalProperty', false)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                required
              />
              <label htmlFor="rentalPropertyNo" className="ml-2 text-neutral-700 font-['Switzer-Regular']">Nein / No</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="rentalPropertyYes"
                name="rentalProperty"
                checked={formData.incomeInfo.hasRentalProperty === true}
                onChange={() => handleChange('incomeInfo', 'hasRentalProperty', true)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                required
              />
              <label htmlFor="rentalPropertyYes" className="ml-2 text-neutral-700 font-['Switzer-Regular']">Ja / Yes</label>
            </div>
          </div>
          {hasError('incomeInfo', 'hasRentalProperty') && (
            <p className="mt-1 text-sm text-red-600 font-['Switzer-Regular']">
              {languageData.de.validation.required} / {languageData.en.validation.required}
            </p>
          )}
        </div>
        
        {/* Conditional fields when has rental property */}
        {formData.incomeInfo.hasRentalProperty && (
          <div className="space-y-4 ml-6">
            {/* Rental income */}
            <div>
              <Label className="block space-y-1 text-neutral-800 font-['Switzer-Medium']">
                <span>Wenn ja, wie hoch waren Ihre Mieteinnahmen im letzten Jahr?</span>
                <span className="text-sm text-neutral-600 font-['Switzer-Regular'] block">If yes, what was your rental income last year?</span>
              </Label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.incomeInfo.rentalIncome || 0}
                onChange={(e) => handleChange('incomeInfo', 'rentalIncome', parseFloat(e.target.value) || 0)}
                className={getInputClass('incomeInfo', 'rentalIncome')}
                required
              />
              {hasError('incomeInfo', 'rentalIncome') && (
                <p className="mt-1 text-sm text-red-600 font-['Switzer-Regular']">
                  {languageData.de.validation.positiveNumber} / {languageData.en.validation.positiveNumber}
                </p>
              )}
            </div>
            
            {/* Rental costs */}
            <div>
              <Label className="block space-y-1 text-neutral-800 font-['Switzer-Medium']">
                <span>Welche Kosten sind Ihnen für die Vermietung entstanden (z.B. Reparaturen, Versicherungen)?</span>
                <span className="text-sm text-neutral-600 font-['Switzer-Regular'] block">What costs did you incur for the rental (e.g., repairs, insurance)?</span>
              </Label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.incomeInfo.rentalCosts || 0}
                onChange={(e) => handleChange('incomeInfo', 'rentalCosts', parseFloat(e.target.value) || 0)}
                className={getInputClass('incomeInfo', 'rentalCosts')}
                required
              />
              {hasError('incomeInfo', 'rentalCosts') && (
                <p className="mt-1 text-sm text-red-600 font-['Switzer-Regular']">
                  {languageData.de.validation.positiveNumber} / {languageData.en.validation.positiveNumber}
                </p>
              )}
            </div>
            
            {/* Property address */}
            <div>
              <Label className="block space-y-1 text-neutral-800 font-['Switzer-Medium']">
                <span>Adresse der vermieteten Immobilie</span>
                <span className="text-sm text-neutral-600 font-['Switzer-Regular'] block">Address of the rented property</span>
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <Label className="block mb-1 text-sm text-neutral-800 font-['Switzer-Medium']">Straße / Street</Label>
                  <input
                    type="text"
                    value={formData.incomeInfo.rentalPropertyAddress?.street || ''}
                    onChange={(e) => handleChange('incomeInfo', 'rentalPropertyAddress', {
                      ...formData.incomeInfo.rentalPropertyAddress,
                      street: e.target.value
                    })}
                    className={hasAddressError('street') ? "auth-input border-red-500" : "auth-input"}
                    required
                  />
                  {hasAddressError('street') && (
                    <p className="mt-1 text-sm text-red-600 font-['Switzer-Regular']">
                      {languageData.de.validation.required} / {languageData.en.validation.required}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="block mb-1 text-sm text-neutral-800 font-['Switzer-Medium']">Hausnummer / House number</Label>
                  <input
                    type="text"
                    value={formData.incomeInfo.rentalPropertyAddress?.houseNumber || ''}
                    onChange={(e) => handleChange('incomeInfo', 'rentalPropertyAddress', {
                      ...formData.incomeInfo.rentalPropertyAddress,
                      houseNumber: e.target.value
                    })}
                    className={hasAddressError('houseNumber') ? "auth-input border-red-500" : "auth-input"}
                    required
                  />
                  {hasAddressError('houseNumber') && (
                    <p className="mt-1 text-sm text-red-600 font-['Switzer-Regular']">
                      {languageData.de.validation.required} / {languageData.en.validation.required}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="block mb-1 text-sm text-neutral-800 font-['Switzer-Medium']">PLZ / Postal code</Label>
                  <input
                    type="text"
                    value={formData.incomeInfo.rentalPropertyAddress?.postalCode || ''}
                    onChange={(e) => handleChange('incomeInfo', 'rentalPropertyAddress', {
                      ...formData.incomeInfo.rentalPropertyAddress,
                      postalCode: e.target.value
                    })}
                    className={hasAddressError('postalCode') ? "auth-input border-red-500" : "auth-input"}
                    required
                  />
                  {hasAddressError('postalCode') && (
                    <p className="mt-1 text-sm text-red-600 font-['Switzer-Regular']">
                      {languageData.de.validation.required} / {languageData.en.validation.required}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="block mb-1 text-sm text-neutral-800 font-['Switzer-Medium']">Stadt / City</Label>
                  <input
                    type="text"
                    value={formData.incomeInfo.rentalPropertyAddress?.city || ''}
                    onChange={(e) => handleChange('incomeInfo', 'rentalPropertyAddress', {
                      ...formData.incomeInfo.rentalPropertyAddress,
                      city: e.target.value
                    })}
                    className={hasAddressError('city') ? "auth-input border-red-500" : "auth-input"}
                    required
                  />
                  {hasAddressError('city') && (
                    <p className="mt-1 text-sm text-red-600 font-['Switzer-Regular']">
                      {languageData.de.validation.required} / {languageData.en.validation.required}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </FormSection>
  );
};

export default RentalStep; 