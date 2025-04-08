import React from 'react';
import FKInputField from '../../../ui/FKInputField';
import FKYesNo from '../../../ui/FKYesNo';
import FKFileField from '../../../ui/FKFileField';
import FKExpenseArray from '../../../ui/FKExpenseArray';
import { ValidationErrors } from '../validation';
import { LanguageCode } from '../constants';

interface TFExpensesProps {
  formData: { [key: string]: any };
  handleChange: (section: string, field: string, value: any) => void;
  selectedLanguage: LanguageCode;
  i18nData: any;
  germanI18nData: any;
  validationErrors: ValidationErrors | null;
  showValidationErrors: boolean;
}

// Helper component for section styling
const FormSection = ({ title, children }: { title: React.ReactNode, children: React.ReactNode }) => (
  <div className="border border-gray-200 rounded-md p-4 space-y-4">
    <h3 className="text-md font-semibold text-neutral-800">{title}</h3>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

// Helper component for address fields
const AddressFields = ({ 
  prefix,
  data,
  handleFieldChange,
  t,
  germanT,
  fieldHasError,
  getValidationMessage
}: { 
  prefix: string;
  data: any;
  handleFieldChange: (field: string, value: any) => void;
  t: any;
  germanT: any;
  fieldHasError: (field: string) => boolean;
  getValidationMessage: (field: string) => string | undefined;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <FKInputField
      id={`${prefix}.street`}
      mainLanguage={germanT?.street || 'Street (DE)'}
      selectedLanguage={t?.street || 'Street'}
      value={data?.street || ''}
      onChange={(e) => handleFieldChange(`${prefix}.street`, e.target.value)}
      mandatory={true}
      hasError={fieldHasError(`${prefix}.street`)}
      validationError={getValidationMessage(`${prefix}.street`)}
    />
    <FKInputField
      id={`${prefix}.houseNumber`}
      mainLanguage={germanT?.houseNumber || 'House Number (DE)'}
      selectedLanguage={t?.houseNumber || 'House Number'}
      value={data?.houseNumber || ''}
      onChange={(e) => handleFieldChange(`${prefix}.houseNumber`, e.target.value)}
      mandatory={true}
      hasError={fieldHasError(`${prefix}.houseNumber`)}
      validationError={getValidationMessage(`${prefix}.houseNumber`)}
    />
    <FKInputField
      id={`${prefix}.postalCode`}
      mainLanguage={germanT?.postalCode || 'Postal Code (DE)'}
      selectedLanguage={t?.postalCode || 'Postal Code'}
      value={data?.postalCode || ''}
      onChange={(e) => handleFieldChange(`${prefix}.postalCode`, e.target.value)}
      mandatory={true}
      hasError={fieldHasError(`${prefix}.postalCode`)}
      validationError={getValidationMessage(`${prefix}.postalCode`)}
    />
    <FKInputField
      id={`${prefix}.city`}
      mainLanguage={germanT?.city || 'City (DE)'}
      selectedLanguage={t?.city || 'City'}
      value={data?.city || ''}
      onChange={(e) => handleFieldChange(`${prefix}.city`, e.target.value)}
      mandatory={true}
      hasError={fieldHasError(`${prefix}.city`)}
      validationError={getValidationMessage(`${prefix}.city`)}
    />
  </div>
);

const TFExpenses: React.FC<TFExpensesProps> = ({
  formData,
  handleChange,
  selectedLanguage,
  i18nData,
  germanI18nData,
  validationErrors,
  showValidationErrors
}) => {
  
  // Helper to call handleChange with section prefix
  const handleFieldChange = (field: string, value: any) => {
    handleChange('expenses', field, value);
  };

  // Get translations - Fix German translations loading
  const t = i18nData?.taxForm?.expenses || {};
  const germanT = germanI18nData?.taxForm?.expenses || t;  // Remove fallback to t

  // Ensure section exists in formData
  const expensesData = formData.expenses || {};

  // --- Helper to get error message key for a field ---
  const getErrorKey = (field: string): string | undefined => {
    if (!showValidationErrors || !validationErrors?.expenses) {
      return undefined;
    }

    try {
      if (field.includes('.')) {
        const keys = field.split('.');
        let currentErrorLevel: any = validationErrors.expenses;
        for (const key of keys) {
          if (!currentErrorLevel || typeof currentErrorLevel !== 'object' || !(key in currentErrorLevel)) {
            return undefined;
          }
          currentErrorLevel = currentErrorLevel[key];
        }
        return typeof currentErrorLevel === 'string' ? currentErrorLevel : undefined;
      }

      const errorKey = validationErrors.expenses[field];
      return typeof errorKey === 'string' ? errorKey : undefined;
    } catch (e) {
      console.error("Error in getErrorKey for field:", field, e);
      return undefined;
    }
  };

  // --- Helper to check if a field has an error ---
  const fieldHasError = (field: string): boolean => {
    return !!getErrorKey(field);
  };

  // --- Helper to get bilingual validation message ---
  const getValidationMessage = (field: string): string | undefined => {
    const errorKey = getErrorKey(field);
    if (!errorKey) return undefined;

    const germanMsg = germanI18nData?.validation?.[errorKey];
    const selectedMsg = i18nData?.validation?.[errorKey];

    if (germanMsg && selectedMsg && germanMsg !== selectedMsg) {
      return `${germanMsg} / ${selectedMsg}`;
    } else {
      return germanMsg || selectedMsg || errorKey;
    }
  };

  return (
    <div className="space-y-6">
      {/* Work-Related Expenses Section */}
      <FormSection title={<>{germanT?.title} / {t.workRelatedExpenses?.title || 'Work-Related Expenses'}</>}>
        {/* Commuting Expenses */}
        <div className="border border-gray-100 rounded p-4 space-y-4">
          <h4 className="font-medium text-sm">{germanT?.workRelatedExpenses?.commutation?.title || 'Commuting Expenses (DE)'} / {t.workRelatedExpenses?.commutation?.title || 'Commuting Expenses'}</h4>
          
          <FKYesNo
            id="workRelatedExpenses.commutation.hasCommutingExpenses"
            mainLanguage={germanT?.workRelatedExpenses?.commutation?.hasCommutingExpenses || 'Do you have Commuting Expenses? (DE)'}
            selectedLanguage={t.workRelatedExpenses?.commutation?.hasCommutingExpenses || 'Do you have Commuting Expenses?'}
            value={expensesData.workRelatedExpenses?.commutation?.hasCommutingExpenses}
            onChange={(value) => handleFieldChange('workRelatedExpenses.commutation.hasCommutingExpenses', value)}
            mandatory={true}
            hasError={fieldHasError('workRelatedExpenses.commutation.hasCommutingExpenses')}
            validationError={getValidationMessage('workRelatedExpenses.commutation.hasCommutingExpenses')}
          />

          {expensesData.workRelatedExpenses?.commutation?.hasCommutingExpenses === true && (
            <div className="space-y-4">
              <FKInputField
                id="workRelatedExpenses.commutation.workingDaysCount"
                type="number"
                mainLanguage={germanT?.workRelatedExpenses?.commutation?.workingDaysCount || 'Number of working days (230 Max) (DE)'}
                selectedLanguage={t.workRelatedExpenses?.commutation?.workingDaysCount || 'Number of working days (230 Max)'}
                value={expensesData.workRelatedExpenses?.commutation?.workingDaysCount || ''}
                onChange={(e) => handleFieldChange('workRelatedExpenses.commutation.workingDaysCount', e.target.value)}
                mandatory={true}
                hasError={fieldHasError('workRelatedExpenses.commutation.workingDaysCount')}
                validationError={getValidationMessage('workRelatedExpenses.commutation.workingDaysCount')}
                min={0}
              />

              <div className="space-y-4">
                <h5 className="font-medium text-sm">From Address</h5>
                <AddressFields
                  prefix="workRelatedExpenses.commutation.route.from"
                  data={expensesData.workRelatedExpenses?.commutation?.route?.from}
                  handleFieldChange={handleFieldChange}
                  t={t.workRelatedExpenses?.commutation?.route?.from}
                  germanT={germanT?.workRelatedExpenses?.commutation?.route?.from}
                  fieldHasError={fieldHasError}
                  getValidationMessage={getValidationMessage}
                />
              </div>

              <div className="space-y-4">
                <h5 className="font-medium text-sm">First Office Address</h5>
                <AddressFields
                  prefix="workRelatedExpenses.commutation.route.firstOfficeAddress"
                  data={expensesData.workRelatedExpenses?.commutation?.route?.firstOfficeAddress}
                  handleFieldChange={handleFieldChange}
                  t={t.workRelatedExpenses?.commutation?.route?.firstOfficeAddress}
                  germanT={germanT?.workRelatedExpenses?.commutation?.route?.firstOfficeAddress}
                  fieldHasError={fieldHasError}
                  getValidationMessage={getValidationMessage}
                />
              </div>
            </div>
          )}
        </div>

        {/* Business Trips and Training Costs */}
        <div className="border border-gray-100 rounded p-4 space-y-4">
          <h4 className="font-medium text-sm">{germanT?.workRelatedExpenses?.businessTripsCosts?.title || 'Business Trips and Training Costs (DE)'} / {t.workRelatedExpenses?.businessTripsCosts?.title || 'Business Trips and Training Costs'}</h4>
          
          <FKInputField
            id="workRelatedExpenses.businessTripsCosts.amount"
            type="number"
            mainLanguage={germanT?.workRelatedExpenses?.businessTripsCosts?.amount || 'Amount (DE)'}
            selectedLanguage={t.workRelatedExpenses?.businessTripsCosts?.amount || 'Amount'}
            value={expensesData.workRelatedExpenses?.businessTripsCosts?.amount || ''}
            onChange={(e) => handleFieldChange('workRelatedExpenses.businessTripsCosts.amount', e.target.value)}
            mandatory={false}
            hasError={fieldHasError('workRelatedExpenses.businessTripsCosts.amount')}
            validationError={getValidationMessage('workRelatedExpenses.businessTripsCosts.amount')}
            min={0}
          />

          {Number(expensesData.workRelatedExpenses?.businessTripsCosts?.amount) > 0 && (
            <FKFileField
              id="workRelatedExpenses.businessTripsCosts.proof"
              mainLanguage={germanT?.workRelatedExpenses?.businessTripsCosts?.proof || 'Upload Proof (DE)'}
              selectedLanguage={t.workRelatedExpenses?.businessTripsCosts?.proof || 'Upload Proof'}
              value={expensesData.workRelatedExpenses?.businessTripsCosts?.proof || null}
              onChange={(files) => handleFieldChange('workRelatedExpenses.businessTripsCosts.proof', files)}
              multiple={true}
              accept=".pdf,.jpg,.jpeg,.png"
              maxSize={5}
              hasError={fieldHasError('workRelatedExpenses.businessTripsCosts.proof')}
              validationError={getValidationMessage('workRelatedExpenses.businessTripsCosts.proof')}
            />
          )}
        </div>

        {/* Work Equipment */}
        <div className="border border-gray-100 rounded p-4 space-y-4">
          <h4 className="font-medium text-sm">{germanT?.workRelatedExpenses?.workEquipment?.title || 'Work Equipment (DE)'} / {t.workRelatedExpenses?.workEquipment?.title || 'Work Equipment'}</h4>
          
          <FKYesNo
            id="workRelatedExpenses.workEquipment.hasWorkEquipment"
            mainLanguage={germanT?.workRelatedExpenses?.workEquipment?.hasWorkEquipment || 'Do you have work equipment expenses? (DE)'}
            selectedLanguage={t.workRelatedExpenses?.workEquipment?.hasWorkEquipment || 'Do you have work equipment expenses?'}
            value={expensesData.workRelatedExpenses?.workEquipment?.hasWorkEquipment}
            onChange={(value) => handleFieldChange('workRelatedExpenses.workEquipment.hasWorkEquipment', value)}
            mandatory={true}
            hasError={fieldHasError('workRelatedExpenses.workEquipment.hasWorkEquipment')}
            validationError={getValidationMessage('workRelatedExpenses.workEquipment.hasWorkEquipment')}
          />

          {expensesData.workRelatedExpenses?.workEquipment?.hasWorkEquipment === true && (
            <FKExpenseArray
              label={`${germanT?.workRelatedExpenses?.workEquipment?.expenses || 'Work Equipment (DE)'} / ${t.workRelatedExpenses?.workEquipment?.expenses || 'Work Equipment'}`}
              expenseTypes={{
                "office": "Office Supplies",
                "computer": "Computer Equipment",
                "tools": "Tools",
                "other": "Other"
              }}
              selectedLanguage={selectedLanguage}
              onChange={(expenses) => handleFieldChange('workRelatedExpenses.workEquipment.expenses', expenses)}
            />
          )}
        </div>

        {/* Home Office */}
        <div className="border border-gray-100 rounded p-4 space-y-4">
          <h4 className="font-medium text-sm">{germanT?.workRelatedExpenses?.homeOffice?.title || 'Home Office Allowance (DE)'} / {t.workRelatedExpenses?.homeOffice?.title || 'Home Office Allowance'}</h4>
          
          <FKYesNo
            id="workRelatedExpenses.homeOffice.hasHomeOffice"
            mainLanguage={germanT?.workRelatedExpenses?.homeOffice?.hasHomeOffice || 'Do you have a home office? (DE)'}
            selectedLanguage={t.workRelatedExpenses?.homeOffice?.hasHomeOffice || 'Do you have a home office?'}
            value={expensesData.workRelatedExpenses?.homeOffice?.hasHomeOffice}
            onChange={(value) => handleFieldChange('workRelatedExpenses.homeOffice.hasHomeOffice', value)}
            mandatory={true}
            hasError={fieldHasError('workRelatedExpenses.homeOffice.hasHomeOffice')}
            validationError={getValidationMessage('workRelatedExpenses.homeOffice.hasHomeOffice')}
          />

          {expensesData.workRelatedExpenses?.homeOffice?.hasHomeOffice === true && (
            <FKInputField
              id="workRelatedExpenses.homeOffice.workingDaysCount"
              type="number"
              mainLanguage={germanT?.workRelatedExpenses?.homeOffice?.workingDaysCount || 'Number of home office days (230 Max) (DE)'}
              selectedLanguage={t.workRelatedExpenses?.homeOffice?.workingDaysCount || 'Number of home office days (230 Max)'}
              value={expensesData.workRelatedExpenses?.homeOffice?.workingDaysCount || ''}
              onChange={(e) => handleFieldChange('workRelatedExpenses.homeOffice.workingDaysCount', e.target.value)}
              mandatory={true}
              hasError={fieldHasError('workRelatedExpenses.homeOffice.workingDaysCount')}
              validationError={getValidationMessage('workRelatedExpenses.homeOffice.workingDaysCount')}
              min={0}
            />
          )}
        </div>

        {/* Job Application Costs */}
        <div className="border border-gray-100 rounded p-4 space-y-4">
          <h4 className="font-medium text-sm">{germanT?.workRelatedExpenses?.applicationCosts?.title || 'Job Application Costs (DE)'} / {t.workRelatedExpenses?.applicationCosts?.title || 'Job Application Costs'}</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FKInputField
              id="workRelatedExpenses.applicationCosts.online"
              type="number"
              mainLanguage={germanT?.workRelatedExpenses?.applicationCosts?.online || 'Number of Online Applications (DE)'}
              selectedLanguage={t.workRelatedExpenses?.applicationCosts?.online || 'Number of Online Applications'}
              value={expensesData.workRelatedExpenses?.applicationCosts?.online || ''}
              onChange={(e) => handleFieldChange('workRelatedExpenses.applicationCosts.online', e.target.value)}
              hasError={fieldHasError('workRelatedExpenses.applicationCosts.online')}
              validationError={getValidationMessage('workRelatedExpenses.applicationCosts.online')}
              min={0}
            />

            <FKInputField
              id="workRelatedExpenses.applicationCosts.inPerson"
              type="number"
              mainLanguage={germanT?.workRelatedExpenses?.applicationCosts?.inPerson || 'Number of In-Person Applications (DE)'}
              selectedLanguage={t.workRelatedExpenses?.applicationCosts?.inPerson || 'Number of In-Person Applications'}
              value={expensesData.workRelatedExpenses?.applicationCosts?.inPerson || ''}
              onChange={(e) => handleFieldChange('workRelatedExpenses.applicationCosts.inPerson', e.target.value)}
              hasError={fieldHasError('workRelatedExpenses.applicationCosts.inPerson')}
              validationError={getValidationMessage('workRelatedExpenses.applicationCosts.inPerson')}
              min={0}
            />
          </div>
        </div>

        {/* Double Household Management */}
        <div className="border border-gray-100 rounded p-4 space-y-4">
          <h4 className="font-medium text-sm">{germanT?.workRelatedExpenses?.doubleHouseholdMgmt?.title || 'Double Household Management (DE)'} / {t.workRelatedExpenses?.doubleHouseholdMgmt?.title || 'Double Household Management'}</h4>
          
          <FKYesNo
            id="workRelatedExpenses.hasDoubleHouseholdMgmt"
            mainLanguage={germanT?.workRelatedExpenses?.hasDoubleHouseholdMgmt || 'Did you have double household management? (DE)'}
            selectedLanguage={t.workRelatedExpenses?.hasDoubleHouseholdMgmt || 'Did you have double household management?'}
            value={expensesData.workRelatedExpenses?.hasDoubleHouseholdMgmt}
            onChange={(value) => handleFieldChange('workRelatedExpenses.hasDoubleHouseholdMgmt', value)}
            mandatory={true}
            hasError={fieldHasError('workRelatedExpenses.hasDoubleHouseholdMgmt')}
            validationError={getValidationMessage('workRelatedExpenses.hasDoubleHouseholdMgmt')}
          />
        </div>
      </FormSection>

      {/* Special Expenses Section */}
      <FormSection title={<>{germanT?.specialExpenses?.title || 'Special Expenses (DE)'} / {t.specialExpenses?.title || 'Special Expenses'}</>}>
        {/* Insurance Expenses */}
        <div className="border border-gray-100 rounded p-4 space-y-4">
          <h4 className="font-medium text-sm">{germanT?.insurance?.title || 'Insurance Expenses (DE)'} / {t.insurance?.title || 'Insurance Expenses'}</h4>
          
          <FKYesNo
            id="specialExpenses.insurance.hasInsurance"
            mainLanguage={germanT?.insurance?.hasInsurance || 'Do you have insurance expenses? (DE)'}
            selectedLanguage={t.insurance?.hasInsurance || 'Do you have insurance expenses?'}
            value={expensesData.specialExpenses?.insurance?.hasInsurance}
            onChange={(value) => handleFieldChange('specialExpenses.insurance.hasInsurance', value)}
            mandatory={true}
            hasError={fieldHasError('specialExpenses.insurance.hasInsurance')}
            validationError={getValidationMessage('specialExpenses.insurance.hasInsurance')}
          />

          {expensesData.specialExpenses?.insurance?.hasInsurance === true && (
            <>
              <FKExpenseArray
                label={`${germanT?.insurance?.expenses || 'Insurance Expenses (DE)'} / ${t.insurance?.expenses || 'Insurance Expenses'}`}
                expenseTypes={{
                  "health": "Health Insurance",
                  "life": "Life Insurance",
                  "liability": "Liability Insurance",
                  "accident": "Accident Insurance",
                  "disability": "Disability Insurance",
                  "other": "Other Insurance"
                }}
                selectedLanguage={selectedLanguage}
                onChange={(expenses) => handleFieldChange('specialExpenses.insurance.expenses', expenses)}
              />

              <FKFileField
                id="specialExpenses.insurance.proof"
                mainLanguage={germanT?.insurance?.proof || 'Upload Insurance Proof (DE)'}
                selectedLanguage={t.insurance?.proof || 'Upload Insurance Proof'}
                value={expensesData.specialExpenses?.insurance?.proof || null}
                onChange={(files) => handleFieldChange('specialExpenses.insurance.proof', files)}
                multiple={true}
                accept=".pdf,.jpg,.jpeg,.png"
                maxSize={5}
                hasError={fieldHasError('specialExpenses.insurance.proof')}
                validationError={getValidationMessage('specialExpenses.insurance.proof')}
              />
            </>
          )}
        </div>

        {/* Donations */}
        <div className="border border-gray-100 rounded p-4 space-y-4">
          <h4 className="font-medium text-sm">{germanT?.donations?.title || 'Donations (DE)'} / {t.donations?.title || 'Donations'}</h4>
          
          <FKYesNo
            id="specialExpenses.donations.hasDonations"
            mainLanguage={germanT?.donations?.hasDonations || 'Do you have donations? (DE)'}
            selectedLanguage={t.donations?.hasDonations || 'Do you have donations?'}
            value={expensesData.specialExpenses?.donations?.hasDonations}
            onChange={(value) => handleFieldChange('specialExpenses.donations.hasDonations', value)}
            mandatory={true}
            hasError={fieldHasError('specialExpenses.donations.hasDonations')}
            validationError={getValidationMessage('specialExpenses.donations.hasDonations')}
          />

          {expensesData.specialExpenses?.donations?.hasDonations === true && (
            <>
              <FKExpenseArray
                label={`${germanT?.donations?.expenses || 'Donations (DE)'} / ${t.donations?.expenses || 'Donations'}`}
                expenseTypes={{
                  "charity": "Charitable Organizations",
                  "church": "Church Tax",
                  "political": "Political Parties",
                  "other": "Other Donations"
                }}
                selectedLanguage={selectedLanguage}
                onChange={(expenses) => handleFieldChange('specialExpenses.donations.expenses', expenses)}
              />

              <FKFileField
                id="specialExpenses.donations.proof"
                mainLanguage={germanT?.donations?.proof || 'Upload Donation Receipts (DE)'}
                selectedLanguage={t.donations?.proof || 'Upload Donation Receipts'}
                value={expensesData.specialExpenses?.donations?.proof || null}
                onChange={(files) => handleFieldChange('specialExpenses.donations.proof', files)}
                multiple={true}
                accept=".pdf,.jpg,.jpeg,.png"
                maxSize={5}
                hasError={fieldHasError('specialExpenses.donations.proof')}
                validationError={getValidationMessage('specialExpenses.donations.proof')}
              />
            </>
          )}
        </div>

        {/* Professional Development */}
        <div className="border border-gray-100 rounded p-4 space-y-4">
          <h4 className="font-medium text-sm">{germanT?.professionalDevelopment?.title || 'Professional Development (DE)'} / {t.professionalDevelopment?.title || 'Professional Development'}</h4>
          
          <FKYesNo
            id="specialExpenses.professionalDevelopment.hasProfessionalDevelopment"
            mainLanguage={germanT?.professionalDevelopment?.hasProfessionalDevelopment || 'Do you have professional development expenses? (DE)'}
            selectedLanguage={t.professionalDevelopment?.hasProfessionalDevelopment || 'Do you have professional development expenses?'}
            value={expensesData.specialExpenses?.professionalDevelopment?.hasProfessionalDevelopment}
            onChange={(value) => handleFieldChange('specialExpenses.professionalDevelopment.hasProfessionalDevelopment', value)}
            mandatory={true}
            hasError={fieldHasError('specialExpenses.professionalDevelopment.hasProfessionalDevelopment')}
            validationError={getValidationMessage('specialExpenses.professionalDevelopment.hasProfessionalDevelopment')}
          />

          {expensesData.specialExpenses?.professionalDevelopment?.hasProfessionalDevelopment === true && (
            <>
              <FKExpenseArray
                label={`${germanT?.professionalDevelopment?.expenses || 'Professional Development Expenses (DE)'} / ${t.professionalDevelopment?.expenses || 'Professional Development Expenses'}`}
                expenseTypes={{
                  "tuition": "Tuition Fees",
                  "books": "Books and Materials",
                  "travel": "Travel Costs",
                  "other": "Other Expenses"
                }}
                selectedLanguage={selectedLanguage}
                onChange={(expenses) => handleFieldChange('specialExpenses.professionalDevelopment.expenses', expenses)}
              />

              <FKFileField
                id="specialExpenses.professionalDevelopment.proof"
                mainLanguage={germanT?.professionalDevelopment?.proof || 'Upload Professional Development Receipts (DE)'}
                selectedLanguage={t.professionalDevelopment?.proof || 'Upload Professional Development Receipts'}
                value={expensesData.specialExpenses?.professionalDevelopment?.proof || null}
                onChange={(files) => handleFieldChange('specialExpenses.professionalDevelopment.proof', files)}
                multiple={true}
                accept=".pdf,.jpg,.jpeg,.png"
                maxSize={5}
                hasError={fieldHasError('specialExpenses.professionalDevelopment.proof')}
                validationError={getValidationMessage('specialExpenses.professionalDevelopment.proof')}
              />
            </>
          )}
        </div>
      </FormSection>

      {/* Extraordinary Burdens Section */}
      <FormSection title={<>{germanT?.extraordinaryBurdens?.title || 'Extraordinary Burdens (DE)'} / {t.extraordinaryBurdens?.title || 'Extraordinary Burdens'}</>}>
        {/* Medical Expenses */}
        <div className="border border-gray-100 rounded p-4 space-y-4">
          <h4 className="font-medium text-sm">{germanT?.medicalExpenses?.title || 'Medical Expenses (DE)'} / {t.medicalExpenses?.title || 'Medical Expenses'}</h4>
          
          <FKYesNo
            id="extraordinaryBurdens.medicalExpenses.hasMedicalExpenses"
            mainLanguage={germanT?.medicalExpenses?.hasMedicalExpenses || 'Do you have medical expenses? (DE)'}
            selectedLanguage={t.medicalExpenses?.hasMedicalExpenses || 'Do you have medical expenses?'}
            value={expensesData.extraordinaryBurdens?.medicalExpenses?.hasMedicalExpenses}
            onChange={(value) => handleFieldChange('extraordinaryBurdens.medicalExpenses.hasMedicalExpenses', value)}
            mandatory={true}
            hasError={fieldHasError('extraordinaryBurdens.medicalExpenses.hasMedicalExpenses')}
            validationError={getValidationMessage('extraordinaryBurdens.medicalExpenses.hasMedicalExpenses')}
          />

          {expensesData.extraordinaryBurdens?.medicalExpenses?.hasMedicalExpenses === true && (
            <>
              <FKExpenseArray
                label={`${germanT?.medicalExpenses?.expenses || 'Medical Expenses (DE)'} / ${t.medicalExpenses?.expenses || 'Medical Expenses'}`}
                expenseTypes={{
                  "doctor": "Doctor Visits",
                  "medication": "Medication",
                  "therapy": "Therapy",
                  "aids": "Medical Aids",
                  "other": "Other Medical Expenses"
                }}
                selectedLanguage={selectedLanguage}
                onChange={(expenses) => handleFieldChange('extraordinaryBurdens.medicalExpenses.expenses', expenses)}
              />

              <FKFileField
                id="extraordinaryBurdens.medicalExpenses.proof"
                mainLanguage={germanT?.medicalExpenses?.proof || 'Upload Medical Receipts (DE)'}
                selectedLanguage={t.medicalExpenses?.proof || 'Upload Medical Receipts'}
                value={expensesData.extraordinaryBurdens?.medicalExpenses?.proof || null}
                onChange={(files) => handleFieldChange('extraordinaryBurdens.medicalExpenses.proof', files)}
                multiple={true}
                accept=".pdf,.jpg,.jpeg,.png"
                maxSize={5}
                hasError={fieldHasError('extraordinaryBurdens.medicalExpenses.proof')}
                validationError={getValidationMessage('extraordinaryBurdens.medicalExpenses.proof')}
              />
            </>
          )}
        </div>

        {/* Care Expenses */}
        <div className="border border-gray-100 rounded p-4 space-y-4">
          <h4 className="font-medium text-sm">{germanT?.careExpenses?.title || 'Care Expenses (DE)'} / {t.careExpenses?.title || 'Care Expenses'}</h4>
          
          <FKYesNo
            id="extraordinaryBurdens.careExpenses.hasCareExpenses"
            mainLanguage={germanT?.careExpenses?.hasCareExpenses || 'Do you have care expenses? (DE)'}
            selectedLanguage={t.careExpenses?.hasCareExpenses || 'Do you have care expenses?'}
            value={expensesData.extraordinaryBurdens?.careExpenses?.hasCareExpenses}
            onChange={(value) => handleFieldChange('extraordinaryBurdens.careExpenses.hasCareExpenses', value)}
            mandatory={true}
            hasError={fieldHasError('extraordinaryBurdens.careExpenses.hasCareExpenses')}
            validationError={getValidationMessage('extraordinaryBurdens.careExpenses.hasCareExpenses')}
          />

          {expensesData.extraordinaryBurdens?.careExpenses?.hasCareExpenses === true && (
            <>
              <FKExpenseArray
                label={`${germanT?.careExpenses?.expenses || 'Care Expenses (DE)'} / ${t.careExpenses?.expenses || 'Care Expenses'}`}
                expenseTypes={{
                  "nursing": "Nursing Care",
                  "assistance": "Personal Assistance",
                  "equipment": "Care Equipment",
                  "other": "Other Care Expenses"
                }}
                selectedLanguage={selectedLanguage}
                onChange={(expenses) => handleFieldChange('extraordinaryBurdens.careExpenses.expenses', expenses)}
              />

              <FKFileField
                id="extraordinaryBurdens.careExpenses.proof"
                mainLanguage={germanT?.careExpenses?.proof || 'Upload Care Expense Receipts (DE)'}
                selectedLanguage={t.careExpenses?.proof || 'Upload Care Expense Receipts'}
                value={expensesData.extraordinaryBurdens?.careExpenses?.proof || null}
                onChange={(files) => handleFieldChange('extraordinaryBurdens.careExpenses.proof', files)}
                multiple={true}
                accept=".pdf,.jpg,.jpeg,.png"
                maxSize={5}
                hasError={fieldHasError('extraordinaryBurdens.careExpenses.proof')}
                validationError={getValidationMessage('extraordinaryBurdens.careExpenses.proof')}
              />
            </>
          )}
        </div>

        {/* Disability Expenses */}
        <div className="border border-gray-100 rounded p-4 space-y-4">
          <h4 className="font-medium text-sm">{germanT?.disabilityExpenses?.title || 'Disability Expenses (DE)'} / {t.disabilityExpenses?.title || 'Disability Expenses'}</h4>
          
          <FKYesNo
            id="extraordinaryBurdens.disabilityExpenses.hasDisabilityExpenses"
            mainLanguage={germanT?.disabilityExpenses?.hasDisabilityExpenses || 'Do you have disability-related expenses? (DE)'}
            selectedLanguage={t.disabilityExpenses?.hasDisabilityExpenses || 'Do you have disability-related expenses?'}
            value={expensesData.extraordinaryBurdens?.disabilityExpenses?.hasDisabilityExpenses}
            onChange={(value) => handleFieldChange('extraordinaryBurdens.disabilityExpenses.hasDisabilityExpenses', value)}
            mandatory={true}
            hasError={fieldHasError('extraordinaryBurdens.disabilityExpenses.hasDisabilityExpenses')}
            validationError={getValidationMessage('extraordinaryBurdens.disabilityExpenses.hasDisabilityExpenses')}
          />

          {expensesData.extraordinaryBurdens?.disabilityExpenses?.hasDisabilityExpenses === true && (
            <>
              <FKExpenseArray
                label={`${germanT?.disabilityExpenses?.expenses || 'Disability Expenses (DE)'} / ${t.disabilityExpenses?.expenses || 'Disability Expenses'}`}
                expenseTypes={{
                  "equipment": "Disability Equipment",
                  "modification": "Home Modifications",
                  "transport": "Transport Adaptations",
                  "other": "Other Disability Expenses"
                }}
                selectedLanguage={selectedLanguage}
                onChange={(expenses) => handleFieldChange('extraordinaryBurdens.disabilityExpenses.expenses', expenses)}
              />

              <FKFileField
                id="extraordinaryBurdens.disabilityExpenses.proof"
                mainLanguage={germanT?.disabilityExpenses?.proof || 'Upload Disability Expense Receipts (DE)'}
                selectedLanguage={t.disabilityExpenses?.proof || 'Upload Disability Expense Receipts'}
                value={expensesData.extraordinaryBurdens?.disabilityExpenses?.proof || null}
                onChange={(files) => handleFieldChange('extraordinaryBurdens.disabilityExpenses.proof', files)}
                multiple={true}
                accept=".pdf,.jpg,.jpeg,.png"
                maxSize={5}
                hasError={fieldHasError('extraordinaryBurdens.disabilityExpenses.proof')}
                validationError={getValidationMessage('extraordinaryBurdens.disabilityExpenses.proof')}
              />
            </>
          )}
        </div>

        {/* Craftsmen Services */}
        <div className="border border-gray-100 rounded p-4 space-y-4">
          <h4 className="font-medium text-sm">{germanT?.craftsmenServices?.title || 'Craftsmen Services (DE)'} / {t.craftsmenServices?.title || 'Craftsmen Services'}</h4>
          
          <FKYesNo
            id="craftsmenServices.hasMaintenancePayments"
            mainLanguage={germanT?.craftsmenServices?.hasMaintenancePayments || 'Do you have maintenance payments? (DE)'}
            selectedLanguage={t.craftsmenServices?.hasMaintenancePayments || 'Do you have maintenance payments?'}
            value={expensesData.craftsmenServices?.hasMaintenancePayments}
            onChange={(value) => handleFieldChange('craftsmenServices.hasMaintenancePayments', value)}
            mandatory={true}
            hasError={fieldHasError('craftsmenServices.hasMaintenancePayments')}
            validationError={getValidationMessage('craftsmenServices.hasMaintenancePayments')}
          />

          {expensesData.craftsmenServices?.hasMaintenancePayments === true && (
            <>
              <FKInputField
                id="craftsmenServices.maintenanceRecipient"
                mainLanguage={germanT?.craftsmenServices?.maintenanceRecipient || 'Maintenance Recipient (DE)'}
                selectedLanguage={t.craftsmenServices?.maintenanceRecipient || 'Maintenance Recipient'}
                value={expensesData.craftsmenServices?.maintenanceRecipient || ''}
                onChange={(e) => handleFieldChange('craftsmenServices.maintenanceRecipient', e.target.value)}
                mandatory={true}
                hasError={fieldHasError('craftsmenServices.maintenanceRecipient')}
                validationError={getValidationMessage('craftsmenServices.maintenanceRecipient')}
              />

              <FKInputField
                id="craftsmenServices.maintenanceAmount"
                type="number"
                mainLanguage={germanT?.craftsmenServices?.maintenanceAmount || 'Maintenance Amount (DE)'}
                selectedLanguage={t.craftsmenServices?.maintenanceAmount || 'Maintenance Amount'}
                value={expensesData.craftsmenServices?.maintenanceAmount || ''}
                onChange={(e) => handleFieldChange('craftsmenServices.maintenanceAmount', e.target.value)}
                mandatory={true}
                hasError={fieldHasError('craftsmenServices.maintenanceAmount')}
                validationError={getValidationMessage('craftsmenServices.maintenanceAmount')}
                min={0}
              />

              <FKFileField
                id="craftsmenServices.invoiceCraftsmenServices"
                mainLanguage={germanT?.craftsmenServices?.invoiceCraftsmenServices || 'Upload Craftsmen Services Invoice (DE)'}
                selectedLanguage={t.craftsmenServices?.invoiceCraftsmenServices || 'Upload Craftsmen Services Invoice'}
                value={expensesData.craftsmenServices?.invoiceCraftsmenServices || null}
                onChange={(files) => handleFieldChange('craftsmenServices.invoiceCraftsmenServices', files)}
                multiple={true}
                accept=".pdf,.jpg,.jpeg,.png"
                maxSize={5}
                hasError={fieldHasError('craftsmenServices.invoiceCraftsmenServices')}
                validationError={getValidationMessage('craftsmenServices.invoiceCraftsmenServices')}
              />
            </>
          )}
        </div>
      </FormSection>
    </div>
  );
};

export default TFExpenses; 