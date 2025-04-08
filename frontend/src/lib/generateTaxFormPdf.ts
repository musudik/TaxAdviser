import jsPDF from 'jspdf';

// Helper to format boolean values for PDF
const formatBooleanPdf = (value: boolean | undefined | null, germanT: any, selectedT: any): string => {
  if (value === undefined || value === null) return '-';
  const yes = selectedT?.common?.yes || 'Yes';
  const no = selectedT?.common?.no || 'No';
  const germanYes = germanT?.common?.yes || 'Ja';
  const germanNo = germanT?.common?.no || 'Nein';
  return value ? `${germanYes} / ${yes}` : `${germanNo} / ${no}`;
};

// Helper to format currency values for PDF
const formatCurrencyPdf = (value: number | string | undefined | null): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (numValue === undefined || numValue === null || isNaN(numValue)) return '-';
  if (numValue === 0) return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(0);
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(numValue);
};

// Helper to add a field to the PDF
const addField = (doc: jsPDF, yPos: { current: number }, germanLabel: string, selectedLabel: string, value: string, indent: number = 0) => {
  const xStart = 20 + indent;
  const valueX = 150; // Adjust as needed for alignment
  const lineHeight = 7; // Adjust line height
  const pageHeight = doc.internal.pageSize.height;
  const bottomMargin = 20;

  if (yPos.current + lineHeight > pageHeight - bottomMargin) {
    doc.addPage();
    yPos.current = 20; // Reset Y position on new page
  }

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(germanLabel || 'Label (DE)', xStart, yPos.current);
  doc.setFont('helvetica', 'normal');
  doc.text(selectedLabel || 'Label', xStart, yPos.current + 4);
  
  doc.setFont('helvetica', 'normal');
  // Handle potential line breaks for long values if needed
  doc.text(value || '-', valueX, yPos.current + 2); 
  
  yPos.current += lineHeight + 4; // Increase spacing slightly
};

// Helper to add a section title
const addSectionTitle = (doc: jsPDF, yPos: { current: number }, germanTitle: string, selectedTitle: string) => {
  const lineHeight = 10;
  const pageHeight = doc.internal.pageSize.height;
  const bottomMargin = 20;

  if (yPos.current + lineHeight * 2 > pageHeight - bottomMargin) {
    doc.addPage();
    yPos.current = 20;
  }

  yPos.current += lineHeight; // Add space before title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`${germanTitle} / ${selectedTitle}`, 20, yPos.current);
  yPos.current += lineHeight;
};

// Helper to add a sub-section title
const addSubHeading = (doc: jsPDF, yPos: { current: number }, germanTitle: string, selectedTitle: string) => {
  const lineHeight = 8;
  const pageHeight = doc.internal.pageSize.height;
  const bottomMargin = 20;

  if (yPos.current + lineHeight * 2 > pageHeight - bottomMargin) {
    doc.addPage();
    yPos.current = 20;
  }

  yPos.current += lineHeight / 2; // Add space before title
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100); // Slightly lighter color for subheading
  doc.text(`${germanTitle} / ${selectedTitle}`, 20, yPos.current);
  doc.setTextColor(0); // Reset color
  yPos.current += lineHeight;
};

