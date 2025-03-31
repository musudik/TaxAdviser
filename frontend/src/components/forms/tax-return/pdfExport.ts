// Add expenses information
doc.addPage();
doc.setFontSize(16);
doc.setFont('helvetica', 'bold');
doc.text(`${languageData.de.expenses.title} / ${languageData.en.expenses.title}`, 20, 20);

doc.setFontSize(12);
doc.setFont('helvetica', 'normal');
let expensesY = 40;

// Work-related expenses breakdown
const workRelatedExpenses = [
  { key: 'commutingExpenses', label: 'Commuting expenses' },
  { key: 'businessTripsCosts', label: 'Business trips and training' },
  { key: 'workEquipment', label: 'Work equipment' },
  { key: 'homeOfficeAllowance', label: 'Home office allowance' },
  { key: 'membershipFees', label: 'Membership fees & insurance' },
  { key: 'applicationCosts', label: 'Application costs' },
  { key: 'doubleHouseholdCosts', label: 'Double household management' }
];

workRelatedExpenses.forEach(expense => {
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.deductions[expense.key]} / ${languageData.en.deductions[expense.key]}:`, 20, expensesY);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.deductions[expense.key]} €`, 200, expensesY);
  expensesY += 15;
});

// Special expenses
doc.setFont('helvetica', 'bold');
doc.text(`${languageData.de.expenses.specialExpenses} / ${languageData.en.expenses.specialExpenses}:`, 20, expensesY);
doc.setFont('helvetica', 'normal');
doc.text(`${formData.expenses.specialExpenses} €`, 200, expensesY);
expensesY += 15;

// Extraordinary expenses
doc.setFont('helvetica', 'bold');
doc.text(`${languageData.de.expenses.extraordinaryExpenses} / ${languageData.en.expenses.extraordinaryExpenses}:`, 20, expensesY);
doc.setFont('helvetica', 'normal');
doc.text(`${formData.expenses.extraordinaryExpenses} €`, 200, expensesY);
expensesY += 15;

// Insurance premiums
doc.setFont('helvetica', 'bold');
doc.text(`${languageData.de.expenses.insurancePremiums} / ${languageData.en.expenses.insurancePremiums}:`, 20, expensesY);
doc.setFont('helvetica', 'normal');
doc.text(`${formData.expenses.insurancePremiums} €`, 200, expensesY);
expensesY += 15;

