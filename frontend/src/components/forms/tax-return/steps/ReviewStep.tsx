import React from 'react';
import { TaxFormData } from '../taxTypes';
import { FormSection, Input, Label } from '../utils/UIComponents';
import languageData from '../i18n/language.json';

interface ReviewStepProps {
  formData: TaxFormData;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ formData }) => {
  // Format currency values with € symbol
  const formatCurrency = (value: number | undefined | null) => {
    if (value === undefined || value === null) return '-';
    // Use typeof check to ensure value is a number before using toFixed
    return typeof value === 'number' ? `${value.toFixed(2)} €` : `${value} €`;
  };

  // Format boolean values to Ja/Nein
  const formatBoolean = (value: boolean | undefined) => {
    if (value === undefined) return '-';
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
          
          {/* Address Information */}
          <InfoField 
            germanLabel="Straße"
            englishLabel="Street"
            value={formData.personalInfo.address.street} 
          />
          <InfoField 
            germanLabel="Hausnummer"
            englishLabel="House Number"
            value={formData.personalInfo.address.houseNumber} 
          />
          <InfoField 
            germanLabel="Postleitzahl"
            englishLabel="Postal Code"
            value={formData.personalInfo.address.postalCode} 
          />
          <InfoField 
            germanLabel="Stadt"
            englishLabel="City"
            value={formData.personalInfo.address.city} 
          />
          
          {/* Foreign Residence Information */}
          <InfoField 
            germanLabel="Auslandsaufenthalt"
            englishLabel="Foreign Residence"
            value={formatBoolean(formData.personalInfo.hasForeignResidence)} 
          />
          {formData.personalInfo.hasForeignResidence && (
            <>
              <InfoField 
                germanLabel="Land des Auslandsaufenthalts"
                englishLabel="Foreign Residence Country"
                value={formData.personalInfo.foreignResidenceCountry} 
              />
              {formData.personalInfo.foreignResidenceCountry === 'other' && (
                <InfoField 
                  germanLabel="Anderes Land"
                  englishLabel="Other Country"
                  value={formData.personalInfo.otherForeignResidenceCountry} 
                />
              )}
              <InfoField 
                germanLabel="Ausländische Adresse"
                englishLabel="Foreign Address"
                value={formData.personalInfo.foreignAddress} 
              />
            </>
          )}
          
          {/* Spouse Information */}
          {formData.personalInfo.maritalStatus === 'married' && (
            <>
              <InfoField 
                germanLabel="Vorname des Ehepartners"
                englishLabel="Spouse First Name"
                value={formData.personalInfo.spouseFirstName} 
              />
              <InfoField 
                germanLabel="Nachname des Ehepartners"
                englishLabel="Spouse Last Name"
                value={formData.personalInfo.spouseLastName} 
              />
              <InfoField 
                germanLabel="Geburtsdatum des Ehepartners"
                englishLabel="Spouse Date of Birth"
                value={formData.personalInfo.spouseDateOfBirth} 
              />
              <InfoField 
                germanLabel="Steuer-ID des Ehepartners"
                englishLabel="Spouse Tax ID"
                value={formData.personalInfo.spouseTaxId} 
              />
              <InfoField 
                germanLabel="Ehepartner hat Einkommen"
                englishLabel="Spouse Has Income"
                value={formatBoolean(formData.personalInfo.spouseHasIncome)} 
              />
              {formData.personalInfo.spouseHasIncome && (
                <InfoField 
                  germanLabel="Einkommensart des Ehepartners"
                  englishLabel="Spouse Income Type"
                  value={formData.personalInfo.spouseIncomeType} 
                />
              )}
            </>
          )}
        </div>

        {/* Children Information - if applicable */}
        {formData.personalInfo.hasChildren && formData.personalInfo.children && (
          <ChildrenSection children={formData.personalInfo.children} />
        )}
      </FormSection>

      {/* Employment Income */}
      <FormSection 
        germanTitle={languageData.de.incomeInfo.title || "Beschäftigungseinkommen"}
        englishTitle={languageData.en.incomeInfo.title || "Employment Income"}
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
              {formData.incomeInfo.hasTravelSubsidy && (
                <InfoField 
                  germanLabel={languageData.de.incomeInfo.travelDistance}
                  englishLabel={languageData.en.incomeInfo.travelDistance}
                  value={`${formData.incomeInfo.travelDistance} km`} 
                />
              )}
            </>
          )}
        </div>
      </FormSection>
      
      {/* Business Income */}
      <FormSection 
        germanTitle={languageData.de.incomeInfo.businessTitle}
        englishTitle={languageData.en.incomeInfo.businessTitle}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField 
            germanLabel={languageData.de.incomeInfo.isBusinessOwner}
            englishLabel={languageData.en.incomeInfo.isBusinessOwner}
            value={formatBoolean(formData.incomeInfo.isBusinessOwner)} 
          />
          {formData.incomeInfo.isBusinessOwner && (
            <>
              <InfoField 
                germanLabel={languageData.de.incomeInfo.businessType}
                englishLabel={languageData.en.incomeInfo.businessType}
                value={formData.incomeInfo.businessType} 
              />
              <InfoField 
                germanLabel={languageData.de.incomeInfo.businessEarnings}
                englishLabel={languageData.en.incomeInfo.businessEarnings}
                value={formatCurrency(formData.incomeInfo.businessEarnings)} 
              />
              <InfoField 
                germanLabel={languageData.de.incomeInfo.businessExpenses}
                englishLabel={languageData.en.incomeInfo.businessExpenses}
                value={formatCurrency(formData.incomeInfo.businessExpenses)} 
              />
            </>
          )}
        </div>
      </FormSection>
      
      {/* Investments */}
      <FormSection 
        germanTitle={languageData.de.incomeInfo.investmentsTitle}
        englishTitle={languageData.en.incomeInfo.investmentsTitle}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField 
            germanLabel={languageData.de.incomeInfo.hasStockIncome}
            englishLabel={languageData.en.incomeInfo.hasStockIncome}
            value={formatBoolean(formData.incomeInfo.hasStockIncome)} 
          />
          {formData.incomeInfo.hasStockIncome && (
            <>
              <InfoField 
                germanLabel={languageData.de.incomeInfo.dividendEarnings}
                englishLabel={languageData.en.incomeInfo.dividendEarnings}
                value={formatCurrency(formData.incomeInfo.dividendEarnings)} 
              />
              <InfoField 
                germanLabel={languageData.de.incomeInfo.hasBankCertificate}
                englishLabel={languageData.en.incomeInfo.hasBankCertificate}
                value={formatBoolean(formData.incomeInfo.hasBankCertificate)} 
              />
              <InfoField 
                germanLabel={languageData.de.incomeInfo.hasStockSales}
                englishLabel={languageData.en.incomeInfo.hasStockSales}
                value={formatBoolean(formData.incomeInfo.hasStockSales)} 
              />
              {formData.incomeInfo.hasStockSales && (
                <InfoField 
                  germanLabel={languageData.de.incomeInfo.stockProfitLoss}
                  englishLabel={languageData.en.incomeInfo.stockProfitLoss}
                  value={formatCurrency(Number(formData.incomeInfo.stockProfitLoss))} 
                />
              )}
              <InfoField 
                germanLabel={languageData.de.incomeInfo.hasForeignStocks}
                englishLabel={languageData.en.incomeInfo.hasForeignStocks}
                value={formatBoolean(formData.incomeInfo.hasForeignStocks)} 
              />
              {formData.incomeInfo.hasForeignStocks && (
                <>
                  <InfoField 
                    germanLabel={languageData.de.incomeInfo.foreignTaxPaid}
                    englishLabel={languageData.en.incomeInfo.foreignTaxPaid}
                    value={formatCurrency(formData.incomeInfo.foreignTaxPaid)} 
                  />
                </>
              )}
            </>
          )}
        </div>
      </FormSection>
      
      {/* Rental Income */}
      <FormSection 
        germanTitle={languageData.de.incomeInfo.rentalTitle}
        englishTitle={languageData.en.incomeInfo.rentalTitle}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField 
            germanLabel={languageData.de.incomeInfo.hasRentalProperty}
            englishLabel={languageData.en.incomeInfo.hasRentalProperty}
            value={formatBoolean(formData.incomeInfo.hasRentalProperty)} 
          />
          {formData.incomeInfo.hasRentalProperty && (
            <>
              <InfoField 
                germanLabel={languageData.de.incomeInfo.rentalIncome}
                englishLabel={languageData.en.incomeInfo.rentalIncome}
                value={formatCurrency(formData.incomeInfo.rentalIncome)} 
              />
              <InfoField 
                germanLabel={languageData.de.incomeInfo.rentalCosts}
                englishLabel={languageData.en.incomeInfo.rentalCosts}
                value={formatCurrency(formData.incomeInfo.rentalCosts)} 
              />
              
              {/* Rental Property Address */}
              <InfoField 
                germanLabel="Adresse der Immobilie - Straße"
                englishLabel="Rental Property Street"
                value={formData.incomeInfo.rentalPropertyAddress.street} 
              />
              <InfoField 
                germanLabel="Hausnummer"
                englishLabel="House Number"
                value={formData.incomeInfo.rentalPropertyAddress.houseNumber} 
              />
              <InfoField 
                germanLabel="Postleitzahl"
                englishLabel="Postal Code"
                value={formData.incomeInfo.rentalPropertyAddress.postalCode} 
              />
              <InfoField 
                germanLabel="Stadt"
                englishLabel="City"
                value={formData.incomeInfo.rentalPropertyAddress.city} 
              />
            </>
          )}
        </div>
      </FormSection>
      
      {/* Foreign Income */}
      <FormSection 
        germanTitle={languageData.de.incomeInfo.foreignTitle}
        englishTitle={languageData.en.incomeInfo.foreignTitle}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField 
            germanLabel={languageData.de.incomeInfo.hasForeignIncome}
            englishLabel={languageData.en.incomeInfo.hasForeignIncome}
            value={formatBoolean(formData.incomeInfo.hasForeignIncome)} 
          />
          {formData.incomeInfo.hasForeignIncome && (
            <>
              <InfoField 
                germanLabel={languageData.de.incomeInfo.foreignIncomeCountry}
                englishLabel={languageData.en.incomeInfo.foreignIncomeCountry}
                value={formData.incomeInfo.foreignIncomeCountry} 
              />
              <InfoField 
                germanLabel={languageData.de.incomeInfo.foreignIncomeType}
                englishLabel={languageData.en.incomeInfo.foreignIncomeType}
                value={formData.incomeInfo.foreignIncomeType} 
              />
              <InfoField 
                germanLabel={languageData.de.incomeInfo.foreignIncomeAmount}
                englishLabel={languageData.en.incomeInfo.foreignIncomeAmount}
                value={formatCurrency(formData.incomeInfo.foreignIncomeAmount)} 
              />
              <InfoField 
                germanLabel={languageData.de.incomeInfo.foreignIncomeTaxPaid}
                englishLabel={languageData.en.incomeInfo.foreignIncomeTaxPaid}
                value={formatCurrency(formData.incomeInfo.foreignIncomeTaxPaid)} 
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
            germanLabel={languageData.de.deductions.hasSpecialExpensesDetailed}
            englishLabel={languageData.en.deductions.hasSpecialExpensesDetailed}
            value={formatBoolean(formData.deductions.hasSpecialExpensesDetailed)} 
          />
          
          {formData.deductions.hasSpecialExpensesDetailed && (
            <>
              <InfoField 
                germanLabel={languageData.de.deductions.specialExpensesType}
                englishLabel={languageData.en.deductions.specialExpensesType}
                value={formData.deductions.specialExpensesType} 
              />
              <InfoField 
                germanLabel={languageData.de.deductions.specialExpensesAmount}
                englishLabel={languageData.en.deductions.specialExpensesAmount}
                value={formatCurrency(formData.deductions.specialExpensesAmount)} 
              />
            </>
          )}
          
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

      {/* Insurance Information */}
      <FormSection 
        germanTitle={languageData.de.deductions.insurancePremiums}
        englishTitle={languageData.en.deductions.insurancePremiums}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField 
            germanLabel={languageData.de.deductions.hasPrivateInsurance}
            englishLabel={languageData.en.deductions.hasPrivateInsurance}
            value={formatBoolean(formData.deductions.hasPrivateInsurance)} 
          />
          
          {formData.deductions.hasPrivateInsurance && (
            <>
              <InfoField 
                germanLabel={languageData.de.deductions.insuranceTypes}
                englishLabel={languageData.en.deductions.insuranceTypes}
                value={formData.deductions.insuranceTypes} 
              />
              <InfoField 
                germanLabel={languageData.de.deductions.insuranceContributions}
                englishLabel={languageData.en.deductions.insuranceContributions}
                value={formatCurrency(formData.deductions.insuranceContributions)} 
              />
            </>
          )}
          
          <InfoField 
            germanLabel={languageData.de.deductions.privateHealthInsurance}
            englishLabel={languageData.en.deductions.privateHealthInsurance}
            value={formatCurrency(formData.deductions.privateHealthInsurance)} 
          />
          <InfoField 
            germanLabel={languageData.de.deductions.privatePensionInsurance}
            englishLabel={languageData.en.deductions.privatePensionInsurance}
            value={formatCurrency(formData.deductions.privatePensionInsurance)} 
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

      {/* Signature Information (if available) */}
      {formData.signature && (
        <FormSection 
          germanTitle="Unterschrift"
          englishTitle="Signature"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField 
              germanLabel="Ort"
              englishLabel="Place"
              value={formData.signature.place} 
            />
            <InfoField 
              germanLabel="Datum"
              englishLabel="Date"
              value={formData.signature.date} 
            />
          </div>
        </FormSection>
      )}
    </div>
  );
};

export default ReviewStep; 