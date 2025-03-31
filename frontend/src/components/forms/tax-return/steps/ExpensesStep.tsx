import React from 'react';
import { FormSection, Label, Input } from '../utils/UIComponents';
import { TaxFormData } from '../taxTypes';
import languageData from '../i18n/language.json';

interface ExpensesStepProps {
  formData: TaxFormData;
  handleChange: (section: keyof TaxFormData, field: string, value: any) => void;
  validationErrors: Record<string, any> | null;
  hasError: (section: string, field: string) => boolean;
  getInputClass?: (section: string, field: string) => string;
}

const ExpensesStep: React.FC<ExpensesStepProps> = ({
  formData,
  handleChange,
  validationErrors,
  hasError,
  getInputClass = () => "auth-input"
}) => {
  // Helper function to convert empty string to 0 for number fields
  const handleNumberChange = (section: keyof TaxFormData, field: string, value: string) => {
    const parsedValue = value === '' ? 0 : parseFloat(value);
    handleChange(section, field, parsedValue);
  };
  
  return (
    <div className="space-y-6">
      <FormSection 
        germanTitle={languageData.de.expenses.workRelatedExpenses}
        englishTitle={languageData.en.expenses.workRelatedExpenses}
      >
        {/* Work-related expenses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Commuting expenses */}
          <div className="form-group">
            <Label 
              htmlFor="commutingExpenses"
              germanText={<div className="font-bold">{languageData.de.expenses.commutingExpenses}</div>}
              englishText={<div className="text-neutral-600">{languageData.en.expenses.commutingExpenses}</div>}
            />
            <Input
              id="commutingExpenses"
              type="number"
              min={0}
              step={0.01}
              value={formData.expenses.commutingExpenses || 0}
              onChange={(e) => handleNumberChange('deductions', 'commutingExpenses', e.target.value)}
              className={hasError('deductions', 'commutingExpenses') ? "auth-input border-red-500" : "auth-input"}
            />
            {hasError('deductions', 'commutingExpenses') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.commutingExpenses}
              </p>
            )}
          </div>

          {/* Business trips and training costs */}
          <div className="form-group">
            <Label 
              htmlFor="businessTripsCosts"
              germanText={<div className="font-bold">{languageData.de.expenses.businessTripsCosts}</div>}
              englishText={<div className="text-neutral-600">{languageData.en.expenses.businessTripsCosts}</div>}
            />
            <Input
              id="businessTripsCosts"
              type="number"
              min={0}
              step={0.01}
              value={formData.expenses.businessTripsCosts || 0}
              onChange={(e) => handleNumberChange('deductions', 'businessTripsCosts', e.target.value)}
              className={hasError('deductions', 'businessTripsCosts') ? "auth-input border-red-500" : "auth-input"}
            />
            {hasError('deductions', 'businessTripsCosts') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.businessTripsCosts}
              </p>
            )}
          </div>

          {/* Work equipment */}
          <div className="form-group">
            <Label 
              htmlFor="workEquipment"
              germanText={<div className="font-bold">{languageData.de.expenses.workEquipment}</div>}
              englishText={<div className="text-neutral-600">{languageData.en.expenses.workEquipment}</div>}
            />
            <Input
              id="workEquipment"
              type="number"
              min={0}
              step={0.01}
              value={formData.expenses.workEquipment || 0}
              onChange={(e) => handleNumberChange('deductions', 'workEquipment', e.target.value)}
              className={hasError('deductions', 'workEquipment') ? "auth-input border-red-500" : "auth-input"}
            />
            {hasError('deductions', 'workEquipment') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.workEquipment}
              </p>
            )}
          </div>
          <div className="form-group">
            <Label className="block space-y-1"
            htmlFor="homeOfficeAllowance"
            germanText={<div className="font-bold">{languageData.de.expenses.homeOfficeAllowance}</div>}
            englishText={<div className="text-neutral-600">{languageData.en.expenses.homeOfficeAllowance}</div>}
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.expenses.homeOfficeAllowance || 0}
              onChange={(e) => handleChange('deductions', 'homeOfficeAllowance', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.homeOfficeAllowance ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
            {hasError('deductions', 'homeOfficeAllowance') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.homeOfficeAllowance}
              </p>
            )}
          </div>

          {/* Membership fees and insurance */}
          <div>
            <Label className="block space-y-1"
            htmlFor="membershipFees"
            germanText={<div className="font-bold">{languageData.de.expenses.membershipFees}</div>}
            englishText={<div className="text-neutral-600">{languageData.en.expenses.membershipFees}</div>}
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.expenses.membershipFees || 0}
              onChange={(e) => handleChange('deductions', 'membershipFees', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.membershipFees ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
            {hasError('deductions', 'membershipFees') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.membershipFees}
              </p>
            )}
          </div>

          {/* Application costs */}
          <div>
            <Label className="block space-y-1"
            htmlFor="applicationCosts"
            germanText={<div className="font-bold">{languageData.de.expenses.applicationCosts}</div>}
            englishText={<div className="text-neutral-600">{languageData.en.expenses.applicationCosts}</div>}
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.expenses.applicationCosts || 0}
              onChange={(e) => handleChange('deductions', 'applicationCosts', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.applicationCosts ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
            {hasError('deductions', 'applicationCosts') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.applicationCosts}
              </p>
            )}
          </div>

          {/* Double household management */}
          <div>
            <Label className="block space-y-1"
            htmlFor="doubleHouseholdCosts"
            germanText={<div className="font-bold">{languageData.de.expenses.doubleHouseholdCosts}</div>}
            englishText={<div className="text-neutral-600">{languageData.en.expenses.doubleHouseholdCosts}</div>}
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.expenses.doubleHouseholdCosts || 0}
              onChange={(e) => handleChange('deductions', 'doubleHouseholdCosts', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.doubleHouseholdCosts ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
            {hasError('deductions', 'doubleHouseholdCosts') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.doubleHouseholdCosts}
              </p>
            )}
          </div>
        </div>
      </FormSection>      
            
      <FormSection 
        germanTitle={languageData.de.expenses.specialExpenses}
        englishTitle={languageData.en.expenses.specialExpenses}
      >       
        {/* Special expenses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Church Tax */}
          <div className="form-group">
            <Label className="block space-y-1"
            htmlFor="churchTax"
            germanText={<div className="font-bold">{languageData.de.expenses.churchTax}</div>}
            englishText={<div className="text-neutral-600">{languageData.en.expenses.churchTax}</div>}
            />  
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.expenses.churchTax || 0}
              onChange={(e) => handleChange('deductions', 'churchTax', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.churchTax ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
            {hasError('deductions', 'churchTax') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.churchTax}
              </p>
            )}
          </div>

          {/* Donations and Membership Fees */}
          <div className="form-group">
            <Label className="block space-y-1"
            htmlFor="donationsAndFees"
            germanText={<div className="font-bold">{languageData.de.expenses.donationsAndFees}</div>}
            englishText={<div className="text-neutral-600">{languageData.en.expenses.donationsAndFees}</div>}
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.expenses.donationsAndFees || 0}
              onChange={(e) => handleChange('deductions', 'donationsAndFees', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.donationsAndFees ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
            {hasError('deductions', 'donationsAndFees') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.donationsAndFees}
              </p>
            )}
          </div>

          {/* Childcare Costs */}
          <div className="form-group">
            <Label className="block space-y-1"
            htmlFor="childcareCosts"
            germanText={<div className="font-bold">{languageData.de.expenses.childcareCosts}</div>}
            englishText={<div className="text-neutral-600">{languageData.en.expenses.childcareCosts}</div>}
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.expenses.childcareCosts || 0}
              onChange={(e) => handleChange('deductions', 'childcareCosts', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.childcareCosts ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
            {hasError('deductions', 'childcareCosts') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.childcareCosts}
              </p>
            )}
          </div>

          {/* Support Payments */}
          <div className="form-group">
            <Label className="block space-y-1"
            htmlFor="supportPayments"
            germanText={<div className="font-bold">{languageData.de.expenses.supportPayments}</div>}
            englishText={<div className="text-neutral-600">{languageData.en.expenses.supportPayments}</div>}
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.expenses.supportPayments || 0}
              onChange={(e) => handleChange('deductions', 'supportPayments', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.supportPayments ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
            {hasError('deductions', 'supportPayments') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.supportPayments}
              </p>
            )}
          </div>

          {/* Private School Fees */}
          <div className="form-group">
            <Label className="block space-y-1"
            htmlFor="privateSchoolFees"
            germanText={<div className="font-bold">{languageData.de.expenses.privateSchoolFees}</div>}
            englishText={<div className="text-neutral-600">{languageData.en.expenses.privateSchoolFees}</div>}
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.expenses.privateSchoolFees || 0}
              onChange={(e) => handleChange('deductions', 'privateSchoolFees', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.privateSchoolFees ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
            {hasError('deductions', 'privateSchoolFees') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.privateSchoolFees}
              </p>
            )}
          </div>

          {/* Retirement Provisions */}
          <div className="form-group">
            <Label className="block space-y-1"
            htmlFor="retirementProvisions"
            germanText={<div className="font-bold">{languageData.de.expenses.retirementProvisions}</div>}
            englishText={<div className="text-neutral-600">{languageData.en.expenses.retirementProvisions}</div>}
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.expenses.retirementProvisions || 0}
              onChange={(e) => handleChange('deductions', 'retirementProvisions', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.retirementProvisions ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
            {hasError('deductions', 'retirementProvisions') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.retirementProvisions}
              </p>
            )}
          </div>

          {/* Other Insurance Expenses */}
          <div className="form-group">
            <Label className="block space-y-1"
            htmlFor="otherInsuranceExpenses"
            germanText={<div className="font-bold">{languageData.de.expenses.otherInsuranceExpenses}</div>}
            englishText={<div className="text-neutral-600">{languageData.en.expenses.otherInsuranceExpenses}</div>}
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.expenses.otherInsuranceExpenses || 0}
              onChange={(e) => handleChange('deductions', 'otherInsuranceExpenses', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.otherInsuranceExpenses ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
            {hasError('deductions', 'otherInsuranceExpenses') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.otherInsuranceExpenses}
              </p>
            )}
          </div>

          {/* Professional Training Costs */}
          <div className="form-group">
            <Label className="block space-y-1"
            htmlFor="professionalTrainingCosts"
            germanText={<div className="font-bold">{languageData.de.expenses.professionalTrainingCosts}</div>}
            englishText={<div className="text-neutral-600">{languageData.en.expenses.professionalTrainingCosts}</div>}
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.expenses.professionalTrainingCosts || 0}
              onChange={(e) => handleChange('deductions', 'professionalTrainingCosts', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.professionalTrainingCosts ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
            {hasError('deductions', 'professionalTrainingCosts') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.professionalTrainingCosts}
              </p>
            )}
          </div>
        </div>
        </FormSection>      
            
        <FormSection 
        germanTitle={languageData.de.expenses.extraordinaryExpenses}
        englishTitle={languageData.en.expenses.extraordinaryExpenses}
        >        
        {/* Extraordinary expenses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Medical Expenses */}
          <div className="form-group"> 
            <Label className="block space-y-1"
            htmlFor="medicalExpenses"
            germanText={<div className="font-bold">{languageData.de.expenses.medicalExpenses}</div>}
            englishText={<div className="text-neutral-600">{languageData.en.expenses.medicalExpenses}</div>}
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.expenses.medicalExpenses || 0}
              onChange={(e) => handleChange('deductions', 'medicalExpenses', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.medicalExpenses ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
            {hasError('deductions', 'medicalExpenses') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.medicalExpenses}
              </p>
            )}
          </div>

          {/* Cure and Rehabilitation Costs */}
          <div className="form-group">
            <Label className="block space-y-1"
            htmlFor="rehabilitationCosts"
            germanText={<div className="font-bold">{languageData.de.expenses.rehabilitationCosts}</div>}
            englishText={<div className="text-neutral-600">{languageData.en.expenses.rehabilitationCosts}</div>}
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.expenses.rehabilitationCosts || 0}
              onChange={(e) => handleChange('deductions', 'rehabilitationCosts', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.rehabilitationCosts ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
            {hasError('deductions', 'rehabilitationCosts') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.rehabilitationCosts}
              </p>
            )}
          </div>

          {/* Care Costs */}
          <div className="form-group">
            <Label className="block space-y-1"
            htmlFor="careCosts"
            germanText={<div className="font-bold">{languageData.de.expenses.careCosts}</div>}
            englishText={<div className="text-neutral-600">{languageData.en.expenses.careCosts}</div>}
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.expenses.careCosts || 0}
              onChange={(e) => handleChange('deductions', 'careCosts', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.careCosts ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
            {hasError('deductions', 'careCosts') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.careCosts}
              </p>
            )}
          </div>

          {/* Disability-related Expenses */}
          <div className="form-group">
            <Label className="block space-y-1"
            htmlFor="disabilityExpenses"
            germanText={<div className="font-bold">{languageData.de.expenses.disabilityExpenses}</div>}
            englishText={<div className="text-neutral-600">{languageData.en.expenses.disabilityExpenses}</div>}
            />  
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.expenses.disabilityExpenses || 0}
              onChange={(e) => handleChange('deductions', 'disabilityExpenses', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.disabilityExpenses ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
            {hasError('deductions', 'disabilityExpenses') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.disabilityExpenses}
              </p>
            )}
          </div>

          {/* Funeral Costs */}
          <div className="form-group">
            <Label className="block space-y-1"
            htmlFor="funeralCosts"
            germanText={<div className="font-bold">{languageData.de.expenses.funeralCosts}</div>}
            englishText={<div className="text-neutral-600">{languageData.en.expenses.funeralCosts}</div>}
            />  
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.expenses.funeralCosts || 0}
              onChange={(e) => handleChange('deductions', 'funeralCosts', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.funeralCosts ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
            {hasError('deductions', 'funeralCosts') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.funeralCosts}
              </p>
            )}
          </div>


          {/* Support Costs for Needy Relatives */}
          <div className="form-group">
            <Label className="block space-y-1"
            htmlFor="relativesSupportCosts"
            germanText={<div className="font-bold">{languageData.de.expenses.relativesSupportCosts}</div>}
            englishText={<div className="text-neutral-600">{languageData.en.expenses.relativesSupportCosts}</div>}
            />  
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.expenses.relativesSupportCosts || 0}
              onChange={(e) => handleChange('deductions', 'relativesSupportCosts', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.relativesSupportCosts ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
            {hasError('deductions', 'relativesSupportCosts') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.relativesSupportCosts}
              </p>
            )}
          </div>

          {/* Divorce Costs */}
          <div>
            <Label className="block space-y-1"
            htmlFor="divorceCosts"
            germanText={<div className="font-bold">{languageData.de.expenses.divorceCosts}</div>}
            englishText={<div className="text-neutral-600">{languageData.en.expenses.divorceCosts}</div>}
            />  
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.expenses.divorceCosts || 0}
              onChange={(e) => handleChange('deductions', 'divorceCosts', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.divorceCosts ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
            {hasError('deductions', 'divorceCosts') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.divorceCosts}
              </p>
            )}
          </div>
        </div>
        </FormSection>      

        <FormSection 
        germanTitle={languageData.de.expenses.insurancePremiums}
        englishTitle={languageData.en.expenses.insurancePremiums}
        >    
        {/* Insurance premiums */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="insurancePremiums">

          {/* Statutory Health and Long-term Care Insurance */}
          <div className="form-group">
            <Label className="block space-y-1"
            htmlFor="statutoryHealthInsurance"
            germanText={<div className="font-bold">{languageData.de.expenses.statutoryHealthInsurance}</div>}
            englishText={<div className="text-neutral-600">{languageData.en.expenses.statutoryHealthInsurance}</div>}
            />  
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.expenses.statutoryHealthInsurance || 0}
              onChange={(e) => handleChange('deductions', 'statutoryHealthInsurance', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.statutoryHealthInsurance ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
            {hasError('deductions', 'statutoryHealthInsurance') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.statutoryHealthInsurance}
              </p>
            )}
          </div>

          {/* Private Health and Long-term Care Insurance */}
          <div className="form-group">
            <Label className="block space-y-1"
            htmlFor="privateHealthInsurance"
            germanText={<div className="font-bold">{languageData.de.expenses.privateHealthInsurance}</div>}
            englishText={<div className="text-neutral-600">{languageData.en.expenses.privateHealthInsurance}</div>}
            />  
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.expenses.privateHealthInsurance || 0}
              onChange={(e) => handleChange('deductions', 'privateHealthInsurance', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.privateHealthInsurance ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
            {hasError('deductions', 'privateHealthInsurance') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.privateHealthInsurance}
              </p>
            )}
          </div>

          {/* Statutory Pension Insurance */}
          <div className="form-group">
            <Label className="block space-y-1"
            htmlFor="statutoryPensionInsurance"
            germanText={<div className="font-bold">{languageData.de.expenses.statutoryPensionInsurance}</div>}
            englishText={<div className="text-neutral-600">{languageData.en.expenses.statutoryPensionInsurance}</div>}
            />  
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.expenses.statutoryPensionInsurance || 0}
              onChange={(e) => handleChange('deductions', 'statutoryPensionInsurance', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.statutoryPensionInsurance ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
            {hasError('deductions', 'statutoryPensionInsurance') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.statutoryPensionInsurance}
              </p>
            )}
          </div>

          {/* Private Pension Insurance (Rürup) */}
          <div className="form-group">
            <Label className="block space-y-1"
            htmlFor="privatePensionInsurance"
            germanText={<div className="font-bold">{languageData.de.expenses.privatePensionInsurance}</div>}
            englishText={<div className="text-neutral-600">{languageData.en.expenses.privatePensionInsurance}</div>}
            />  
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.expenses.privatePensionInsurance || 0}
              onChange={(e) => handleChange('deductions', 'privatePensionInsurance', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.privatePensionInsurance ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
            {hasError('deductions', 'privatePensionInsurance') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.privatePensionInsurance}
              </p>
            )}
          </div>

          {/* Unemployment Insurance */}
          <div className="form-group">
            <Label className="block space-y-1"
            htmlFor="unemploymentInsurance"
            germanText={<div className="font-bold">{languageData.de.expenses.unemploymentInsurance}</div>}
            englishText={<div className="text-neutral-600">{languageData.en.expenses.unemploymentInsurance}</div>}
            />  
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.expenses.unemploymentInsurance || 0}
              onChange={(e) => handleChange('deductions', 'unemploymentInsurance', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.unemploymentInsurance ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
            {hasError('deductions', 'unemploymentInsurance') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.unemploymentInsurance}
              </p>
            )}
          </div>

          {/* Accident and Liability Insurance */}
          <div className="form-group">
            <Label className="block space-y-1"
            htmlFor="accidentLiabilityInsurance"
            germanText={<div className="font-bold">{languageData.de.expenses.accidentLiabilityInsurance}</div>}
            englishText={<div className="text-neutral-600">{languageData.en.expenses.accidentLiabilityInsurance}</div>}
            />  
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.expenses.accidentLiabilityInsurance || 0}
              onChange={(e) => handleChange('deductions', 'accidentLiabilityInsurance', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.accidentLiabilityInsurance ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
            {hasError('deductions', 'accidentLiabilityInsurance') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.accidentLiabilityInsurance}
              </p>
            )}
          </div>

          {/* Disability Insurance */}
          <div className="form-group">
            <Label className="block space-y-1"
            htmlFor="disabilityInsurance"
            germanText={<div className="font-bold">{languageData.de.expenses.disabilityInsurance}</div>}
            englishText={<div className="text-neutral-600">{languageData.en.expenses.disabilityInsurance}</div>}
            />  
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.expenses.disabilityInsurance || 0}
              onChange={(e) => handleChange('deductions', 'disabilityInsurance', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.disabilityInsurance ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
            {hasError('deductions', 'disabilityInsurance') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.disabilityInsurance}
              </p>
            )}
          </div>

          {/* Term Life Insurance */}
          <div className="form-group">
            <Label className="block space-y-1"
            htmlFor="termLifeInsurance"
            germanText={<div className="font-bold">{languageData.de.expenses.termLifeInsurance}</div>}
            englishText={<div className="text-neutral-600">{languageData.en.expenses.termLifeInsurance}</div>}
            />  
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.expenses.termLifeInsurance || 0}
              onChange={(e) => handleChange('deductions', 'termLifeInsurance', parseFloat(e.target.value) || 0)}
              className={validationErrors?.deductions?.termLifeInsurance ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
            />
            {hasError('deductions', 'termLifeInsurance') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.deductions?.termLifeInsurance}
              </p>
            )}
          </div>
        </div>
        </FormSection> 

        <FormSection 
        germanTitle={languageData.de.expenses.hasCraftsmenServices}
        englishTitle={languageData.en.expenses.hasCraftsmenServices}
        >     
        {/* Craftsmen services */}
        <div className="form-group">
          <div className="flex space-x-4 mt-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="craftsmenNo"
                name="craftsmen"
                checked={formData.expenses.hasCraftsmenPayments === false}
                onChange={() => handleChange('deductions', 'hasCraftsmenPayments', false)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                required
              />
              <label htmlFor="craftsmenNo" className="ml-2">Nein / No</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="craftsmenYes"
                name="craftsmen"
                checked={formData.expenses.hasCraftsmenPayments === true}
                onChange={() => handleChange('deductions', 'hasCraftsmenPayments', true)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                required
              />
              <label htmlFor="craftsmenYes" className="ml-2">Ja / Yes</label>
            </div>
          </div>
          {hasError('deductions', 'hasCraftsmenPayments') && (
            <p className="mt-1 text-sm text-red-600">
              {languageData.de.validation.required} / {languageData.en.validation.required}
            </p>
          )}
          
          {/* Conditional fields for craftsmen services */}
          {formData.expenses.hasCraftsmenPayments && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="craftsmenServices">
              <div className="form-group">
                <Label className="block space-y-1"
                htmlFor="craftsmenAmount"
                germanText={<div className="font-bold">Wie hoch waren die Kosten für Handwerkerleistungen?</div>}
                englishText={<div className="text-neutral-600">How much did you pay for craftsmen services?</div>}
                />  
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.expenses.craftsmenAmount || 0}
                  onChange={(e) => handleChange('deductions', 'craftsmenAmount', parseFloat(e.target.value) || 0)}
                  className={validationErrors?.deductions?.craftsmenAmount ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                  required
                />
                {hasError('deductions', 'craftsmenAmount') && (
                  <p className="mt-1 text-sm text-red-600">
                    {languageData.de.validation.positiveNumber} / {languageData.en.validation.positiveNumber}
                  </p>
                )}
              </div>
              
              <div className="form-group">
                <Label className="block space-y-1"
                htmlFor="craftsmenInvoiceFile"
                germanText={<div className="font-bold">Bitte laden Sie die Rechnung für die Handwerkerleistungen hoch:</div>}
                englishText={<div className="text-neutral-600">Please upload the invoice for craftsmen services:</div>}
                />  
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleChange('deductions', 'craftsmenInvoiceFile', e.target.files[0].name);
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
                {hasError('deductions', 'craftsmenInvoiceFile') && (
                  <p className="mt-1 text-sm text-red-600">
                    {languageData.de.validation.required} / {languageData.en.validation.required}
                  </p>
                )}
              </div>

              {/* Household Services */}
              <div className="form-group">
                <Label className="block space-y-1"
                htmlFor="householdServices"
                germanText={<div className="font-bold">{languageData.de.expenses.householdServices}</div>}
                englishText={<div className="text-neutral-600">{languageData.en.expenses.householdServices}</div>}
                />  
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.expenses.householdServices || 0}
                  onChange={(e) => handleChange('deductions', 'householdServices', parseFloat(e.target.value) || 0)}
                  className={validationErrors?.deductions?.householdServices ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                />
              </div>

              {/* Craftsmen Services */}
              <div className="form-group">
                <Label className="block space-y-1"
                htmlFor="craftsmenServices"
                germanText={<div className="font-bold">{languageData.de.expenses.craftsmenServices}</div>}
                englishText={<div className="text-neutral-600">{languageData.en.expenses.craftsmenServices}</div>}
                />  
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.expenses.craftsmenServices || 0}
                  onChange={(e) => handleChange('deductions', 'craftsmenServices', parseFloat(e.target.value) || 0)}
                  className={validationErrors?.deductions?.craftsmenServices ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                />
                {hasError('deductions', 'craftsmenServices') && (
                  <p className="mt-1 text-sm text-red-600">
                    {languageData.de.validation.positiveNumber} / {languageData.en.validation.positiveNumber}
                  </p>
                )}
              </div>

              {/* Gardening and Winter Services */}
              <div className="form-group">
                <Label className="block space-y-1"
                htmlFor="gardeningServices"
                germanText={<div className="font-bold">{languageData.de.expenses.gardeningServices}</div>}
                englishText={<div className="text-neutral-600">{languageData.en.expenses.gardeningServices}</div>}
                />  
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.expenses.gardeningServices || 0}
                  onChange={(e) => handleChange('deductions', 'gardeningServices', parseFloat(e.target.value) || 0)}
                  className={validationErrors?.deductions?.gardeningServices ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                />
                {hasError('deductions', 'gardeningServices') && (
                  <p className="mt-1 text-sm text-red-600">
                    {languageData.de.validation.positiveNumber} / {languageData.en.validation.positiveNumber}
                  </p>
                )}
              </div>

              {/* Cleaning Services */}
              <div className="form-group">
                <Label className="block space-y-1"
                htmlFor="cleaningServices"
                germanText={<div className="font-bold">{languageData.de.expenses.cleaningServices}</div>}
                englishText={<div className="text-neutral-600">{languageData.en.expenses.cleaningServices}</div>}
                />  
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.expenses.cleaningServices || 0}
                  onChange={(e) => handleChange('deductions', 'cleaningServices', parseFloat(e.target.value) || 0)}
                  className={validationErrors?.deductions?.cleaningServices ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                />
                {hasError('deductions', 'cleaningServices') && (
                  <p className="mt-1 text-sm text-red-600">
                    {languageData.de.validation.positiveNumber} / {languageData.en.validation.positiveNumber}
                  </p>
                )}
              </div>

              {/* Caretaker Services */}
              <div className="form-group">
                <Label className="block space-y-1"
                htmlFor="caretakerServices"
                germanText={<div className="font-bold">{languageData.de.expenses.caretakerServices}</div>}
                englishText={<div className="text-neutral-600">{languageData.en.expenses.caretakerServices}</div>}
                />  
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.expenses.caretakerServices || 0}
                  onChange={(e) => handleChange('deductions', 'caretakerServices', parseFloat(e.target.value) || 0)}
                  className={validationErrors?.deductions?.caretakerServices ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                />
                {hasError('deductions', 'caretakerServices') && (
                  <p className="mt-1 text-sm text-red-600">
                    {languageData.de.validation.positiveNumber} / {languageData.en.validation.positiveNumber}
                  </p>
                )}
              </div>

              {/* Care Costs */}
              <div className="form-group">
                <Label className="block space-y-1"
                htmlFor="householdCareCosts"
                germanText={<div className="font-bold">{languageData.de.expenses.householdCareCosts}</div>}
                englishText={<div className="text-neutral-600">{languageData.en.expenses.householdCareCosts}</div>}
                />  
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.expenses.householdCareCosts || 0}
                  onChange={(e) => handleChange('deductions', 'householdCareCosts', parseFloat(e.target.value) || 0)}
                  className={validationErrors?.deductions?.householdCareCosts ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                />
                {hasError('deductions', 'householdCareCosts') && (
                  <p className="mt-1 text-sm text-red-600">
                    {languageData.de.validation.positiveNumber} / {languageData.en.validation.positiveNumber}
                  </p>
                )}
              </div>

              {/* Care and Support Services */}
              <div className="form-group">
                <Label className="block space-y-1"
                htmlFor="householdSupportServices"
                germanText={<div className="font-bold">{languageData.de.expenses.householdSupportServices}</div>}
                englishText={<div className="text-neutral-600">{languageData.en.expenses.householdSupportServices}</div>}
                />  
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.expenses.householdSupportServices || 0}
                  onChange={(e) => handleChange('deductions', 'householdSupportServices', parseFloat(e.target.value) || 0)}
                  className={validationErrors?.deductions?.householdSupportServices ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                />
                {hasError('deductions', 'householdSupportServices') && (
                  <p className="mt-1 text-sm text-red-600">
                    {languageData.de.validation.positiveNumber} / {languageData.en.validation.positiveNumber}
                  </p>
                )}
              </div>

              {/* Chimney Sweep Fees */}
              <div className="form-group">
                <Label className="block space-y-1"
                htmlFor="chimneySweepFees"
                germanText={<div className="font-bold">{languageData.de.expenses.chimneySweepFees}</div>}
                englishText={<div className="text-neutral-600">{languageData.en.expenses.chimneySweepFees}</div>}
                />  
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.expenses.chimneySweepFees || 0}
                  onChange={(e) => handleChange('deductions', 'chimneySweepFees', parseFloat(e.target.value) || 0)}
                  className={validationErrors?.deductions?.chimneySweepFees ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                />
                {hasError('deductions', 'chimneySweepFees') && (
                  <p className="mt-1 text-sm text-red-600">
                    {languageData.de.validation.positiveNumber} / {languageData.en.validation.positiveNumber}
                  </p>
                )}
              </div>

              {/* Emergency System Costs */}
              <div className="form-group">
                <Label className="block space-y-1"
                htmlFor="emergencySystemCosts"
                germanText={<div className="font-bold">{languageData.de.expenses.emergencySystemCosts}</div>}
                englishText={<div className="text-neutral-600">{languageData.en.expenses.emergencySystemCosts}</div>}
                />  
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.expenses.emergencySystemCosts || 0}
                  onChange={(e) => handleChange('deductions', 'emergencySystemCosts', parseFloat(e.target.value) || 0)}
                  className={validationErrors?.deductions?.emergencySystemCosts ? "w-full p-2 border border-red-500 rounded-md" : "w-full p-2 border rounded-md"}
                />
                {hasError('deductions', 'emergencySystemCosts') && (
                  <p className="mt-1 text-sm text-red-600">
                    {languageData.de.validation.positiveNumber} / {languageData.en.validation.positiveNumber}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
        </FormSection>

        <FormSection 
        germanTitle={languageData.de.expenses.documents.title}
        englishTitle={languageData.en.expenses.documents.title}
        >
          <div className="space-y-4">
            {[
              { key: 'rentalContracts' as keyof typeof languageData.de.expenses.documents, required: false },
              { key: 'annualStatements' as keyof typeof languageData.de.expenses.documents, required: false },
              { key: 'operatingCosts' as keyof typeof languageData.de.expenses.documents, required: false },
              { key: 'propertyTax' as keyof typeof languageData.de.expenses.documents, required: false },
              { key: 'loanContracts' as keyof typeof languageData.de.expenses.documents, required: false },
              { key: 'repairBills' as keyof typeof languageData.de.expenses.documents, required: false },
              { key: 'craftsmenBills' as keyof typeof languageData.de.expenses.documents, required: false },
              { key: 'renovationProof' as keyof typeof languageData.de.expenses.documents, required: false },
              { key: 'insurancePremiums' as keyof typeof languageData.de.expenses.documents, required: false },
              { key: 'brokerFees' as keyof typeof languageData.de.expenses.documents, required: false },
              { key: 'rentalIncome' as keyof typeof languageData.de.expenses.documents, required: false },
              { key: 'vacancyProof' as keyof typeof languageData.de.expenses.documents, required: false },
              { key: 'managementCosts' as keyof typeof languageData.de.expenses.documents, required: false },
              { key: 'depreciationProof' as keyof typeof languageData.de.expenses.documents, required: false }
            ].map((doc) => (
              <div key={doc.key}>
                <Label className="block space-y-1"
                htmlFor={`documents_${doc.key}`}
                germanText={<div className="font-bold">{languageData.de.expenses.documents[doc.key]}</div>}
                englishText={<div className="text-neutral-600">{languageData.en.expenses.documents[doc.key]}</div>}
                />  
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      const fileNames = Array.from(e.target.files).map(file => file.name);
                      handleChange('deductions', `documents_${doc.key}`, fileNames);
                    }
                  }}
                  className="mt-1 block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                  required={doc.required}
                />
                {hasError('deductions', `documents_${doc.key}`) && (
                  <p className="mt-1 text-sm text-red-600">
                    {languageData.de.validation.required} / {languageData.en.validation.required}
                  </p>
                )}
              </div>
            ))}
          </div>
        </FormSection>
      </div>
    
  );
};

export default ExpensesStep; 