export const generateTaxFormPdf = async (formData: any, germanI18nData: any, i18nData: any) => {
  const doc = new jsPDF();
  const yPos = { current: 20 }; // Use object to pass by reference

  // Ensure translation data exists, provide fallbacks
  const germanT_form = germanI18nData?.taxForm || {};
  const t = i18nData?.taxForm || {};

  // ---- Document Header ----
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Steuerformular Zusammenfassung / Tax Form Summary', 20, yPos.current);
  yPos.current += 15;

  // ---- Personal Information ----
  const personalInfo = formData.personalInfo || {};
  const piGermanT = germanT_form.personalInfo || {};
  const piT = t.personalInfo || {};
  addSectionTitle(doc, yPos, piGermanT.title || 'Persönliche Informationen', piT.title || 'Personal Information');
  addField(doc, yPos, piGermanT.firstName || 'Vorname', piT.firstName || 'First Name', personalInfo.firstName);
  addField(doc, yPos, piGermanT.lastName || 'Nachname', piT.lastName || 'Last Name', personalInfo.lastName);
  addField(doc, yPos, piGermanT.taxId || 'Steuer-ID', piT.taxId || 'Tax ID', personalInfo.taxId);
  addField(doc, yPos, piGermanT.dateOfBirth || 'Geburtsdatum', piT.dateOfBirth || 'Date of Birth', personalInfo.dateOfBirth);
  addField(doc, yPos, piGermanT.email || 'E-Mail', piT.email || 'Email', personalInfo.email);
  addField(doc, yPos, piGermanT.phone || 'Telefon', piT.phone || 'Phone', personalInfo.phone);
  addField(doc, yPos, piGermanT.maritalStatus || 'Familienstand', piT.maritalStatus || 'Marital Status', personalInfo.maritalStatus);

  // ---- Address ----
  const addressGermanT = germanT_form.address || {};
  const addressT = t.address || {};
  addSectionTitle(doc, yPos, addressGermanT.title || 'Adresse', addressT.title || 'Address');
  addField(doc, yPos, addressGermanT.street || 'Straße', addressT.street || 'Street', personalInfo.address?.street);
  addField(doc, yPos, addressGermanT.houseNumber || 'Hausnummer', addressT.houseNumber || 'House Number', personalInfo.address?.houseNumber);
  addField(doc, yPos, addressGermanT.postalCode || 'Postleitzahl', addressT.postalCode || 'Postal Code', personalInfo.address?.postalCode);
  addField(doc, yPos, addressGermanT.city || 'Stadt', addressT.city || 'City', personalInfo.address?.city);

  // ---- Business Information ----
  const businessInfo = formData.businessInfo || {};
  const bizGermanT = germanT_form.businessInfo || {};
  const bizT = t.businessInfo || {};
  addSectionTitle(doc, yPos, bizGermanT.title || 'Geschäftsinformationen', bizT.title || 'Business Information');
  addField(doc, yPos, bizGermanT.isBusinessOwner || 'Geschäftsinhaber?', bizT.isBusinessOwner || 'Business Owner?', formatBooleanPdf(businessInfo.isBusinessOwner, germanI18nData, i18nData));
  if (businessInfo.isBusinessOwner) {
    addField(doc, yPos, bizGermanT.businessType || 'Geschäftsart', bizT.businessType || 'Business Type', businessInfo.businessType, 10);
    // Business Address
    const bizAddrGermanT = bizGermanT.businessAddress || {};
    const bizAddrT = bizT.businessAddress || {};
    addField(doc, yPos, bizAddrGermanT.street || 'Straße', bizAddrT.street || 'Street', businessInfo.businessAddress?.street, 10);
    addField(doc, yPos, bizAddrGermanT.houseNumber || 'Hausnummer', bizAddrT.houseNumber || 'House Number', businessInfo.businessAddress?.houseNumber, 10);
    addField(doc, yPos, bizAddrGermanT.postalCode || 'Postleitzahl', bizAddrT.postalCode || 'Postal Code', businessInfo.businessAddress?.postalCode, 10);
    addField(doc, yPos, bizAddrGermanT.city || 'Stadt', bizAddrT.city || 'City', businessInfo.businessAddress?.city, 10);
  }
  
   // ---- Foreign Residence ----
   const frGermanT = germanT_form.foreignResidence || {};
   const frT = t.foreignResidence || {};
   addSectionTitle(doc, yPos, frGermanT.title || 'Ausländischer Wohnsitz', frT.title || 'Foreign Residence');
   addField(doc, yPos, frGermanT.hasResidence || 'Wohnsitz im Ausland?', frT.hasResidence || 'Foreign Residence?', formatBooleanPdf(personalInfo.hasForeignResidence, germanI18nData, i18nData));
   if (personalInfo.hasForeignResidence && personalInfo.foreignResidence) {
     addField(doc, yPos, frGermanT.country || 'Land', frT.country || 'Country', personalInfo.foreignResidence.country, 10);
     if (personalInfo.foreignResidence.country === 'other') {
       addField(doc, yPos, frGermanT.otherCountry || 'Anderes Land', frT.otherCountry || 'Other Country', personalInfo.foreignResidence.otherCountry, 10);
     }
   }

  // ---- Spouse Information ----
  const spouseGermanT = germanT_form.spouse || {};
  const spouseT = t.spouse || {};
  if (personalInfo.maritalStatus === 'married') {
    addSectionTitle(doc, yPos, spouseGermanT.title || 'Ehepartner Informationen', spouseT.title || 'Spouse Information');
    const spouseData = personalInfo.spouse || {};
    addField(doc, yPos, spouseGermanT.firstName || 'Vorname', spouseT.firstName || 'First Name', spouseData.firstName);
    addField(doc, yPos, spouseGermanT.lastName || 'Nachname', spouseT.lastName || 'Last Name', spouseData.lastName);
    addField(doc, yPos, spouseGermanT.dateOfBirth || 'Geburtsdatum', spouseT.dateOfBirth || 'Date of Birth', spouseData.dateOfBirth);
    addField(doc, yPos, spouseGermanT.taxId || 'Steuer-ID', spouseT.taxId || 'Tax ID', spouseData.taxId);
    addField(doc, yPos, spouseGermanT.hasIncome || 'Hat Einkommen?', spouseT.hasIncome || 'Has Income?', formatBooleanPdf(spouseData.hasIncome, germanI18nData, i18nData));
    if (spouseData.hasIncome) {
      addField(doc, yPos, spouseGermanT.incomeType || 'Einkommensart', spouseT.incomeType || 'Income Type', spouseData.incomeType, 10);
      addField(doc, yPos, spouseGermanT.jointTaxation || 'Gemeinsame Veranlagung?', spouseT.jointTaxation || 'Joint Taxation?', formatBooleanPdf(spouseData.jointTaxation, germanI18nData, i18nData), 10);
    }
  }

  // ---- Children Information ----
  const childrenGermanT = germanT_form.children || {};
  const childrenT = t.children || {};
  addSectionTitle(doc, yPos, childrenGermanT.title || 'Kinder', childrenT.title || 'Children');
  addField(doc, yPos, childrenGermanT.hasChildren || 'Haben Sie Kinder?', childrenT.hasChildren || 'Do you have children?', formatBooleanPdf(personalInfo.hasChildren, germanI18nData, i18nData));
  if (personalInfo.hasChildren && personalInfo.children?.length > 0) {
    personalInfo.children.forEach((child: any, index: number) => {
      addSubHeading(doc, yPos, `${childrenGermanT.child || 'Kind'} ${index + 1}`, `${childrenT.child || 'Child'} ${index + 1}`);
      addField(doc, yPos, childrenGermanT.firstName || 'Vorname', childrenT.firstName || 'First Name', child.firstName, 10);
      addField(doc, yPos, childrenGermanT.lastName || 'Nachname', childrenT.lastName || 'Last Name', child.lastName, 10);
      addField(doc, yPos, childrenGermanT.dateOfBirth || 'Geburtsdatum', childrenT.dateOfBirth || 'Date of Birth', child.dateOfBirth, 10);
      addField(doc, yPos, childrenGermanT.taxId || 'Steuer-ID', childrenT.taxId || 'Tax ID', child.taxId, 10);
    });
  }
  
  // ---- Employment Income ----
  const empIncome = formData.employmentIncome || {};
  const empGermanT = germanT_form.employmentIncome || {};
  const empT = t.employmentIncome || {};
  addSectionTitle(doc, yPos, empGermanT.title || 'Einkünfte aus nichtselbständiger Arbeit', empT.title || 'Employment Income');
  addField(doc, yPos, empGermanT.grossSalary || 'Bruttoarbeitslohn', empT.grossSalary || 'Gross Salary', formatCurrencyPdf(empIncome.grossSalary));
  addField(doc, yPos, empGermanT.incomeTax || 'Lohnsteuer', empT.incomeTax || 'Income Tax', formatCurrencyPdf(empIncome.incomeTax));
  addField(doc, yPos, empGermanT.solidaritySurcharge || 'Solidaritätszuschlag', empT.solidaritySurcharge || 'Solidarity Surcharge', formatCurrencyPdf(empIncome.solidaritySurcharge));
  addField(doc, yPos, empGermanT.churchTax || 'Kirchensteuer', empT.churchTax || 'Church Tax', formatCurrencyPdf(empIncome.churchTax));

  // ---- Business Income ----
  if (businessInfo.isBusinessOwner) {
      const bizIncGermanT = germanT_form.businessIncome || {};
      const bizIncT = t.businessIncome || {};
      addSectionTitle(doc, yPos, bizIncGermanT.title || 'Einkünfte aus Gewerbebetrieb/Selbständiger Arbeit', bizIncT.title || 'Business/Self-Employment Income');
      addField(doc, yPos, bizGermanT.businessEarnings || 'Einnahmen', bizT.businessEarnings || 'Earnings', formatCurrencyPdf(businessInfo.businessEarnings));
      addField(doc, yPos, bizGermanT.businessExpenses || 'Ausgaben', bizT.businessExpenses || 'Expenses', formatCurrencyPdf(businessInfo.businessExpenses));
  }

  // ---- Expenses ----
  const expenses = formData.expenses || {};
  const expGermanT = germanT_form.expenses || {};
  const expT = t.expenses || {};
  addSectionTitle(doc, yPos, expGermanT.title || 'Ausgaben & Abzüge', expT.title || 'Expenses & Deductions');
  if (Object.keys(expenses).length > 0) {
      addSubHeading(doc, yPos, expGermanT.workRelatedExpenses || 'Werbungskosten', expT.workRelatedExpenses || 'Work-Related Expenses');
      addField(doc, yPos, expGermanT.commutingExpenses || 'Fahrtkosten', expT.commutingExpenses || 'Commuting Costs', formatCurrencyPdf(expenses.commutingExpenses));
      addField(doc, yPos, expGermanT.businessTripsCosts || 'Geschäftsreisen/Fortbildung', expT.businessTripsCosts || 'Business Trips/Training', formatCurrencyPdf(expenses.businessTripsCosts));
      addField(doc, yPos, expGermanT.workEquipment || 'Arbeitsmittel', expT.workEquipment || 'Work Equipment', formatCurrencyPdf(expenses.workEquipment));
      addField(doc, yPos, expGermanT.homeOfficeAllowance || 'Home-Office Pauschale', expT.homeOfficeAllowance || 'Home Office Allowance', formatCurrencyPdf(expenses.homeOfficeAllowance));
      addField(doc, yPos, expGermanT.membershipFees || 'Mitgliedsbeiträge', expT.membershipFees || 'Membership Fees', formatCurrencyPdf(expenses.membershipFees));
      addField(doc, yPos, expGermanT.applicationCosts || 'Bewerbungskosten', expT.applicationCosts || 'Application Costs', formatCurrencyPdf(expenses.applicationCosts));
      addField(doc, yPos, expGermanT.doubleHouseholdCosts || 'Doppelte Haushaltsführung', expT.doubleHouseholdCosts || 'Double Household Costs', formatCurrencyPdf(expenses.doubleHouseholdCosts));

      addSubHeading(doc, yPos, expGermanT.specialExpenses || 'Sonderausgaben', expT.specialExpenses || 'Special Expenses');
      addField(doc, yPos, expGermanT.churchTax || 'Kirchensteuer', expT.churchTax || 'Church Tax', formatCurrencyPdf(expenses.churchTax));
      addField(doc, yPos, expGermanT.donationsAndFees || 'Spenden/Mitgliedsbeiträge', expT.donationsAndFees || 'Donations/Fees', formatCurrencyPdf(expenses.donationsAndFees));
      addField(doc, yPos, expGermanT.childcareCosts || 'Kinderbetreuungskosten', expT.childcareCosts || 'Childcare Costs', formatCurrencyPdf(expenses.childcareCosts));

      addSubHeading(doc, yPos, expGermanT.insuranceContributions || 'Versicherungsbeiträge', expT.insuranceContributions || 'Insurance Contributions');
      addField(doc, yPos, expGermanT.healthInsurance || 'Krankenversicherung', expT.healthInsurance || 'Health Insurance', formatCurrencyPdf(expenses.healthInsurance));
      addField(doc, yPos, expGermanT.longTermCareInsurance || 'Pflegeversicherung', expT.longTermCareInsurance || 'Long-Term Care Insurance', formatCurrencyPdf(expenses.longTermCareInsurance));
      addField(doc, yPos, expGermanT.accidentInsurance || 'Unfallversicherung', expT.accidentInsurance || 'Accident Insurance', formatCurrencyPdf(expenses.accidentInsurance));
      addField(doc, yPos, expGermanT.liabilityInsurance || 'Haftpflichtversicherung', expT.liabilityInsurance || 'Liability Insurance', formatCurrencyPdf(expenses.liabilityInsurance));
      addField(doc, yPos, expGermanT.lifeInsurance || 'Lebensversicherung', expT.lifeInsurance || 'Life Insurance', formatCurrencyPdf(expenses.lifeInsurance));
      addField(doc, yPos, expGermanT.pensionInsurance || 'Rentenversicherung', expT.pensionInsurance || 'Pension Insurance', formatCurrencyPdf(expenses.pensionInsurance));
      addField(doc, yPos, expGermanT.unemploymentInsurance || 'Arbeitslosenversicherung', expT.unemploymentInsurance || 'Unemployment Insurance', formatCurrencyPdf(expenses.unemploymentInsurance));
      
      addSubHeading(doc, yPos, expGermanT.extraordinaryBurdens || 'Außergewöhnliche Belastungen', expT.extraordinaryBurdens || 'Extraordinary Burdens');
      addField(doc, yPos, expGermanT.medicalExpenses || 'Krankheitskosten', expT.medicalExpenses || 'Medical Expenses', formatCurrencyPdf(expenses.medicalExpenses));
      addField(doc, yPos, expGermanT.disabilityCosts || 'Behinderungskosten', expT.disabilityCosts || 'Disability Costs', formatCurrencyPdf(expenses.disabilityCosts));
      addField(doc, yPos, expGermanT.careCosts || 'Pflegekosten', expT.careCosts || 'Care Costs', formatCurrencyPdf(expenses.careCosts));
      addField(doc, yPos, expGermanT.funeralCosts || 'Beerdigungskosten', expT.funeralCosts || 'Funeral Costs', formatCurrencyPdf(expenses.funeralCosts));
      addField(doc, yPos, expGermanT.otherBurdens || 'Andere Belastungen', expT.otherBurdens || 'Other Burdens', formatCurrencyPdf(expenses.otherBurdens));
      
      addSubHeading(doc, yPos, expGermanT.householdRelated || 'Haushaltsnahe Dienstleistungen', expT.householdRelated || 'Household-Related Services');
      addField(doc, yPos, expGermanT.craftsmanServices || 'Handwerkerleistungen', expT.craftsmanServices || 'Craftsman Services', formatCurrencyPdf(expenses.craftsmanServices));
      addField(doc, yPos, expGermanT.householdServices || 'Haushaltsnahe Dienstleistungen', expT.householdServices || 'Household Services', formatCurrencyPdf(expenses.householdServices));
      addField(doc, yPos, expGermanT.miniJobCosts || 'Minijob Kosten', expT.miniJobCosts || 'Mini-Job Costs', formatCurrencyPdf(expenses.miniJobCosts));
  } else {
      doc.text('Keine Daten erfasst / No data entered', 20, yPos.current);
      yPos.current += 10;
  }

  // ---- Foreign Income ----
  const incomeInfo = formData.incomeInfo || {};
  const fiGermanT = germanT_form.foreignIncome || {}; // Path for foreign income labels
  const fiT = t.foreignIncome || {};
  const incomeInfoGermanT = germanT_form.incomeInfo || {}; // Path for hasForeignIncome question label
  const incomeInfoT = t.incomeInfo || {};

  addSectionTitle(doc, yPos, fiGermanT.title || 'Ausländische Einkünfte', fiT.title || 'Foreign Income');
  addField(doc, yPos, incomeInfoGermanT.hasForeignIncome || 'Einkünfte erhalten?', incomeInfoT.hasForeignIncome || 'Received income?', formatBooleanPdf(incomeInfo.hasForeignIncome, germanI18nData, i18nData));
  if (incomeInfo.hasForeignIncome) {
    addField(doc, yPos, fiGermanT.countryQuestion || 'Herkunftsland', fiT.countryQuestion || 'Country of Origin', incomeInfo.foreignIncomeCountry, 10);
    addField(doc, yPos, fiGermanT.incomeTypeQuestion || 'Art der Einkünfte', fiT.incomeTypeQuestion || 'Type of Income', incomeInfo.foreignIncomeType, 10);
    addField(doc, yPos, fiGermanT.totalAmountQuestion || 'Betrag (EUR)', fiT.totalAmountQuestion || 'Amount (EUR)', formatCurrencyPdf(incomeInfo.foreignIncomeAmount), 10);
    addField(doc, yPos, fiGermanT.taxPaidQuestion || 'Gezahlte ausl. Steuer (EUR)', fiT.taxPaidQuestion || 'Foreign Tax Paid (EUR)', formatCurrencyPdf(incomeInfo.foreignIncomeTaxPaid), 10);
  }

  // ---- Signature ----
  const signatureData = formData.signature || {};
  const sigGermanT = germanT_form.signature || {};
  const sigT = t.signature || {};
  const termsGermanT = germanT_form.terms || {};
  const termsT = t.terms || {};

  addSectionTitle(doc, yPos, sigGermanT.title || 'Unterschrift & Bedingungen', sigT.title || 'Signature & Terms');
  addField(doc, yPos, sigGermanT.place || 'Ort', sigT.place || 'Place', signatureData.place);
  addField(doc, yPos, sigGermanT.date || 'Datum', sigT.date || 'Date', signatureData.date);
  
  // Add Signature Image if available
  if (signatureData.signature) {
      try {
          // Check if yPos needs adjustment before adding image
          if (yPos.current + 40 > doc.internal.pageSize.height - 20) { // Estimate image height
              doc.addPage();
              yPos.current = 20;
          }
          doc.setFont('helvetica', 'bold');
          doc.text(sigGermanT.signature || 'Digitale Unterschrift', 20, yPos.current);
          doc.setFont('helvetica', 'normal');
          doc.text(sigT.signature || 'Digital Signature', 20, yPos.current + 4);
          // Add the signature image (assuming it's a data URL)
          doc.addImage(signatureData.signature, 'PNG', 150, yPos.current - 5, 40, 15); // Adjust x, y, width, height as needed
          yPos.current += 20; // Adjust spacing after image
      } catch (e) {
          console.error("Error adding signature image:", e);
          // Optionally add text indicating error adding image
          doc.text('Error adding signature image', 150, yPos.current);
          yPos.current += 10;
      }
  }
  
  addField(doc, yPos, termsGermanT.accept || 'Bedingungen akzeptiert?', termsT.accept || 'Terms Accepted?', formatBooleanPdf(signatureData.acceptTerms, germanI18nData, i18nData));
  addField(doc, yPos, termsGermanT.dataProtection || 'Datenschutz akzeptiert?', termsT.dataProtection || 'Data Protection Accepted?', formatBooleanPdf(signatureData.acceptDataProtection, germanI18nData, i18nData));

  // ---- Save the PDF ----
  doc.save('tax-form-summary.pdf');
}; 