// Maintenance payments
if (formData.expenses.hasMaintenancePayments) {
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.expenses.hasMaintenancePayments} / ${languageData.en.expenses.hasMaintenancePayments}:`, 20, expensesY);
  doc.setFont('helvetica', 'normal');
  doc.text('Ja / Yes', 200, expensesY);
  expensesY += 15;
  
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.expenses.maintenanceRecipient} / ${languageData.en.expenses.maintenanceRecipient}:`, 20, expensesY);
  doc.setFont('helvetica', 'normal');
  doc.text(formData.expenses.maintenanceRecipient || '', 200, expensesY);
  expensesY += 15;
  
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.expenses.maintenanceAmount} / ${languageData.en.expenses.maintenanceAmount}:`, 20, expensesY);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.expenses.maintenanceAmount} €`, 200, expensesY);
  expensesY += 15;
  
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.expenses.recipientsAbroad} / ${languageData.en.expenses.recipientsAbroad}:`, 20, expensesY);
  doc.setFont('helvetica', 'normal');
  doc.text(formData.expenses.recipientsAbroad ? 'Ja / Yes' : 'Nein / No', 200, expensesY);
  expensesY += 15;
}

// Special expenses detailed
if (formData.expenses.hasSpecialExpensesDetailed) {
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.expenses.hasSpecialExpensesDetailed} / ${languageData.en.expenses.hasSpecialExpensesDetailed}:`, 20, expensesY);
  doc.setFont('helvetica', 'normal');
  doc.text('Ja / Yes', 200, expensesY);
  expensesY += 15;
  
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.expenses.specialExpensesType} / ${languageData.en.expenses.specialExpensesType}:`, 20, expensesY);
  doc.setFont('helvetica', 'normal');
  doc.text(formData.expenses.specialExpensesType || '', 200, expensesY);
  expensesY += 15;
  
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.expenses.specialExpensesAmount} / ${languageData.en.expenses.specialExpensesAmount}:`, 20, expensesY);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.expenses.specialExpensesAmount} €`, 200, expensesY);
  expensesY += 15;
}

// Private insurance
if (formData.expenses.hasPrivateInsurance) {
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.expenses.hasPrivateInsurance} / ${languageData.en.expenses.hasPrivateInsurance}:`, 20, expensesY);
  doc.setFont('helvetica', 'normal');
  doc.text('Ja / Yes', 200, expensesY);
  expensesY += 15;
  
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.expenses.insuranceTypes} / ${languageData.en.expenses.insuranceTypes}:`, 20, expensesY);
  doc.setFont('helvetica', 'normal');
  doc.text(formData.expenses.insuranceTypes || '', 200, expensesY);
  expensesY += 15;
  
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.expenses.insuranceContributions} / ${languageData.en.expenses.insuranceContributions}:`, 20, expensesY);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.expenses.insuranceContributions} €`, 200, expensesY);
  expensesY += 15;
}

// Inside the expenses section
const specialExpenses = [
  { key: 'churchTax', label: 'Church Tax' },
  { key: 'donationsAndFees', label: 'Donations and Membership Fees' },
  { key: 'childcareCosts', label: 'Childcare Costs' },
  { key: 'supportPayments', label: 'Support Payments' },
  { key: 'privateSchoolFees', label: 'Private School Fees' },
  { key: 'retirementProvisions', label: 'Retirement Provisions' },
  { key: 'otherInsuranceExpenses', label: 'Other Insurance Expenses' },
  { key: 'professionalTrainingCosts', label: 'Professional Training Costs' }
];

specialExpenses.forEach(expense => {
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.deductions[expense.key]} / ${languageData.en.deductions[expense.key]}:`, 20, expensesY);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.deductions[expense.key]} €`, 200, expensesY);
  expensesY += 15;
});

// Extraordinary expenses
const extraordinaryExpenses = [
  { key: 'medicalExpenses', label: 'Medical Expenses' },
  { key: 'rehabilitationCosts', label: 'Rehabilitation Costs' },
  { key: 'careCosts', label: 'Care Costs' },
  { key: 'disabilityExpenses', label: 'Disability Expenses' },
  { key: 'funeralCosts', label: 'Funeral Costs' },
  { key: 'relativesSupportCosts', label: 'Support for Relatives' },
  { key: 'divorceCosts', label: 'Divorce Costs' }
];

extraordinaryExpenses.forEach(expense => {
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.deductions[expense.key]} / ${languageData.en.deductions[expense.key]}:`, 20, expensesY);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.deductions[expense.key]} €`, 200, expensesY);
  expensesY += 15;
});

const insurancePremiums = [
  { key: 'statutoryHealthInsurance', label: 'Statutory Health Insurance' },
  { key: 'privateHealthInsurance', label: 'Private Health Insurance' },
  { key: 'statutoryPensionInsurance', label: 'Statutory Pension Insurance' },
  { key: 'privatePensionInsurance', label: 'Private Pension Insurance' },
  { key: 'unemploymentInsurance', label: 'Unemployment Insurance' },
  { key: 'accidentLiabilityInsurance', label: 'Accident and Liability Insurance' },
  { key: 'disabilityInsurance', label: 'Disability Insurance' },
  { key: 'termLifeInsurance', label: 'Term Life Insurance' }
];

insurancePremiums.forEach(insurance => {
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.deductions[insurance.key]} / ${languageData.en.deductions[insurance.key]}:`, 20, expensesY);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.deductions[insurance.key]} €`, 200, expensesY);
  expensesY += 15;
});

const householdServices = [
  { key: 'householdServices', label: 'Household Services' },
  { key: 'craftsmenServices', label: 'Craftsmen Services' },
  { key: 'gardeningServices', label: 'Gardening Services' },
  { key: 'cleaningServices', label: 'Cleaning Services' },
  { key: 'caretakerServices', label: 'Caretaker Services' },
  { key: 'householdCareCosts', label: 'Care Costs' },
  { key: 'householdSupportServices', label: 'Support Services' },
  { key: 'chimneySweepFees', label: 'Chimney Sweep Fees' },
  { key: 'emergencySystemCosts', label: 'Emergency Systems' }
];

householdServices.forEach(service => {
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.deductions[service.key]} / ${languageData.en.deductions[service.key]}:`, 20, expensesY);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.deductions[service.key]} €`, 200, expensesY);
  expensesY += 15;
});

// Add Business Income section
doc.addPage();
doc.setFontSize(16);
doc.setFont('helvetica', 'bold');
doc.text(`${languageData.de.incomeInfo.businessTitle} / ${languageData.en.incomeInfo.businessTitle}`, 20, 20);

doc.setFontSize(12);
doc.setFont('helvetica', 'normal');
let businessY = 40;

// Business owner status
doc.setFont('helvetica', 'bold');
doc.text(`${languageData.de.incomeInfo.isBusinessOwner} / ${languageData.en.incomeInfo.isBusinessOwner}:`, 20, businessY);
doc.setFont('helvetica', 'normal');
doc.text(formData.incomeInfo.isBusinessOwner ? 'Ja / Yes' : 'Nein / No', 200, businessY);
businessY += 15;

// If business owner, add business details
if (formData.incomeInfo.isBusinessOwner) {
  // Business type
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.incomeInfo.businessType} / ${languageData.en.incomeInfo.businessType}:`, 20, businessY);
  doc.setFont('helvetica', 'normal');
  doc.text(formData.incomeInfo.businessType || '-', 200, businessY);
  businessY += 15;
  
  // Business earnings
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.incomeInfo.businessEarnings} / ${languageData.en.incomeInfo.businessEarnings}:`, 20, businessY);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.incomeInfo.businessEarnings || '0'} €`, 200, businessY);
  businessY += 15;
  
  // Business expenses
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.incomeInfo.businessExpenses} / ${languageData.en.incomeInfo.businessExpenses}:`, 20, businessY);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.incomeInfo.businessExpenses || '0'} €`, 200, businessY);
  businessY += 15;
}

