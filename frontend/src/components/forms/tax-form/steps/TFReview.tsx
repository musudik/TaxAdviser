import React from 'react';
import FKInputField from '../../../ui/FKInputField'; // Import FKInputField

interface TFReviewProps {
  formData: { [key: string]: any };
  germanT: any;
  selectedT: any;
}

// Helper component for section styling
const FormSection = ({ title, children }: { title: React.ReactNode, children: React.ReactNode }) => (
  <div className="border border-gray-200 rounded-md p-4 mb-4">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
      {children}
    </div>
  </div>
);

// Helper component for displaying image field (like signature)
const ImageField = ({ label, value, germanLabel, fullWidth = false }: { label: string, value: any, germanLabel: string, fullWidth?: boolean }) => (
  <div className={`mb-2 ${fullWidth ? 'md:col-span-2' : ''}`}>
    <div className="font-bold text-sm text-neutral-800">{germanLabel}</div>
    <div className="text-sm text-neutral-600 mb-1">{label}</div>
    <div className="text-base text-neutral-900 break-words">
      {value ? 
        <img src={value} alt="Signature" className="border rounded h-24 bg-white" /> 
        : '-'}
    </div>
  </div>
);

// Helper for Subheadings within a FormSection
const SubHeading = ({ germanText, englishText }: { germanText: string, englishText: string }) => (
  <h4 className="md:col-span-2 font-semibold text-md text-neutral-700 mt-4 pt-4 border-t">
    {germanText} / {englishText}
  </h4>
);

