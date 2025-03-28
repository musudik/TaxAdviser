import React from 'react';
import { TaxFormData } from '../taxTypes';
import { FormSection, Input, Label } from '../utils/UIComponents';
import languageData from '../i18n/language.json';

interface ReviewStepProps {
  formData: TaxFormData;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ formData }) => {
  // Helper function to format currency values
  const formatCurrency = (value: number | undefined | null) => {
    if (value === undefined || value === null) return '€0.00';
    return `€${value.toFixed(2)}`;
  };

  // Helper function to format boolean values
  const formatBoolean = (value: boolean | undefined) => {
    if (value === undefined || value === null) return '-';
    return value ? 'Ja / Yes' : 'Nein / No';
  };

  // Helper function to safely render any value
  const safeRender = (value: any): string => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return formatBoolean(value);
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch (e) {
        console.error("Error rendering object:", e);
        return "Error rendering value";
      }
    }
    return String(value);
  };

  const InfoField: React.FC<{ germanLabel: string; englishLabel: string; value: any }> = ({ germanLabel, englishLabel, value }) => (
    <div className="form-group">
      <Label
        germanText={<div className="font-bold">{germanLabel}</div>}
        englishText={<div className="text-neutral-600">{englishLabel}</div>}
      />
      <div className="mt-1 p-2 w-full min-h-[40px] bg-gray-50 rounded-md border border-gray-200">
        <p className="text-sm text-gray-900 min-h-[20px]">{safeRender(value)}</p>
      </div>
    </div>
  );

  const ChildrenSection: React.FC<{ children: any[] }> = ({ children }) => (
    <div className="mt-4">
      <h3 className="font-bold mb-4">
        <div className="font-bold">Kinder</div>
        <div className="text-neutral-600">Children</div>
      </h3>
      <div className="space-y-4">
        {children.map((child, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h4 className="mb-4">
              <div className="font-bold">Kind {index + 1}</div>
              <div className="text-neutral-600">Child {index + 1}</div>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField 
                germanLabel={languageData.de.personalInfo.firstName}
                englishLabel={languageData.en.personalInfo.firstName}
                value={child.firstName} 
              />
              <InfoField 
                germanLabel={languageData.de.personalInfo.lastName}
                englishLabel={languageData.en.personalInfo.lastName}
                value={child.lastName} 
              />
              <InfoField 
                germanLabel={languageData.de.personalInfo.dateOfBirth}
                englishLabel={languageData.en.personalInfo.dateOfBirth}
                value={child.dateOfBirth} 
              />
              <InfoField 
                germanLabel={languageData.de.personalInfo.taxId}
                englishLabel={languageData.en.personalInfo.taxId}
                value={child.taxId} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Personal Information */}
      <FormSection 
        germanTitle={languageData.de.personalInfo.title}
        englishTitle={languageData.en.personalInfo.title}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField 
            germanLabel={languageData.de.personalInfo.firstName}
            englishLabel={languageData.en.personalInfo.firstName}
            value={formData.personalInfo.firstName} 
          />
          <InfoField 
            germanLabel={languageData.de.personalInfo.lastName}
            englishLabel={languageData.en.personalInfo.lastName}
            value={formData.personalInfo.lastName} 
          />
          <InfoField 
            germanLabel={languageData.de.personalInfo.dateOfBirth}
            englishLabel={languageData.en.personalInfo.dateOfBirth}
            value={formData.personalInfo.dateOfBirth} 
          />
          <InfoField 
            germanLabel={languageData.de.personalInfo.taxId}
            englishLabel={languageData.en.personalInfo.taxId}
            value={formData.personalInfo.taxId} 
          />
          <InfoField 
            germanLabel={languageData.de.personalInfo.maritalStatus}
            englishLabel={languageData.en.personalInfo.maritalStatus}
            value={formData.personalInfo.maritalStatus} 
          />
          <InfoField 
            germanLabel={languageData.de.personalInfo.email}
            englishLabel={languageData.en.personalInfo.email}
            value={formData.personalInfo.email} 
          />
          <InfoField 
            germanLabel={languageData.de.personalInfo.phone}
            englishLabel={languageData.en.personalInfo.phone}
            value={formData.personalInfo.phone} 
          />
          <InfoField 
            germanLabel="Hat Kinder"
            englishLabel="Has Children"
            value={formatBoolean(formData.personalInfo.hasChildren)} 
          />
        </div>

        {/* Children Information - if applicable */}
        {formData.personalInfo.hasChildren && formData.personalInfo.children && (
          <ChildrenSection children={formData.personalInfo.children} />
        )}
      </FormSection>

      {/* Employment Income */}
      <FormSection 
        germanTitle={languageData.de.incomeInfo.title}
        englishTitle={languageData.en.incomeInfo.title}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField 
            germanLabel={languageData.de.incomeInfo.isEmployed}
            englishLabel={languageData.en.incomeInfo.isEmployed}
            value={formatBoolean(formData.incomeInfo.isEmployed)} 
          />
          {formData.incomeInfo.isEmployed && (
            <>
              <InfoField 
                germanLabel={languageData.de.incomeInfo.employer}
                englishLabel={languageData.en.incomeInfo.employer}
                value={formData.incomeInfo.employer} 
              />
              <InfoField 
                germanLabel={languageData.de.incomeInfo.employmentIncome}
                englishLabel={languageData.en.incomeInfo.employmentIncome}
                value={formatCurrency(formData.incomeInfo.employmentIncome)} 
              />
              <InfoField 
                germanLabel={languageData.de.incomeInfo.hasTaxCertificate}
                englishLabel={languageData.en.incomeInfo.hasTaxCertificate}
                value={formatBoolean(formData.incomeInfo.hasTaxCertificate)} 
              />
              <InfoField 
                germanLabel={languageData.de.incomeInfo.hasTravelSubsidy}
                englishLabel={languageData.en.incomeInfo.hasTravelSubsidy}
                value={formatBoolean(formData.incomeInfo.hasTravelSubsidy)} 
              />
            </>
          )}
        </div>
      </FormSection>

      {/* Expenses & Deductions */}
      <FormSection 
        germanTitle={languageData.de.deductions.workRelatedExpenses}
        englishTitle={languageData.en.deductions.workRelatedExpenses}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField 
            germanLabel={languageData.de.deductions.commutingExpenses}
            englishLabel={languageData.en.deductions.commutingExpenses}
            value={formatCurrency(formData.deductions.commutingExpenses)} 
          />
          <InfoField 
            germanLabel={languageData.de.deductions.businessTripsCosts}
            englishLabel={languageData.en.deductions.businessTripsCosts}
            value={formatCurrency(formData.deductions.businessTripsCosts)} 
          />
          <InfoField 
            germanLabel={languageData.de.deductions.workEquipment}
            englishLabel={languageData.en.deductions.workEquipment}
            value={formatCurrency(formData.deductions.workEquipment)} 
          />
          <InfoField 
            germanLabel={languageData.de.deductions.homeOfficeAllowance}
            englishLabel={languageData.en.deductions.homeOfficeAllowance}
            value={formatCurrency(formData.deductions.homeOfficeAllowance)} 
          />
          <InfoField 
            germanLabel={languageData.de.deductions.membershipFees}
            englishLabel={languageData.en.deductions.membershipFees}
            value={formatCurrency(formData.deductions.membershipFees)} 
          />
          <InfoField 
            germanLabel={languageData.de.deductions.applicationCosts}
            englishLabel={languageData.en.deductions.applicationCosts}
            value={formatCurrency(formData.deductions.applicationCosts)} 
          />
          <InfoField 
            germanLabel={languageData.de.deductions.doubleHouseholdCosts}
            englishLabel={languageData.en.deductions.doubleHouseholdCosts}
            value={formatCurrency(formData.deductions.doubleHouseholdCosts)} 
          />
        </div>
      </FormSection>

      {/* Special Expenses */}
      <FormSection 
        germanTitle={languageData.de.deductions.specialExpenses}
        englishTitle={languageData.en.deductions.specialExpenses}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField 
            germanLabel={languageData.de.deductions.churchTax}
            englishLabel={languageData.en.deductions.churchTax}
            value={formatCurrency(formData.deductions.churchTax)} 
          />
          <InfoField 
            germanLabel={languageData.de.deductions.donationsAndFees}
            englishLabel={languageData.en.deductions.donationsAndFees}
            value={formatCurrency(formData.deductions.donationsAndFees)} 
          />
          <InfoField 
            germanLabel={languageData.de.deductions.childcareCosts}
            englishLabel={languageData.en.deductions.childcareCosts}
            value={formatCurrency(formData.deductions.childcareCosts)} 
          />
          <InfoField 
            germanLabel={languageData.de.deductions.supportPayments}
            englishLabel={languageData.en.deductions.supportPayments}
            value={formatCurrency(formData.deductions.supportPayments)} 
          />
          <InfoField 
            germanLabel={languageData.de.deductions.privateSchoolFees}
            englishLabel={languageData.en.deductions.privateSchoolFees}
            value={formatCurrency(formData.deductions.privateSchoolFees)} 
          />
          <InfoField 
            germanLabel={languageData.de.deductions.retirementProvisions}
            englishLabel={languageData.en.deductions.retirementProvisions}
            value={formatCurrency(formData.deductions.retirementProvisions)} 
          />
          <InfoField 
            germanLabel={languageData.de.deductions.otherInsuranceExpenses}
            englishLabel={languageData.en.deductions.otherInsuranceExpenses}
            value={formatCurrency(formData.deductions.otherInsuranceExpenses)} 
          />
          <InfoField 
            germanLabel={languageData.de.deductions.professionalTrainingCosts}
            englishLabel={languageData.en.deductions.professionalTrainingCosts}
            value={formatCurrency(formData.deductions.professionalTrainingCosts)} 
          />
        </div>
      </FormSection>

      {/* Extraordinary Expenses */}
      <FormSection 
        germanTitle={languageData.de.deductions.extraordinaryExpenses}
        englishTitle={languageData.en.deductions.extraordinaryExpenses}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField 
            germanLabel={languageData.de.deductions.medicalExpenses}
            englishLabel={languageData.en.deductions.medicalExpenses}
            value={formatCurrency(formData.deductions.medicalExpenses)} 
          />
          <InfoField 
            germanLabel={languageData.de.deductions.rehabilitationCosts}
            englishLabel={languageData.en.deductions.rehabilitationCosts}
            value={formatCurrency(formData.deductions.rehabilitationCosts)} 
          />
          <InfoField 
            germanLabel={languageData.de.deductions.careCosts}
            englishLabel={languageData.en.deductions.careCosts}
            value={formatCurrency(formData.deductions.careCosts)} 
          />
          <InfoField 
            germanLabel={languageData.de.deductions.disabilityExpenses}
            englishLabel={languageData.en.deductions.disabilityExpenses}
            value={formatCurrency(formData.deductions.disabilityExpenses)} 
          />
        </div>
      </FormSection>
    </div>
  );
};

export default ReviewStep; 