// Add Investment Income section
doc.addPage();
doc.setFontSize(16);
doc.setFont('helvetica', 'bold');
doc.text(`${languageData.de.incomeInfo.investmentsTitle} / ${languageData.en.incomeInfo.investmentsTitle}`, 20, 20);

doc.setFontSize(12);
doc.setFont('helvetica', 'normal');
let investmentY = 40;

// Has stock income
doc.setFont('helvetica', 'bold');
doc.text(`${languageData.de.incomeInfo.hasStockIncome} / ${languageData.en.incomeInfo.hasStockIncome}:`, 20, investmentY);
doc.setFont('helvetica', 'normal');
doc.text(formData.incomeInfo.hasStockIncome ? 'Ja / Yes' : 'Nein / No', 200, investmentY);
investmentY += 15;

// If has stock income, add investment details
if (formData.incomeInfo.hasStockIncome) {
  // Dividend earnings
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.incomeInfo.dividendEarnings} / ${languageData.en.incomeInfo.dividendEarnings}:`, 20, investmentY);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.incomeInfo.dividendEarnings || '0'} €`, 200, investmentY);
  investmentY += 15;
  
  // Has bank certificate
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.incomeInfo.hasBankCertificate} / ${languageData.en.incomeInfo.hasBankCertificate}:`, 20, investmentY);
  doc.setFont('helvetica', 'normal');
  doc.text(formData.incomeInfo.hasBankCertificate ? 'Ja / Yes' : 'Nein / No', 200, investmentY);
  investmentY += 15;
  
  // Has stock sales
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.incomeInfo.hasStockSales} / ${languageData.en.incomeInfo.hasStockSales}:`, 20, investmentY);
  doc.setFont('helvetica', 'normal');
  doc.text(formData.incomeInfo.hasStockSales ? 'Ja / Yes' : 'Nein / No', 200, investmentY);
  investmentY += 15;
  
  // If has stock sales, add stock profit/loss
  if (formData.incomeInfo.hasStockSales) {
    doc.setFont('helvetica', 'bold');
    doc.text(`${languageData.de.incomeInfo.stockProfitLoss} / ${languageData.en.incomeInfo.stockProfitLoss}:`, 20, investmentY);
    doc.setFont('helvetica', 'normal');
    doc.text(`${formData.incomeInfo.stockProfitLoss || '0'} €`, 200, investmentY);
    investmentY += 15;
  }
  
  // Has foreign stocks
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.incomeInfo.hasForeignStocks} / ${languageData.en.incomeInfo.hasForeignStocks}:`, 20, investmentY);
  doc.setFont('helvetica', 'normal');
  doc.text(formData.incomeInfo.hasForeignStocks ? 'Ja / Yes' : 'Nein / No', 200, investmentY);
  investmentY += 15;
  
  // If has foreign stocks, add foreign tax details
  if (formData.incomeInfo.hasForeignStocks) {
    doc.setFont('helvetica', 'bold');
    doc.text(`${languageData.de.incomeInfo.foreignTaxPaid} / ${languageData.en.incomeInfo.foreignTaxPaid}:`, 20, investmentY);
    doc.setFont('helvetica', 'normal');
    doc.text(`${formData.incomeInfo.foreignTaxPaid || '0'} €`, 200, investmentY);
    investmentY += 15;
  }
}

// Add Rental Income section
doc.addPage();
doc.setFontSize(16);
doc.setFont('helvetica', 'bold');
doc.text(`${languageData.de.incomeInfo.rentalTitle} / ${languageData.en.incomeInfo.rentalTitle}`, 20, 20);

doc.setFontSize(12);
doc.setFont('helvetica', 'normal');
let rentalY = 40;

// Has rental property
doc.setFont('helvetica', 'bold');
doc.text(`${languageData.de.incomeInfo.hasRentalProperty} / ${languageData.en.incomeInfo.hasRentalProperty}:`, 20, rentalY);
doc.setFont('helvetica', 'normal');
doc.text(formData.incomeInfo.hasRentalProperty ? 'Ja / Yes' : 'Nein / No', 200, rentalY);
rentalY += 15;

// If has rental property, add rental details
if (formData.incomeInfo.hasRentalProperty) {
  // Rental income
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.incomeInfo.rentalIncome} / ${languageData.en.incomeInfo.rentalIncome}:`, 20, rentalY);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.incomeInfo.rentalIncome || '0'} €`, 200, rentalY);
  rentalY += 15;
  
  // Rental costs
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.incomeInfo.rentalCosts} / ${languageData.en.incomeInfo.rentalCosts}:`, 20, rentalY);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.incomeInfo.rentalCosts || '0'} €`, 200, rentalY);
  rentalY += 15;
  
  // Rental property address
  doc.setFont('helvetica', 'bold');
  doc.text(`Adresse der Immobilie / Rental Property Address:`, 20, rentalY);
  rentalY += 15;
  
  doc.setFont('helvetica', 'normal');
  const rentalAddress = `${formData.incomeInfo.rentalPropertyAddress.street} ${formData.incomeInfo.rentalPropertyAddress.houseNumber}, ${formData.incomeInfo.rentalPropertyAddress.postalCode} ${formData.incomeInfo.rentalPropertyAddress.city}`;
  doc.text(rentalAddress, 40, rentalY);
  rentalY += 15;
}

// Add Foreign Income section
doc.addPage();
doc.setFontSize(16);
doc.setFont('helvetica', 'bold');
doc.text(`${languageData.de.incomeInfo.foreignTitle} / ${languageData.en.incomeInfo.foreignTitle}`, 20, 20);

doc.setFontSize(12);
doc.setFont('helvetica', 'normal');
let foreignY = 40;

// Has foreign income
doc.setFont('helvetica', 'bold');
doc.text(`${languageData.de.incomeInfo.hasForeignIncome} / ${languageData.en.incomeInfo.hasForeignIncome}:`, 20, foreignY);
doc.setFont('helvetica', 'normal');
doc.text(formData.incomeInfo.hasForeignIncome ? 'Ja / Yes' : 'Nein / No', 200, foreignY);
foreignY += 15;

// If has foreign income, add foreign income details
if (formData.incomeInfo.hasForeignIncome) {
  // Foreign income country
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.incomeInfo.foreignIncomeCountry} / ${languageData.en.incomeInfo.foreignIncomeCountry}:`, 20, foreignY);
  doc.setFont('helvetica', 'normal');
  doc.text(formData.incomeInfo.foreignIncomeCountry || '-', 200, foreignY);
  foreignY += 15;
  
  // Foreign income type
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.incomeInfo.foreignIncomeType} / ${languageData.en.incomeInfo.foreignIncomeType}:`, 20, foreignY);
  doc.setFont('helvetica', 'normal');
  doc.text(formData.incomeInfo.foreignIncomeType || '-', 200, foreignY);
  foreignY += 15;
  
  // Foreign income amount
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.incomeInfo.foreignIncomeAmount} / ${languageData.en.incomeInfo.foreignIncomeAmount}:`, 20, foreignY);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.incomeInfo.foreignIncomeAmount || '0'} €`, 200, foreignY);
  foreignY += 15;
  
  // Foreign income tax paid
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.incomeInfo.foreignIncomeTaxPaid} / ${languageData.en.incomeInfo.foreignIncomeTaxPaid}:`, 20, foreignY);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.incomeInfo.foreignIncomeTaxPaid || '0'} €`, 200, foreignY);
  foreignY += 15;
}

// Add signature information
doc.addPage();
doc.setFontSize(16);
doc.setFont('helvetica', 'bold');
doc.text(`Unterschrift / Signature`, 20, 20);

doc.setFontSize(12);
doc.setFont('helvetica', 'normal');
let signatureY = 40;

if (formData.signature) {
  // Place
  doc.setFont('helvetica', 'bold');
  doc.text(`Ort / Place:`, 20, signatureY);
  doc.setFont('helvetica', 'normal');
  doc.text(formData.signature.place || '-', 200, signatureY);
  signatureY += 15;
  
  // Date
  doc.setFont('helvetica', 'bold');
  doc.text(`Datum / Date:`, 20, signatureY);
  doc.setFont('helvetica', 'normal');
  doc.text(formData.signature.date || '-', 200, signatureY);
  signatureY += 15;
  
  // Time
  doc.setFont('helvetica', 'bold');
  doc.text(`Zeit / Time:`, 20, signatureY);
  doc.setFont('helvetica', 'normal');
  doc.text(formData.signature.time || '-', 200, signatureY);
  signatureY += 15;
  
  // Signature image if available
  if (formData.signature.signature) {
    signatureY += 15;
    doc.setFont('helvetica', 'bold');
    doc.text(`Unterschrift / Signature:`, 20, signatureY);
    signatureY += 5;
    // If signature is an image URL, add it
    // This would need implementation based on how signatures are stored
  }
} else {
  doc.text('Keine Unterschrift vorhanden / No signature available', 20, signatureY);
}

// Export function to add insurance and special expense details to the PDF
export const addInsuranceAndSpecialExpensesDetails = (doc: any, formData: any, languageData: any) => {
  // Add Special Expenses section with detailed expenses flag
  doc.addPage();
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.expenses.specialExpenses} / ${languageData.en.expenses.specialExpenses}`, 20, 20);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  let specialExpensesY = 40;

  // Has special expenses detailed
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.expenses.hasSpecialExpensesDetailed} / ${languageData.en.expenses.hasSpecialExpensesDetailed}:`, 20, specialExpensesY);
  doc.setFont('helvetica', 'normal');
  doc.text(formData.expenses.hasSpecialExpensesDetailed ? 'Ja / Yes' : 'Nein / No', 200, specialExpensesY);
  specialExpensesY += 15;
  
  // If has special expenses detailed, add the details
  if (formData.expenses.hasSpecialExpensesDetailed) {
    doc.setFont('helvetica', 'bold');
    doc.text(`${languageData.de.expenses.specialExpensesType} / ${languageData.en.expenses.specialExpensesType}:`, 20, specialExpensesY);
    doc.setFont('helvetica', 'normal');
    doc.text(formData.expenses.specialExpensesType || '-', 200, specialExpensesY);
    specialExpensesY += 15;
    
    doc.setFont('helvetica', 'bold');
    doc.text(`${languageData.de.expenses.specialExpensesAmount} / ${languageData.en.expenses.specialExpensesAmount}:`, 20, specialExpensesY);
    doc.setFont('helvetica', 'normal');
    doc.text(`${formData.expenses.specialExpensesAmount || '0'} €`, 200, specialExpensesY);
    specialExpensesY += 15;
  }
  
  // Add common special expenses items
  const specialExpenses = [
    { key: 'churchTax', label: 'Church Tax' },
    { key: 'donationsAndFees', label: 'Donations and Membership Fees' },
    { key: 'childcareCosts', label: 'Childcare Costs' },
    { key: 'supportPayments', label: 'Support Payments' },
    { key: 'privateSchoolFees', label: 'Private School Fees' },
    { key: 'retirementProvisions', label: 'Retirement Provisions' },
    { key: 'otherInsuranceExpenses', label: 'Other Insurance Expenses' },
    { key: 'professionalTrainingCosts', label: 'Professional Training Costs' }
  ];

  specialExpenses.forEach(expense => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${languageData.de.deductions[expense.key]} / ${languageData.en.deductions[expense.key]}:`, 20, specialExpensesY);
    doc.setFont('helvetica', 'normal');
    doc.text(`${formData.deductions[expense.key] || '0'} €`, 200, specialExpensesY);
    specialExpensesY += 15;
  });
  
  // Add Insurance section with private insurance flag
  doc.addPage();
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.expenses.insurancePremiums} / ${languageData.en.expenses.insurancePremiums}`, 20, 20);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  let insuranceY = 40;
  
  // Has private insurance
  doc.setFont('helvetica', 'bold');
  doc.text(`${languageData.de.expenses.hasPrivateInsurance} / ${languageData.en.expenses.hasPrivateInsurance}:`, 20, insuranceY);
  doc.setFont('helvetica', 'normal');
  doc.text(formData.expenses.hasPrivateInsurance ? 'Ja / Yes' : 'Nein / No', 200, insuranceY);
  insuranceY += 15;
  
  // If has private insurance, add the details
  if (formData.expenses.hasPrivateInsurance) {
    doc.setFont('helvetica', 'bold');
    doc.text(`${languageData.de.expenses.insuranceTypes} / ${languageData.en.expenses.insuranceTypes}:`, 20, insuranceY);
    doc.setFont('helvetica', 'normal');
    doc.text(formData.expenses.insuranceTypes || '-', 200, insuranceY);
    insuranceY += 15;
    
    doc.setFont('helvetica', 'bold');
    doc.text(`${languageData.de.expenses.insuranceContributions} / ${languageData.en.expenses.insuranceContributions}:`, 20, insuranceY);
    doc.setFont('helvetica', 'normal');
    doc.text(`${formData.expenses.insuranceContributions || '0'} €`, 200, insuranceY);
    insuranceY += 15;
  }
  
  // Add common insurance premiums
  const insurancePremiums = [
    { key: 'privateHealthInsurance', label: 'Private Health Insurance' },
    { key: 'privatePensionInsurance', label: 'Private Pension Insurance' },
    { key: 'unemploymentInsurance', label: 'Unemployment Insurance' },
    { key: 'accidentLiabilityInsurance', label: 'Accident and Liability Insurance' },
    { key: 'disabilityInsurance', label: 'Disability Insurance' },
    { key: 'termLifeInsurance', label: 'Term Life Insurance' }
  ];

  insurancePremiums.forEach(insurance => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${languageData.de.deductions[insurance.key]} / ${languageData.en.deductions[insurance.key]}:`, 20, insuranceY);
    doc.setFont('helvetica', 'normal');
    doc.text(`${formData.deductions[insurance.key] || '0'} €`, 200, insuranceY);
    insuranceY += 15;
  });
}; 