const TFReview: React.FC<TFReviewProps> = ({ formData, germanT, selectedT }) => {
  // Format boolean values
  const formatBoolean = (value: boolean | undefined | null): string => {
    if (value === undefined || value === null) return '-';
    const yes = selectedT?.common?.yes || 'Yes';
    const no = selectedT?.common?.no || 'No';
    const germanYes = germanT?.common?.yes || 'Ja';
    const germanNo = germanT?.common?.no || 'Nein';
    return value ? `${germanYes} / ${yes}` : `${germanNo} / ${no}`;
  };

  // Format currency values
  const formatCurrency = (value: number | string | undefined | null): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (numValue === undefined || numValue === null || isNaN(numValue)) return '-';
    // Displaying in EUR, adjust if needed
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(numValue);
  };

  const personalInfo = formData.personalInfo || {};
  const businessInfo = formData.businessInfo || {};
  const employmentIncome = formData.employmentIncome || {}; // Assuming structure
  const expenses = formData.expenses || {}; // Assuming structure
  const signature = formData.signature || {};

  // Helper to get nested translation safely - useful for titles or complex structures
  const getNestedT = (keys: string[], langData: any, defaultValue: string = '') => {
    return keys.reduce((obj, key) => (obj && typeof obj === 'object' && obj[key] !== undefined) ? obj[key] : defaultValue, langData);
  }

  return (
    <div className="space-y-6">
      {/* Personal Information Section */}
      <FormSection title={<>{germanT?.personalInfo?.title || 'Persönliche Informationen'} / {selectedT?.personalInfo?.title || 'Personal Information'}</>}>
        <FKInputField
          id="review-firstName"
          mainLanguage={germanT?.personalInfo?.firstName || 'Vorname'}
          selectedLanguage={selectedT?.personalInfo?.firstName || 'First Name'}
          value={personalInfo.firstName || '-'}
          readOnly={true} 
        />
        <FKInputField
          id="review-lastName"
          mainLanguage={germanT?.personalInfo?.lastName || 'Nachname'}
          selectedLanguage={selectedT?.personalInfo?.lastName || 'Last Name'}
          value={personalInfo.lastName || '-'}
          readOnly={true}
        />
        <FKInputField
          id="review-taxId"
          mainLanguage={germanT?.personalInfo?.taxId || 'Steuer-ID'}
          selectedLanguage={selectedT?.personalInfo?.taxId || 'Tax ID'}
          value={personalInfo.taxId || '-'}
          readOnly={true}
        />
        <FKInputField
          id="review-dateOfBirth"
          type="date" 
          mainLanguage={germanT?.personalInfo?.dateOfBirth || 'Geburtsdatum'}
          selectedLanguage={selectedT?.personalInfo?.dateOfBirth || 'Date of Birth'}
          value={personalInfo.dateOfBirth || '-'}
          readOnly={true}
        />
        <FKInputField
          id="review-email"
          type="email"
          mainLanguage={germanT?.personalInfo?.email || 'E-Mail'}
          selectedLanguage={selectedT?.personalInfo?.email || 'Email'}
          value={personalInfo.email || '-'}
          readOnly={true}
        />
        <FKInputField
          id="review-phone"
          type="tel"
          mainLanguage={germanT?.personalInfo?.phone || 'Telefon'}
          selectedLanguage={selectedT?.personalInfo?.phone || 'Phone'}
          value={personalInfo.phone || '-'}
          readOnly={true}
        />
      </FormSection>

      {/* Address Section */}
      <FormSection title={<>{germanT?.address?.title || 'Adresse'} / {selectedT?.address?.title || 'Address'}</>}>
        <FKInputField
          id="review-street"
          mainLanguage={germanT?.address?.street || 'Straße'}
          selectedLanguage={selectedT?.address?.street || 'Street'}
          value={personalInfo.address?.street || '-'}
          readOnly={true}
        />
        <FKInputField
          id="review-houseNumber"
          mainLanguage={germanT?.address?.houseNumber || 'Hausnummer'}
          selectedLanguage={selectedT?.address?.houseNumber || 'House Number'}
          value={personalInfo.address?.houseNumber || '-'}
          readOnly={true}
        />
        <FKInputField
          id="review-postalCode"
          mainLanguage={germanT?.address?.postalCode || 'Postleitzahl'}
          selectedLanguage={selectedT?.address?.postalCode || 'Postal Code'}
          value={personalInfo.address?.postalCode || '-'}
          readOnly={true}
        />
        <FKInputField
          id="review-city"
          mainLanguage={germanT?.address?.city || 'Stadt'}
          selectedLanguage={selectedT?.address?.city || 'City'}
          value={personalInfo.address?.city || '-'}
          readOnly={true}
        />
      </FormSection>

      {/* Business Information Section */}      
      <FormSection title={<>{germanT?.businessInfo?.title || 'Geschäftsinformationen'} / {selectedT?.businessInfo?.title || 'Business Information'}</>}>
        <FKInputField
          id="review-isBusinessOwner"
          mainLanguage={germanT?.businessInfo?.isBusinessOwner || 'Geschäftsinhaber?'}
          selectedLanguage={selectedT?.businessInfo?.isBusinessOwner || 'Business Owner?'}
          value={formatBoolean(businessInfo.isBusinessOwner)}
          readOnly={true}
        />
        {!businessInfo.isBusinessOwner && <div className="md:col-span-1"></div>} { /* Spacer */}
        
        {businessInfo.isBusinessOwner && (
          <>
            <FKInputField
              id="review-businessType"
              mainLanguage={germanT?.businessInfo?.businessType || 'Geschäftsart'}
              selectedLanguage={selectedT?.businessInfo?.businessType || 'Business Type'}
              value={businessInfo.businessType || '-'}
              readOnly={true}
            />
            {/* Business Address Sub-section */}
            <FKInputField
              id="review-businessAddress-street"
              className="md:col-span-2" 
              mainLanguage={germanT?.businessInfo?.businessAddress?.street || 'Geschäftsadresse - Straße'}
              selectedLanguage={selectedT?.businessInfo?.businessAddress?.street || 'Business Address - Street'}
              value={businessInfo.businessAddress?.street || '-'}
              readOnly={true}
            />
            <FKInputField
              id="review-businessAddress-houseNumber"
              mainLanguage={germanT?.businessInfo?.businessAddress?.houseNumber || 'Hausnummer'}
              selectedLanguage={selectedT?.businessInfo?.businessAddress?.houseNumber || 'House Number'}
              value={businessInfo.businessAddress?.houseNumber || '-'}
              readOnly={true}
            />
            <FKInputField
              id="review-businessAddress-postalCode"
              mainLanguage={germanT?.businessInfo?.businessAddress?.postalCode || 'Postleitzahl'}
              selectedLanguage={selectedT?.businessInfo?.businessAddress?.postalCode || 'Postal Code'}
              value={businessInfo.businessAddress?.postalCode || '-'}
              readOnly={true}
            />
            <FKInputField
              id="review-businessAddress-city"
              mainLanguage={germanT?.businessInfo?.businessAddress?.city || 'Stadt'}
              selectedLanguage={selectedT?.businessInfo?.businessAddress?.city || 'City'}
              value={businessInfo.businessAddress?.city || '-'}
              readOnly={true}
            />
          </>
        )}
      </FormSection>

      {/* Foreign Residence Section */}      
      <FormSection title={<>{germanT?.foreignResidence?.title || 'Ausländischer Wohnsitz'} / {selectedT?.foreignResidence?.title || 'Foreign Residence'}</>}>
         <FKInputField
            id="review-hasForeignResidence"
            mainLanguage={germanT?.foreignResidence?.hasResidence || 'Ausländischer Wohnsitz?'}
            selectedLanguage={selectedT?.foreignResidence?.hasResidence || 'Foreign Residence?'}
            value={formatBoolean(personalInfo.hasForeignResidence)}
            readOnly={true}
          />
          {!personalInfo.hasForeignResidence && <div className="md:col-span-1"></div>} { /* Spacer */}

          {personalInfo.hasForeignResidence && personalInfo.foreignResidence && (
            <>
              <FKInputField
                id="review-foreignResidence-country"
                mainLanguage={germanT?.foreignResidence?.country || 'Land'}
                selectedLanguage={selectedT?.foreignResidence?.country || 'Country'}
                value={personalInfo.foreignResidence?.country || '-'}
                readOnly={true}
              />
              {personalInfo.foreignResidence?.country === 'other' && (
                <FKInputField
                  id="review-foreignResidence-otherCountry"
                  mainLanguage={germanT?.foreignResidence?.otherCountry || 'Anderes Land'}
                  selectedLanguage={selectedT?.foreignResidence?.otherCountry || 'Other Country'}
                  value={personalInfo.foreignResidence?.otherCountry || '-'}
                  readOnly={true}
                />
              )}
              {personalInfo.foreignResidence?.country !== 'other' && <div className="md:col-span-1"></div>} { /* Spacer */}
            </>
          )}
      </FormSection>

      {/* Spouse Information Section */}      
      <FormSection title={<>{germanT?.spouse?.title || 'Ehepartner Informationen'} / {selectedT?.spouse?.title || 'Spouse Information'}</>}>
         <FKInputField
            id="review-maritalStatus"
            mainLanguage={germanT?.personalInfo?.maritalStatus || 'Familienstand'}
            selectedLanguage={selectedT?.personalInfo?.maritalStatus || 'Marital Status'}
            value={personalInfo.maritalStatus || '-'}
            readOnly={true}
          />
        {personalInfo.maritalStatus !== 'married' && <div className="md:col-span-1"></div>} { /* Spacer */}

        {personalInfo.maritalStatus === 'married' && personalInfo.spouse && (
          <>
            <FKInputField
              id="review-spouse-firstName"
              mainLanguage={germanT?.spouse?.firstName || 'Vorname des Ehepartners'}
              selectedLanguage={selectedT?.spouse?.firstName || 'Spouse First Name'}
              value={personalInfo.spouse?.firstName || '-'}
              readOnly={true}
            />
            <FKInputField
              id="review-spouse-lastName"
              mainLanguage={germanT?.spouse?.lastName || 'Nachname des Ehepartners'}
              selectedLanguage={selectedT?.spouse?.lastName || 'Spouse Last Name'}
              value={personalInfo.spouse?.lastName || '-'}
              readOnly={true}
            />
            <FKInputField
              id="review-spouse-dateOfBirth"
              type="date"
              mainLanguage={germanT?.spouse?.dateOfBirth || 'Geburtsdatum des Ehepartners'}
              selectedLanguage={selectedT?.spouse?.dateOfBirth || 'Spouse Date of Birth'}
              value={personalInfo.spouse?.dateOfBirth || '-'}
              readOnly={true}
            />
            <FKInputField
              id="review-spouse-taxId"
              mainLanguage={germanT?.spouse?.taxId || 'Steuer-ID des Ehepartners'}
              selectedLanguage={selectedT?.spouse?.taxId || 'Spouse Tax ID'}
              value={personalInfo.spouse?.taxId || '-'}
              readOnly={true}
            />
            <FKInputField
              id="review-spouse-hasIncome"
              mainLanguage={germanT?.spouse?.hasIncome || 'Hat Einkommen?'}
              selectedLanguage={selectedT?.spouse?.hasIncome || 'Has Income?'}
              value={formatBoolean(personalInfo.spouse?.hasIncome)}
              readOnly={true}
            />
            {!personalInfo.spouse?.hasIncome && <div className="md:col-span-1"></div>} { /* Spacer */}

            {personalInfo.spouse?.hasIncome && (
              <>
                <FKInputField
                  id="review-spouse-incomeType"
                  mainLanguage={germanT?.spouse?.incomeType || 'Einkommensart'}
                  selectedLanguage={selectedT?.spouse?.incomeType || 'Income Type'}
                  value={personalInfo.spouse?.incomeType || '-'}
                  readOnly={true}
                />
                <FKInputField
                  id="review-spouse-jointTaxation"
                  mainLanguage={germanT?.spouse?.jointTaxation || 'Gemeinsame Veranlagung?'}
                  selectedLanguage={selectedT?.spouse?.jointTaxation || 'Joint Taxation?'}
                  value={formatBoolean(personalInfo.spouse?.jointTaxation)}
                  readOnly={true}
                />
              </>
            )}
          </>
        )}
      </FormSection>

      {/* Children Section */}      
      <FormSection title={<>{germanT?.children?.title || 'Kinder'} / {selectedT?.children?.title || 'Children'}</>}>
          <FKInputField
            id="review-hasChildren"
            mainLanguage={germanT?.children?.hasChildren || 'Haben Sie Kinder?'}
            selectedLanguage={selectedT?.children?.hasChildren || 'Do you have children?'}
            value={formatBoolean(personalInfo.hasChildren)}
            readOnly={true}
          />
          {!personalInfo.hasChildren && <div className="md:col-span-1"></div>} { /* Spacer */}

          {(personalInfo.hasChildren && personalInfo.children && personalInfo.children.length > 0) && (
             personalInfo.children.map((child: any, index: number) => (
              <React.Fragment key={`child-${index}`}>
                <div className="md:col-span-2 mt-4 pt-4 border-t">
                  <h4 className="font-semibold text-md">
                     {germanT?.children?.child || 'Kind'} {index + 1} / {selectedT?.children?.child || 'Child'} {index + 1}
                  </h4>
                </div>
                 <FKInputField
                   id={`review-child-${index}-firstName`}
                   mainLanguage={germanT?.children?.firstName || 'Vorname'}
                   selectedLanguage={selectedT?.children?.firstName || 'First Name'}
                   value={child.firstName || '-'}
                   readOnly={true}
                 />
                 <FKInputField
                   id={`review-child-${index}-lastName`}
                   mainLanguage={germanT?.children?.lastName || 'Nachname'}
                   selectedLanguage={selectedT?.children?.lastName || 'Last Name'}
                   value={child.lastName || '-'}
                   readOnly={true}
                 />
                 <FKInputField
                   id={`review-child-${index}-dateOfBirth`}
                   type="date"
                   mainLanguage={germanT?.children?.dateOfBirth || 'Geburtsdatum'}
                   selectedLanguage={selectedT?.children?.dateOfBirth || 'Date of Birth'}
                   value={child.dateOfBirth || '-'}
                   readOnly={true}
                 />
                 <FKInputField
                   id={`review-child-${index}-taxId`}
                   mainLanguage={germanT?.children?.taxId || 'Steuer-ID'}
                   selectedLanguage={selectedT?.children?.taxId || 'Tax ID'}
                   value={child.taxId || '-'}
                   readOnly={true}
                 />
              </React.Fragment>
            ))
          )
         }
      </FormSection>

      {/* --- NEW SECTIONS START --- */} 

      {/* Employment Income Section */} 
      <FormSection title={<>{germanT?.employmentIncome?.title || 'Einkünfte aus nichtselbständiger Arbeit'} / {selectedT?.employmentIncome?.title || 'Employment Income'}</>}>
         {/* Example Fields - Adjust based on actual employmentIncome structure */} 
         <FKInputField
           id="review-employment-grossSalary"
           mainLanguage={germanT?.employmentIncome?.grossSalary || 'Bruttoarbeitslohn'}
           selectedLanguage={selectedT?.employmentIncome?.grossSalary || 'Gross Salary'}
           value={formatCurrency(employmentIncome.grossSalary)}
           readOnly={true}
         />
         <FKInputField
           id="review-employment-incomeTax"
           mainLanguage={germanT?.employmentIncome?.incomeTax || 'Lohnsteuer'}
           selectedLanguage={selectedT?.employmentIncome?.incomeTax || 'Income Tax'}
           value={formatCurrency(employmentIncome.incomeTax)}
           readOnly={true}
         />
          <FKInputField
           id="review-employment-solidaritySurcharge"
           mainLanguage={germanT?.employmentIncome?.solidaritySurcharge || 'Solidaritätszuschlag'}
           selectedLanguage={selectedT?.employmentIncome?.solidaritySurcharge || 'Solidarity Surcharge'}
           value={formatCurrency(employmentIncome.solidaritySurcharge)}
           readOnly={true}
         />
         <FKInputField
           id="review-employment-churchTax"
           mainLanguage={germanT?.employmentIncome?.churchTax || 'Kirchensteuer'}
           selectedLanguage={selectedT?.employmentIncome?.churchTax || 'Church Tax'}
           value={formatCurrency(employmentIncome.churchTax)}
           readOnly={true}
         />
         {/* Add more fields as needed */} 
      </FormSection>

      {/* Business Income Section - Refined */} 
      {businessInfo.isBusinessOwner && (
        <FormSection title={<>{germanT?.businessIncome?.title || 'Einkünfte aus Gewerbebetrieb/Selbständiger Arbeit'} / {selectedT?.businessIncome?.title || 'Business/Self-Employment Income'}</>}>
          <FKInputField
                id="review-businessEarnings"
                mainLanguage={germanT?.businessInfo?.businessEarnings || 'Geschäftliche Einnahmen (EUR)'}
                selectedLanguage={selectedT?.businessInfo?.businessEarnings || 'Business Earnings (EUR)'}
                value={formatCurrency(businessInfo.businessEarnings)}
                readOnly={true}
              />
              <FKInputField
                id="review-businessExpenses"
                mainLanguage={germanT?.businessInfo?.businessExpenses || 'Geschäftliche Ausgaben (EUR)'} 
                selectedLanguage={selectedT?.businessInfo?.businessExpenses || 'Business Expenses (EUR)'}
                value={formatCurrency(businessInfo.businessExpenses)}
                readOnly={true}
              />
             {/* You might add more specific business income fields here if they exist */}
        </FormSection>
      )}

      {/* Expenses & Deductions Section */} 
      <FormSection title={<>{germanT?.expenses?.title || 'Ausgaben & Abzüge'} / {selectedT?.expenses?.title || 'Expenses & Deductions'}</>}>
         {/* Example Fields - Adjust based on actual expenses structure */} 
         <FKInputField
           id="review-expenses-commute"
           mainLanguage={germanT?.expenses?.commute || 'Fahrtkosten (Pendlerpauschale)'}
           selectedLanguage={selectedT?.expenses?.commute || 'Commuting Costs'}
           value={formatCurrency(expenses.commute)}
           readOnly={true}
         />
         <FKInputField
           id="review-expenses-workRelated"
           mainLanguage={germanT?.expenses?.workRelated || 'Weitere Werbungskosten'}
           selectedLanguage={selectedT?.expenses?.workRelated || 'Other Work-Related Expenses'}
           value={formatCurrency(expenses.workRelated)}
           readOnly={true}
         />
         <FKInputField
           id="review-expenses-insurance"
           mainLanguage={germanT?.expenses?.insurance || 'Versicherungsbeiträge (Sonderausgaben)'}
           selectedLanguage={selectedT?.expenses?.insurance || 'Insurance Premiums (Special Expenses)'}
           value={formatCurrency(expenses.insurance)}
           readOnly={true}
         />
         <FKInputField
           id="review-expenses-donations"
           mainLanguage={germanT?.expenses?.donations || 'Spenden'}
           selectedLanguage={selectedT?.expenses?.donations || 'Donations'}
           value={formatCurrency(expenses.donations)}
           readOnly={true}
         />
         {/* Add more fields like childcare, healthcare, etc. as needed */} 
      </FormSection>

       {/* --- NEW SECTIONS END --- */} 

       {/* --- NEW EXPENSES SECTION START --- */}

       {/* Expenses Section */}
       <FormSection title={<>{germanT?.expenses?.title || 'Ausgaben & Abzüge'} / {selectedT?.expenses?.title || 'Expenses & Deductions'}</>}>
         {/* Check if any expenses data exists */}
         {Object.keys(expenses).length > 0 ? (
             <>
                 {/* Work Related Sub-section */}
                 <SubHeading
                     germanText={germanT?.expenses?.workRelatedExpenses || 'Werbungskosten'}
                     englishText={selectedT?.expenses?.workRelatedExpenses || 'Work-Related Expenses'}
                 />
                 <FKInputField id="review-exp-commuting" mainLanguage={germanT?.expenses?.commutingExpenses || 'Fahrtkosten'} selectedLanguage={selectedT?.expenses?.commutingExpenses || 'Commuting Costs'} value={formatCurrency(expenses.commutingExpenses)} readOnly={true} />
                 <FKInputField id="review-exp-trips" mainLanguage={germanT?.expenses?.businessTripsCosts || 'Geschäftsreisen/Fortbildung'} selectedLanguage={selectedT?.expenses?.businessTripsCosts || 'Business Trips/Training'} value={formatCurrency(expenses.businessTripsCosts)} readOnly={true} />
                 <FKInputField id="review-exp-equipment" mainLanguage={germanT?.expenses?.workEquipment || 'Arbeitsmittel'} selectedLanguage={selectedT?.expenses?.workEquipment || 'Work Equipment'} value={formatCurrency(expenses.workEquipment)} readOnly={true} />
                 <FKInputField id="review-exp-homeOffice" mainLanguage={germanT?.expenses?.homeOfficeAllowance || 'Home-Office Pauschale'} selectedLanguage={selectedT?.expenses?.homeOfficeAllowance || 'Home Office Allowance'} value={formatCurrency(expenses.homeOfficeAllowance)} readOnly={true} />
                 <FKInputField id="review-exp-membership" mainLanguage={germanT?.expenses?.membershipFees || 'Mitgliedsbeiträge'} selectedLanguage={selectedT?.expenses?.membershipFees || 'Membership Fees'} value={formatCurrency(expenses.membershipFees)} readOnly={true} />
                 <FKInputField id="review-exp-application" mainLanguage={germanT?.expenses?.applicationCosts || 'Bewerbungskosten'} selectedLanguage={selectedT?.expenses?.applicationCosts || 'Application Costs'} value={formatCurrency(expenses.applicationCosts)} readOnly={true} />
                 <FKInputField id="review-exp-doubleHousehold" mainLanguage={germanT?.expenses?.doubleHouseholdCosts || 'Doppelte Haushaltsführung'} selectedLanguage={selectedT?.expenses?.doubleHouseholdCosts || 'Double Household Costs'} value={formatCurrency(expenses.doubleHouseholdCosts)} readOnly={true} />
                 <div className="md:col-span-1"></div> {/* Spacer */}

                 {/* Special Expenses Sub-section */}
                 <SubHeading
                     germanText={germanT?.expenses?.specialExpenses || 'Sonderausgaben'}
                     englishText={selectedT?.expenses?.specialExpenses || 'Special Expenses'}
                 />
                  <FKInputField id="review-exp-churchTax" mainLanguage={germanT?.expenses?.churchTax || 'Kirchensteuer'} selectedLanguage={selectedT?.expenses?.churchTax || 'Church Tax'} value={formatCurrency(expenses.churchTax)} readOnly={true} />
                  <FKInputField id="review-exp-donations" mainLanguage={germanT?.expenses?.donationsAndFees || 'Spenden/Mitgliedsbeiträge'} selectedLanguage={selectedT?.expenses?.donationsAndFees || 'Donations/Fees'} value={formatCurrency(expenses.donationsAndFees)} readOnly={true} />
                  <FKInputField id="review-exp-childcare" mainLanguage={germanT?.expenses?.childcareCosts || 'Kinderbetreuungskosten'} selectedLanguage={selectedT?.expenses?.childcareCosts || 'Childcare Costs'} value={formatCurrency(expenses.childcareCosts)} readOnly={true} />
                  <div className="md:col-span-1"></div> {/* Spacer */}

                  {/* Insurance Sub-section */}
                  <SubHeading
                     germanText={germanT?.expenses?.insuranceContributions || 'Versicherungsbeiträge'}
                     englishText={selectedT?.expenses?.insuranceContributions || 'Insurance Contributions'}
                 />
                 <FKInputField id="review-ins-health" mainLanguage={germanT?.expenses?.healthInsurance || 'Krankenversicherung'} selectedLanguage={selectedT?.expenses?.healthInsurance || 'Health Insurance'} value={formatCurrency(expenses.healthInsurance)} readOnly={true} />
                 <FKInputField id="review-ins-care" mainLanguage={germanT?.expenses?.longTermCareInsurance || 'Pflegeversicherung'} selectedLanguage={selectedT?.expenses?.longTermCareInsurance || 'Long-Term Care Insurance'} value={formatCurrency(expenses.longTermCareInsurance)} readOnly={true} />
                 <FKInputField id="review-ins-accident" mainLanguage={germanT?.expenses?.accidentInsurance || 'Unfallversicherung'} selectedLanguage={selectedT?.expenses?.accidentInsurance || 'Accident Insurance'} value={formatCurrency(expenses.accidentInsurance)} readOnly={true} />
                 <FKInputField id="review-ins-liability" mainLanguage={germanT?.expenses?.liabilityInsurance || 'Haftpflichtversicherung'} selectedLanguage={selectedT?.expenses?.liabilityInsurance || 'Liability Insurance'} value={formatCurrency(expenses.liabilityInsurance)} readOnly={true} />
                 <FKInputField id="review-ins-life" mainLanguage={germanT?.expenses?.lifeInsurance || 'Lebensversicherung'} selectedLanguage={selectedT?.expenses?.lifeInsurance || 'Life Insurance'} value={formatCurrency(expenses.lifeInsurance)} readOnly={true} />
                 <FKInputField id="review-ins-pension" mainLanguage={germanT?.expenses?.pensionInsurance || 'Rentenversicherung'} selectedLanguage={selectedT?.expenses?.pensionInsurance || 'Pension Insurance'} value={formatCurrency(expenses.pensionInsurance)} readOnly={true} />
                 <FKInputField id="review-ins-unemployment" mainLanguage={germanT?.expenses?.unemploymentInsurance || 'Arbeitslosenversicherung'} selectedLanguage={selectedT?.expenses?.unemploymentInsurance || 'Unemployment Insurance'} value={formatCurrency(expenses.unemploymentInsurance)} readOnly={true} />
                  <div className="md:col-span-1"></div> {/* Spacer */}

                   {/* Extraordinary Burdens Sub-section */}
                  <SubHeading
                     germanText={germanT?.expenses?.extraordinaryBurdens || 'Außergewöhnliche Belastungen'}
                     englishText={selectedT?.expenses?.extraordinaryBurdens || 'Extraordinary Burdens'}
                 />
                 <FKInputField id="review-burdens-medical" mainLanguage={germanT?.expenses?.medicalExpenses || 'Krankheitskosten'} selectedLanguage={selectedT?.expenses?.medicalExpenses || 'Medical Expenses'} value={formatCurrency(expenses.medicalExpenses)} readOnly={true} />
                 <FKInputField id="review-burdens-disability" mainLanguage={germanT?.expenses?.disabilityCosts || 'Behinderungskosten'} selectedLanguage={selectedT?.expenses?.disabilityCosts || 'Disability Costs'} value={formatCurrency(expenses.disabilityCosts)} readOnly={true} />
                 <FKInputField id="review-burdens-care" mainLanguage={germanT?.expenses?.careCosts || 'Pflegekosten'} selectedLanguage={selectedT?.expenses?.careCosts || 'Care Costs'} value={formatCurrency(expenses.careCosts)} readOnly={true} />
                 <FKInputField id="review-burdens-funeral" mainLanguage={germanT?.expenses?.funeralCosts || 'Beerdigungskosten'} selectedLanguage={selectedT?.expenses?.funeralCosts || 'Funeral Costs'} value={formatCurrency(expenses.funeralCosts)} readOnly={true} />
                 <FKInputField id="review-burdens-other" mainLanguage={germanT?.expenses?.otherBurdens || 'Andere Belastungen'} selectedLanguage={selectedT?.expenses?.otherBurdens || 'Other Burdens'} value={formatCurrency(expenses.otherBurdens)} readOnly={true} />
                  <div className="md:col-span-1"></div> {/* Spacer */}

                  {/* Household Related Sub-section */}
                  <SubHeading
                     germanText={germanT?.expenses?.householdRelated || 'Haushaltsnahe Dienstleistungen'}
                     englishText={selectedT?.expenses?.householdRelated || 'Household-Related Services'}
                  />
                  <FKInputField id="review-household-craftsman" mainLanguage={germanT?.expenses?.craftsmanServices || 'Handwerkerleistungen'} selectedLanguage={selectedT?.expenses?.craftsmanServices || 'Craftsman Services'} value={formatCurrency(expenses.craftsmanServices)} readOnly={true} />
                  <FKInputField id="review-household-services" mainLanguage={germanT?.expenses?.householdServices || 'Haushaltsnahe Dienstleistungen'} selectedLanguage={selectedT?.expenses?.householdServices || 'Household Services'} value={formatCurrency(expenses.householdServices)} readOnly={true} />
                  <FKInputField id="review-household-minijob" mainLanguage={germanT?.expenses?.miniJobCosts || 'Minijob Kosten'} selectedLanguage={selectedT?.expenses?.miniJobCosts || 'Mini-Job Costs'} value={formatCurrency(expenses.miniJobCosts)} readOnly={true} />
                   <div className="md:col-span-1"></div> {/* Spacer */}
             </>
         ) : (
              <div className="md:col-span-2 text-neutral-500 text-sm italic">
                  {germanT?.common?.noData || 'Keine Daten erfasst'} / {selectedT?.common?.noData || 'No data entered'}
              </div>
         )}
       </FormSection>
       {/* --- NEW EXPENSES SECTION END --- */}

       {/* --- NEW FOREIGN INCOME SECTION START --- */}
       {/* Foreign Income Section */}
       <FormSection title={<>{germanT?.foreignIncome?.title || 'Ausländische Einkünfte'} / {selectedT?.foreignIncome?.title || 'Foreign Income'}</>}>
          <FKInputField
            id="review-hasForeignIncome"
            mainLanguage={germanT?.incomeInfo?.hasForeignIncome || 'Ausländische Einkünfte erhalten?'}
            selectedLanguage={selectedT?.incomeInfo?.hasForeignIncome || 'Received foreign income?'}
            value={formatBoolean(personalInfo.hasForeignIncome)}
            readOnly={true}
          />
          {!personalInfo.hasForeignIncome ? <div className="md:col-span-1"></div> : (
              <FKInputField
                id="review-foreignIncomeCountry"
                mainLanguage={germanT?.foreignIncome?.countryQuestion || 'Herkunftsland'}
                selectedLanguage={selectedT?.foreignIncome?.countryQuestion || 'Country of Origin'}
                value={personalInfo.foreignIncomeCountry || '-'}
                readOnly={true}
              />
          )}

          {/* Show details only if hasForeignIncome is true */} 
          {personalInfo.hasForeignIncome && (
            <>
              <FKInputField
                id="review-foreignIncomeType"
                mainLanguage={germanT?.foreignIncome?.incomeTypeQuestion || 'Art der Einkünfte'}
                selectedLanguage={selectedT?.foreignIncome?.incomeTypeQuestion || 'Type of Income'}
                value={personalInfo.foreignIncomeType || '-'}
                readOnly={true}
              />
              <FKInputField
                id="review-foreignIncomeAmount"
                mainLanguage={germanT?.foreignIncome?.totalAmountQuestion || 'Betrag (EUR)'}
                selectedLanguage={selectedT?.foreignIncome?.totalAmountQuestion || 'Amount (EUR)'}
                value={formatCurrency(personalInfo.foreignIncomeAmount)}
                readOnly={true}
              />
              <FKInputField
                id="review-foreignIncomeTaxPaid"
                mainLanguage={germanT?.foreignIncome?.taxPaidQuestion || 'Gezahlte ausl. Steuer (EUR)'}
                selectedLanguage={selectedT?.foreignIncome?.taxPaidQuestion || 'Foreign Tax Paid (EUR)'}
                value={formatCurrency(personalInfo.foreignIncomeTaxPaid)}
                readOnly={true}
              />
               {/* Spacer to balance grid if needed */} 
                <div className="md:col-span-1"></div> 
            </>
          )}
        </FormSection>
       {/* --- NEW FOREIGN INCOME SECTION END --- */} 

       {/* Signature Section */}
       <FormSection title={<>{germanT?.signature?.title || 'Unterschrift & Bedingungen'} / {selectedT?.signature?.title || 'Signature & Terms'}</>}>
          <FKInputField
            id="review-signature-place"
            mainLanguage={germanT?.signature?.place || 'Ort'}
            selectedLanguage={selectedT?.signature?.place || 'Place'}
            value={signature.place || '-'}
            readOnly={true}
          />
          <FKInputField
            id="review-signature-date"
            type="date"
            mainLanguage={germanT?.signature?.date || 'Datum'}
            selectedLanguage={selectedT?.signature?.date || 'Date'}
            value={signature.date || '-'}
            readOnly={true}
          />
          <ImageField
             fullWidth={true}
             germanLabel={germanT?.signature?.signature || 'Digitale Unterschrift'}
             label={selectedT?.signature?.signature || 'Digital Signature'}
             value={signature.signature} 
           />
           
           <FKInputField
             id="review-terms-accept"
             mainLanguage={germanT?.terms?.accept || 'Bedingungen akzeptiert?'}
             selectedLanguage={selectedT?.terms?.accept || 'Terms Accepted?'}
             value={formatBoolean(signature.acceptTerms)}
             readOnly={true}
           />
           <FKInputField
             id="review-terms-dataProtection"
             mainLanguage={germanT?.terms?.dataProtection || 'Datenschutz akzeptiert?'}
             selectedLanguage={selectedT?.terms?.dataProtection || 'Data Protection Accepted?'}
             value={formatBoolean(signature.acceptDataProtection)}
             readOnly={true}
           />
       </FormSection>

    </div>
  );
};

export default TFReview; 