import React from 'react';
import { Label, FormSection, Input } from '../utils/UIComponents';
import { TaxFormData } from '../taxTypes';
import languageData from '../i18n/language.json';

interface DeductionsStepProps {
  formData: TaxFormData;
  handleChange: (section: keyof TaxFormData, field: string, value: any) => void;
  validationErrors: Record<string, any> | null;
  hasError: (section: string, field: string) => boolean;
  getInputClass?: (section: string, field: string) => string;
}

const DeductionsStep: React.FC<DeductionsStepProps> = ({
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
        germanTitle={languageData.de.deductions.workRelatedExpenses}
        englishTitle={languageData.en.deductions.workRelatedExpenses}
      >
        <div className="space-y-4">
          {/* Commuting Expenses */}
          <div className="form-group">
            <Label 
              htmlFor="commutingExpenses"
              germanText={languageData.de.deductions.commutingExpenses}
              englishText={languageData.en.deductions.commutingExpenses}
            />
            <Input
              id="commutingExpenses"
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.commutingExpenses || ''}
              onChange={(e) => handleNumberChange('deductions', 'commutingExpenses', e.target.value)}
              className={getInputClassWithError('deductions', 'commutingExpenses')}
            />
            {hasError('deductions', 'commutingExpenses') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.commutingExpenses}
              </p>
            )}
          </div>
        
          {/* Business Trip Costs */}
          <div className="form-group">
            <Label 
              htmlFor="businessTripsCosts"
              germanText={languageData.de.deductions.businessTripsCosts}
              englishText={languageData.en.deductions.businessTripsCosts}
            />
            <Input
              id="businessTripsCosts"
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.businessTripsCosts || ''}
              onChange={(e) => handleNumberChange('deductions', 'businessTripsCosts', e.target.value)}
              className={getInputClassWithError('deductions', 'businessTripsCosts')}
            />
            {hasError('deductions', 'businessTripsCosts') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.businessTripsCosts}
              </p>
            )}
          </div>
        
          {/* Work Equipment */}
          <div className="form-group">
            <Label 
              htmlFor="workEquipment"
              germanText={languageData.de.deductions.workEquipment}
              englishText={languageData.en.deductions.workEquipment}
            />
            <Input
              id="workEquipment"
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.workEquipment || ''}
              onChange={(e) => handleNumberChange('deductions', 'workEquipment', e.target.value)}
              className={getInputClassWithError('deductions', 'workEquipment')}
            />
            {hasError('deductions', 'workEquipment') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.workEquipment}
              </p>
            )}
          </div>
        
          {/* Home Office Allowance */}
          <div className="form-group">
            <Label 
              htmlFor="homeOfficeAllowance"
              germanText={languageData.de.deductions.homeOfficeAllowance}
              englishText={languageData.en.deductions.homeOfficeAllowance}
            />
            <Input
              id="homeOfficeAllowance"
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.homeOfficeAllowance || ''}
              onChange={(e) => handleNumberChange('deductions', 'homeOfficeAllowance', e.target.value)}
              className={getInputClassWithError('deductions', 'homeOfficeAllowance')}
            />
            {hasError('deductions', 'homeOfficeAllowance') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.homeOfficeAllowance}
              </p>
            )}
          </div>
        </div>
      </FormSection>
      
      <FormSection 
        germanTitle={languageData.de.deductions.specialExpenses}
        englishTitle={languageData.en.deductions.specialExpenses}
        className="mt-6"
      >
        <div className="space-y-4">
          {/* Church Tax */}
          <div className="form-group">
            <Label 
              htmlFor="churchTax"
              germanText={languageData.de.deductions.churchTax}
              englishText={languageData.en.deductions.churchTax}
            />
            <Input
              id="churchTax"
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.churchTax || ''}
              onChange={(e) => handleNumberChange('deductions', 'churchTax', e.target.value)}
              className={getInputClassWithError('deductions', 'churchTax')}
            />
            {hasError('deductions', 'churchTax') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.churchTax}
              </p>
            )}
          </div>
          
          {/* Donations */}
          <div className="form-group">
            <Label 
              htmlFor="donationsAndFees"
              germanText={languageData.de.deductions.donationsAndFees}
              englishText={languageData.en.deductions.donationsAndFees}
            />
            <Input
              id="donationsAndFees"
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.donationsAndFees || ''}
              onChange={(e) => handleNumberChange('deductions', 'donationsAndFees', e.target.value)}
              className={getInputClassWithError('deductions', 'donationsAndFees')}
            />
            {hasError('deductions', 'donationsAndFees') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.donationsAndFees}
              </p>
            )}
          </div>
        </div>
      </FormSection>
      
      <FormSection 
        germanTitle={languageData.de.deductions.insurancePremiums}
        englishTitle={languageData.en.deductions.insurancePremiums}
        className="mt-6"
      >
        <div className="space-y-4">
          {/* Health Insurance */}
          <div className="form-group">
            <Label 
              htmlFor="privateHealthInsurance"
              germanText={languageData.de.deductions.privateHealthInsurance}
              englishText={languageData.en.deductions.privateHealthInsurance}
            />
            <Input
              id="privateHealthInsurance"
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.privateHealthInsurance || ''}
              onChange={(e) => handleNumberChange('deductions', 'privateHealthInsurance', e.target.value)}
              className={getInputClassWithError('deductions', 'privateHealthInsurance')}
            />
            {hasError('deductions', 'privateHealthInsurance') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.privateHealthInsurance}
              </p>
            )}
          </div>
          
          {/* Pension Insurance */}
          <div className="form-group">
            <Label 
              htmlFor="privatePensionInsurance"
              germanText={languageData.de.deductions.privatePensionInsurance}
              englishText={languageData.en.deductions.privatePensionInsurance}
            />
            <Input
              id="privatePensionInsurance"
              type="number"
              min="0"
              step="0.01"
              value={formData.deductions.privatePensionInsurance || ''}
              onChange={(e) => handleNumberChange('deductions', 'privatePensionInsurance', e.target.value)}
              className={getInputClassWithError('deductions', 'privatePensionInsurance')}
            />
            {hasError('deductions', 'privatePensionInsurance') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.privatePensionInsurance}
              </p>
            )}
          </div>
        </div>
      </FormSection>
    </div>
  );
};

export default DeductionsStep; 