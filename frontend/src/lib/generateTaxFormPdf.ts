// Add declaration for import.meta.env
declare global {
  interface ImportMetaEnv {
    VITE_FIREBASE_STORAGE_BUCKET: string;
    VITE_FIREBASE_API_KEY: string;
    VITE_FIREBASE_AUTH_DOMAIN: string;
    VITE_FIREBASE_PROJECT_ID: string;
    VITE_FIREBASE_MESSAGING_SENDER_ID: string;
    VITE_FIREBASE_APP_ID: string;
  }
}

// Import Firebase SDK
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { jsPDF } from 'jspdf';

// Define PDF type extending from jsPDF but with explicit method definitions
type PDF = jsPDF;

// Initialize Firebase with the configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Helper to upload files to Firebase Storage
const uploadFilesToFirebase = async (formData: any, fullName: string): Promise<void> => {
  try {
    // Format the date for the folder structure: YYYY-MM-DD
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    
    // Create a sanitized version of the full name for the folder name (remove special chars)
    const sanitizedName = fullName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    
    // Base path for uploads
    const basePath = `Tax-form/${dateString}/${sanitizedName}/files`;
    
    // Collect all files from the form data
    const files: Array<{ path: string, file: File }> = [];
    
    // Extract files from personalInfo section
    if (formData.personalInfo) {
      // Potentially add personal documents like ID scans, etc.
    }
    
    // Extract files from incomeInfo section
    if (formData.incomeInfo) {
      const income = formData.incomeInfo;
      
      // Tax certificate
      if (income.employment?.taxCertificate?.length > 0) {
        income.employment.taxCertificate.forEach((file: any, index: number) => {
          if (file && file.name) {
            files.push({
              path: `${basePath}/income/employment/tax-certificate-${index + 1}`,
              file
            });
          }
        });
      }
      
      // Bank certificate
      if (income.investments?.bankCertificate?.length > 0) {
        income.investments.bankCertificate.forEach((file: any, index: number) => {
          if (file && file.name) {
            files.push({
              path: `${basePath}/income/investments/bank-certificate-${index + 1}`,
              file
            });
          }
        });
      }
      
      // Foreign income tax certificate
      if (income.foreignIncomeTaxCertificateFile?.length > 0) {
        income.foreignIncomeTaxCertificateFile.forEach((file: any, index: number) => {
          if (file && file.name) {
            files.push({
              path: `${basePath}/income/foreign/tax-certificate-${index + 1}`,
              file
            });
          }
        });
      }
    }
    
    // Extract files from expenses section
    if (formData.expenses) {
      const expenses = formData.expenses;
      
      // Work-related expenses files
      const workRelatedExpenses = expenses.workRelatedExpenses || formData.workRelatedExpenses;
      if (workRelatedExpenses) {
        // Business trip proofs
        if (workRelatedExpenses.businessTripsCosts?.proof?.length > 0) {
          workRelatedExpenses.businessTripsCosts.proof.forEach((file: any, index: number) => {
            if (file && file.name) {
              files.push({
                path: `${basePath}/expenses/work-related/business-trips-${index + 1}`,
                file
              });
            }
          });
        }
        
        // Work equipment files
        if (workRelatedExpenses.workEquipment?.expenses) {
          workRelatedExpenses.workEquipment.expenses.forEach((expense: any, expIndex: number) => {
            if (expense.file && expense.file.length > 0) {
              expense.file.forEach((file: any, fileIndex: number) => {
                if (file && file.name) {
                  files.push({
                    path: `${basePath}/expenses/work-related/equipment-${expIndex + 1}-${fileIndex + 1}`,
                    file
                  });
                }
              });
            }
          });
        }
      }
      
      // Special expenses files
      if (expenses.specialExpenses) {
        const specialExpenses = expenses.specialExpenses;
        
        // Insurance expenses
        if (specialExpenses.insurance?.expenses) {
          specialExpenses.insurance.expenses.forEach((expense: any, expIndex: number) => {
            if (expense.file && expense.file.length > 0) {
              expense.file.forEach((file: any, fileIndex: number) => {
                if (file && file.name) {
                  files.push({
                    path: `${basePath}/expenses/special/insurance-${expIndex + 1}-${fileIndex + 1}`,
                    file
                  });
                }
              });
            }
          });
        }
        
        // Donation expenses
        if (specialExpenses.donations?.expenses) {
          specialExpenses.donations.expenses.forEach((expense: any, expIndex: number) => {
            if (expense.file && expense.file.length > 0) {
              expense.file.forEach((file: any, fileIndex: number) => {
                if (file && file.name) {
                  files.push({
                    path: `${basePath}/expenses/special/donations-${expIndex + 1}-${fileIndex + 1}`,
                    file
                  });
                }
              });
            }
          });
        }
        
        // Professional development expenses
        if (specialExpenses.professionalDevelopment?.expenses) {
          specialExpenses.professionalDevelopment.expenses.forEach((expense: any, expIndex: number) => {
            if (expense.file && expense.file.length > 0) {
              expense.file.forEach((file: any, fileIndex: number) => {
                if (file && file.name) {
                  files.push({
                    path: `${basePath}/expenses/special/professional-dev-${expIndex + 1}-${fileIndex + 1}`,
                    file
                  });
                }
              });
            }
          });
        }
      }
      
      // Extraordinary burdens files
      if (expenses.extraordinaryBurdens) {
        const extraBurdens = expenses.extraordinaryBurdens;
        
        // Medical expenses
        if (extraBurdens.medicalExpenses?.expenses) {
          extraBurdens.medicalExpenses.expenses.forEach((expense: any, expIndex: number) => {
            if (expense.file && expense.file.length > 0) {
              expense.file.forEach((file: any, fileIndex: number) => {
                if (file && file.name) {
                  files.push({
                    path: `${basePath}/expenses/extraordinary/medical-${expIndex + 1}-${fileIndex + 1}`,
                    file
                  });
                }
              });
            }
          });
        }
        
        // Care costs
        if (extraBurdens.careCosts?.expenses) {
          extraBurdens.careCosts.expenses.forEach((expense: any, expIndex: number) => {
            if (expense.file && expense.file.length > 0) {
              expense.file.forEach((file: any, fileIndex: number) => {
                if (file && file.name) {
                  files.push({
                    path: `${basePath}/expenses/extraordinary/care-${expIndex + 1}-${fileIndex + 1}`,
                    file
                  });
                }
              });
            }
          });
        }
        
        // Disability expenses
        if (extraBurdens.disabilityExpenses?.expenses) {
          extraBurdens.disabilityExpenses.expenses.forEach((expense: any, expIndex: number) => {
            if (expense.file && expense.file.length > 0) {
              expense.file.forEach((file: any, fileIndex: number) => {
                if (file && file.name) {
                  files.push({
                    path: `${basePath}/expenses/extraordinary/disability-${expIndex + 1}-${fileIndex + 1}`,
                    file
                  });
                }
              });
            }
          });
        }
      }
      
      // Craftsmen services files
      if (expenses.craftsmenServices?.invoiceCraftsmenServices?.length > 0) {
        expenses.craftsmenServices.invoiceCraftsmenServices.forEach((file: any, index: number) => {
          if (file && file.name) {
            files.push({
              path: `${basePath}/expenses/craftsmen/invoice-${index + 1}`,
              file
            });
          }
        });
      }
    }
    
    // Upload PDF itself
    // Note: This will be handled separately after PDF generation
    
    // Upload all collected files
    console.log(`Uploading ${files.length} files to Firebase Storage...`);
    
    // Upload files in parallel with max concurrency of 5
    const uploadBatch = async (batch: typeof files) => {
      const promises = batch.map(async ({path, file}) => {
        try {
          // Create a reference to the file location
          const fileRef = ref(storage, path);
          
          // Upload the file
          await uploadBytes(fileRef, file);
          console.log(`File uploaded successfully: ${path}`);
          
          try {
            // Get the download URL for future reference
            // Note: This might fail for unauthorized users according to the security rules
            const downloadURL = await getDownloadURL(fileRef);
            console.log(`Download URL: ${downloadURL}`);
            return { path, url: downloadURL, status: 'success' };
          } catch (downloadError) {
            // The file was uploaded but we can't get the download URL due to permission restrictions
            console.log(`File uploaded successfully, but download URL cannot be retrieved due to permission restrictions: ${path}`);
            return { path, url: null, status: 'upload-only' };
          }
        } catch (error) {
          console.error(`Error uploading file ${path}:`, error);
          return { path, url: null, status: 'failed' };
        }
      });
      
      return Promise.all(promises);
    };
    
    // Process files in batches of 5
    const batchSize = 5;
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      await uploadBatch(batch);
    }
    
    console.log('All files uploaded successfully');
    
  } catch (error) {
    console.error('Error uploading files to Firebase:', error);
    throw new Error('Failed to upload files to Firebase Storage');
  }
};

// Upload the generated PDF to Firebase Storage
const uploadPdfToFirebase = async (pdfBlob: Blob, fullName: string): Promise<string | null> => {
  try {
    // Format the date for the folder structure: YYYY-MM-DD
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    
    // Create a sanitized version of the full name for the folder name
    const sanitizedName = fullName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    
    // Path for the PDF
    const pdfPath = `Tax-form/${dateString}/${sanitizedName}/tax-form-summary.pdf`;
    
    // Create a reference to the PDF location
    const pdfRef = ref(storage, pdfPath);
    
    // Upload the PDF
    await uploadBytes(pdfRef, pdfBlob);
    console.log(`PDF uploaded successfully: ${pdfPath}`);
    
    try {
      // Get the download URL
      const downloadURL = await getDownloadURL(pdfRef);
      console.log(`PDF Download URL: ${downloadURL}`);
      return downloadURL;
    } catch (downloadError) {
      console.log(`PDF uploaded successfully, but download URL cannot be retrieved due to permission restrictions: ${pdfPath}`);
      return null;
    }
  } catch (error) {
    console.error('Error uploading PDF to Firebase:', error);
    throw new Error('Failed to upload PDF to Firebase Storage');
  }
};

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

// Helper to draw a field block (3 lines: DE label, Sel label, Value) vertically
// Returns the total height used by the block.
const addField = (doc: PDF, baseXPos: number, yPos: number, indent: number, germanLabel: string, selectedLabel: string, value: string, columnWidth: number): number => {
  const finalXPos = baseXPos + indent;
  const actualWidth = columnWidth - indent;
  const labelLineHeight = 5; // Line height for labels
  const valueLineHeight = 6; // Line height for value
  let currentY = yPos;

  // German Label (Bold)
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  const splitGermanLabel = doc.splitTextToSize(germanLabel || 'Label (DE)', actualWidth);
  doc.text(splitGermanLabel, finalXPos, currentY);
  currentY += splitGermanLabel.length * labelLineHeight;

  // Selected Language Label (Smaller, lighter)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100);
  const splitSelectedLabel = doc.splitTextToSize(selectedLabel || 'Label', actualWidth);
  doc.text(splitSelectedLabel, finalXPos, currentY);
  currentY += splitSelectedLabel.length * labelLineHeight;
  doc.setTextColor(0); // Reset color

  // Value (Normal)
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const splitValue = doc.splitTextToSize(value || '-', actualWidth);
  doc.text(splitValue, finalXPos, currentY);
  currentY += splitValue.length * valueLineHeight;
  
  // Add a little padding below the value
  currentY += 3; // Increased padding slightly

  // Return the total height consumed by this block
  return currentY - yPos;
};

// Helper to add a section title - Resets columns
const addSectionTitle = (doc: PDF, yPositions: { col1: number, col2: number }, columnState: { nextCol: number }, pageHeight: number, bottomMargin: number, germanTitle: string, selectedTitle: string, forceNewPage: boolean = true) => {
  const lineHeight = 10;
  const titleY = Math.max(yPositions.col1, yPositions.col2) + lineHeight; // Position below the highest column content + spacing

  // Always start a new page for section titles if forceNewPage is true
  if (forceNewPage || titleY + lineHeight > pageHeight - bottomMargin) {
    doc.addPage();
    yPositions.col1 = 20;
    yPositions.col2 = 20;
    
    // Add page number at the bottom of each new page
    addPageNumber(doc);
  } else {
    yPositions.col1 = titleY; // Align both columns before drawing title
    yPositions.col2 = titleY;
  }

  // Draw title on two lines with different colors
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0); // Main language in black
  doc.text(germanTitle, 20, yPositions.col1);
  
  // Selected language in lighter gray below
  doc.setFontSize(12);
  doc.setTextColor(120, 120, 120); // Lighter gray color
  doc.text(selectedTitle, 20, yPositions.col1 + 8);
  doc.setTextColor(0); // Reset to black
  
  const newY = yPositions.col1 + lineHeight + (lineHeight); // Position for next content with additional space
  yPositions.col1 = newY;
  yPositions.col2 = newY;
  columnState.nextCol = 1; // Reset to start in column 1 after a title
};

// Helper to add a sub-section title - Resets columns and applies indent for drawing
const addSubHeading = (doc: PDF, yPositions: { col1: number, col2: number }, columnState: { nextCol: number }, pageHeight: number, bottomMargin: number, indent: number, germanTitle: string, selectedTitle: string) => {
  const lineHeight = 8;
  const titleY = Math.max(yPositions.col1, yPositions.col2) + lineHeight / 2; // Position below the highest column content + spacing

  if (titleY + lineHeight > pageHeight - bottomMargin) {
    doc.addPage();
    yPositions.col1 = 20;
    yPositions.col2 = 20;
    
    // Add page number at the bottom of each new page
    addPageNumber(doc);
  } else {
      yPositions.col1 = titleY; // Align both columns
      yPositions.col2 = titleY;
  }

  // Draw sub-heading on two lines with different colors
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80); // Darker gray for main language
  doc.text(germanTitle, 20 + indent, yPositions.col1);
  
  // Selected language in lighter gray below
  doc.setFontSize(10);
  doc.setTextColor(140, 140, 140); // Lighter gray
  doc.text(selectedTitle, 20 + indent, yPositions.col1 + 6);
  doc.setTextColor(0); // Reset to black
  
  const newY = yPositions.col1 + lineHeight + (lineHeight);
  yPositions.col1 = newY;
  yPositions.col2 = newY;
  columnState.nextCol = 1; // Reset to start in column 1
};

// Helper to add page number
const addPageNumber = (doc: PDF) => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100); // Gray color for page numbers
  doc.text(`${doc.getNumberOfPages()}`, pageWidth/2, pageHeight - 10, { align: 'center' });
  doc.setTextColor(0); // Reset to black
};

export const generateTaxFormPdf = async (formData: any, germanI18nData: any, i18nData: any) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });
  
  // --- Layout Constants ---
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  const topMargin = 20;
  const bottomMargin = 20;
  const col1X = 20;
  const col2X = 115; // Start X for the second column
  const columnWidth = 90; // Width available for content within each column
  const indentStep = 10; // Indentation amount for subsections

  // --- State Management ---
  const yPositions = { col1: topMargin, col2: topMargin };
  const columnState = { nextCol: 1 }; // 1 for left, 2 for right
  let currentIndent = 0;

  // --- Helper to draw field in the correct column ---
  const drawFieldInNextColumn = (germanLabel: string, selectedLabel: string, value: string) => {
    const targetCol = columnState.nextCol;
    const targetX = (targetCol === 1) ? col1X : col2X;
    let targetY = (targetCol === 1) ? yPositions.col1 : yPositions.col2;

    // Estimate height (simplified - real height depends on wrapping)
    // A more accurate way involves pre-calculating using splitTextToSize if needed
    const estimatedHeight = 25; // Adjust this based on typical field height

    // Check for page break in the target column
    if (targetY + estimatedHeight > pageHeight - bottomMargin) {
        // If the *other* column is shorter, maybe just switch columns? (More complex logic)
        // For simplicity now, always add page if the *target* column is full.
        doc.addPage();
        yPositions.col1 = topMargin;
        yPositions.col2 = topMargin;
        columnState.nextCol = 1; // Start new page in column 1
        targetY = topMargin; // Reset targetY for the new page
        
        // Add page number on new page
        addPageNumber(doc);
    }

    // Draw the field and get its actual height
    const fieldHeight = addField(doc, targetX, targetY, currentIndent, germanLabel, selectedLabel, value, columnWidth);

    // Update the Y position for the column used
    if (targetCol === 1) {
      yPositions.col1 = targetY + fieldHeight;
    } else {
      yPositions.col2 = targetY + fieldHeight;
    }

    // Toggle to the other column for the next field
    columnState.nextCol = (targetCol === 1) ? 2 : 1;
  };

  // --- Get Translation Data ---
  const germanT_form = germanI18nData?.taxForm || {};
  const t = i18nData?.taxForm || {};
  
  // Get the current date formatted as MM/DD/YYYY
  const today = new Date();
  const formattedDate = `${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}/${today.getFullYear()}`;
  
  // Get user's full name or use placeholder if not available
  const personalInfo = formData.personalInfo || {};
  const signatureData = formData.signature || {};
  const fullName = signatureData.fullName || 
                  (personalInfo.firstName && personalInfo.lastName ? 
                   `${personalInfo.firstName} ${personalInfo.lastName}` : 
                   'Tax Form User');

  // ---- Cover Page ----
  // Main Title in German - Large, Bold, Centered
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  const germanTitle = germanI18nData?.formTitle || 'Deutsche Steuererklärung';
  const germanTitleWidth = doc.getStringUnitWidth(germanTitle) * 28 / doc.internal.scaleFactor;
  doc.text(germanTitle, (pageWidth - germanTitleWidth) / 2, pageHeight / 3);
  
  // Subtitle in Selected Language - Medium, Centered
  doc.setFontSize(24);
  doc.setTextColor(100); // Gray color for secondary language
  const selectedTitle = i18nData?.formTitle || 'German Tax Return';
  const selectedTitleWidth = doc.getStringUnitWidth(selectedTitle) * 24 / doc.internal.scaleFactor;
  doc.text(selectedTitle, (pageWidth - selectedTitleWidth) / 2, pageHeight / 3 + 15);
  doc.setTextColor(0); // Reset to black
  
  // Tax year (optional)
  const taxYear = new Date().getFullYear() - 1; // Typically for previous year
  doc.setFontSize(16);
  const taxYearText = `${taxYear}`;
  const taxYearWidth = doc.getStringUnitWidth(taxYearText) * 16 / doc.internal.scaleFactor;
  doc.text(taxYearText, (pageWidth - taxYearWidth) / 2, pageHeight / 3 + 30);
  
  // Full Name - Centered in the middle of the page
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  const fullNameWidth = doc.getStringUnitWidth(fullName) * 18 / doc.internal.scaleFactor;
  doc.text(fullName, (pageWidth - fullNameWidth) / 2, pageHeight / 2);
  
  // Date - Centered below name
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  const dateWidth = doc.getStringUnitWidth(formattedDate) * 14 / doc.internal.scaleFactor;
  doc.text(formattedDate, (pageWidth - dateWidth) / 2, pageHeight / 2 + 10);
  
  // Add a decorative line
  doc.setDrawColor(100, 100, 100);
  doc.setLineWidth(0.5);
  doc.line(pageWidth / 4, pageHeight / 2 + 20, pageWidth * 3/4, pageHeight / 2 + 20);
  
  // Add "Steuerformular Zusammenfassung / Tax Form Summary" at the bottom after the line
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const summaryText = 'Steuerformular Zusammenfassung';
  const summaryTextWidth = doc.getStringUnitWidth(summaryText) * 16 / doc.internal.scaleFactor;
  doc.text(summaryText, (pageWidth - summaryTextWidth) / 2, pageHeight / 2 + 35);
  
  // Selected language title below
  doc.setFontSize(14);
  doc.setTextColor(100); // Gray for secondary language
  const summaryEnglishText = 'Tax Form Summary';
  const summaryEnglishWidth = doc.getStringUnitWidth(summaryEnglishText) * 14 / doc.internal.scaleFactor;
  doc.text(summaryEnglishText, (pageWidth - summaryEnglishWidth) / 2, pageHeight / 2 + 45);
  doc.setTextColor(0); // Reset to black
  
  // Add page number for cover page
  addPageNumber(doc);

  // ---- Personal Information ----
  currentIndent = 0;
  const piGermanT = germanT_form.personalInfo || {};
  const piT = t.personalInfo || {};
  addSectionTitle(doc, yPositions, columnState, pageHeight, bottomMargin, piGermanT.title || 'Persönliche Informationen', piT.title || 'Personal Information');
  drawFieldInNextColumn(piGermanT.firstName || 'Vorname', piT.firstName || 'First Name', personalInfo.firstName);
  drawFieldInNextColumn(piGermanT.lastName || 'Nachname', piT.lastName || 'Last Name', personalInfo.lastName);
  drawFieldInNextColumn(piGermanT.taxId || 'Steuer-ID', piT.taxId || 'Tax ID', personalInfo.taxId);
  drawFieldInNextColumn(piGermanT.dateOfBirth || 'Geburtsdatum', piT.dateOfBirth || 'Date of Birth', personalInfo.dateOfBirth);
  drawFieldInNextColumn(piGermanT.email || 'E-Mail', piT.email || 'Email', personalInfo.email);
  drawFieldInNextColumn(piGermanT.phone || 'Telefon', piT.phone || 'Phone', personalInfo.phone);
  drawFieldInNextColumn(piGermanT.maritalStatus || 'Familienstand', piT.maritalStatus || 'Marital Status', personalInfo.maritalStatus);

  // ---- Address ----
  currentIndent = 0;
  const addressGermanT = germanT_form.address || {};
  const addressT = t.address || {};
  addSectionTitle(doc, yPositions, columnState, pageHeight, bottomMargin, addressGermanT.title || 'Adresse', addressT.title || 'Address', false);
  drawFieldInNextColumn(addressGermanT.street || 'Straße', addressT.street || 'Street', personalInfo.address?.street);
  drawFieldInNextColumn(addressGermanT.houseNumber || 'Hausnummer', addressT.houseNumber || 'House Number', personalInfo.address?.houseNumber);
  drawFieldInNextColumn(addressGermanT.postalCode || 'Postleitzahl', addressT.postalCode || 'Postal Code', personalInfo.address?.postalCode);
  drawFieldInNextColumn(addressGermanT.city || 'Stadt', addressT.city || 'City', personalInfo.address?.city);

  // ---- Business Information ----
  currentIndent = 0;
  const businessInfo = formData.businessInfo || {};
  const bizGermanT = germanT_form.businessInfo || {};
  const bizT = t.businessInfo || {};
  addSectionTitle(doc, yPositions, columnState, pageHeight, bottomMargin, bizGermanT.title || 'Geschäftsinformationen', bizT.title || 'Business Information');
  drawFieldInNextColumn(bizGermanT.isBusinessOwner || 'Geschäftsinhaber?', bizT.isBusinessOwner || 'Business Owner?', formatBooleanPdf(businessInfo.isBusinessOwner, germanI18nData, i18nData));
  if (businessInfo.isBusinessOwner) {
    drawFieldInNextColumn(bizGermanT.businessType || 'Geschäftsart', bizT.businessType || 'Business Type', businessInfo.businessType);
    
    // Business Address Subsection
    currentIndent = indentStep;
    const bizAddrGermanT = bizGermanT.businessAddress || {};
    const bizAddrT = bizT.businessAddress || {};
    addSubHeading(doc, yPositions, columnState, pageHeight, bottomMargin, 0, // Subheading title itself is not indented
        bizAddrGermanT.title || 'Geschäftsadresse', bizAddrT.title || 'Business Address'
    );
    drawFieldInNextColumn(bizAddrGermanT.street || 'Straße', bizAddrT.street || 'Street', businessInfo.businessAddress?.street);
    drawFieldInNextColumn(bizAddrGermanT.houseNumber || 'Hausnummer', bizAddrT.houseNumber || 'House Number', businessInfo.businessAddress?.houseNumber);
    drawFieldInNextColumn(bizAddrGermanT.postalCode || 'Postleitzahl', bizAddrT.postalCode || 'Postal Code', businessInfo.businessAddress?.postalCode);
    drawFieldInNextColumn(bizAddrGermanT.city || 'Stadt', bizAddrT.city || 'City', businessInfo.businessAddress?.city);
    currentIndent = 0; // Reset indent after subsection
  }
  
   // ---- Foreign Residence ----
   currentIndent = 0;
   const frGermanT = germanT_form.foreignResidence || {};
   const frT = t.foreignResidence || {};
   addSectionTitle(doc, yPositions, columnState, pageHeight, bottomMargin, frGermanT.title || 'Ausländischer Wohnsitz', frT.title || 'Foreign Residence', false);
   drawFieldInNextColumn(frGermanT.hasResidence || 'Wohnsitz im Ausland?', frT.hasResidence || 'Foreign Residence?', formatBooleanPdf(personalInfo.hasForeignResidence, germanI18nData, i18nData));
   if (personalInfo.hasForeignResidence && personalInfo.foreignResidence) {
     currentIndent = indentStep;
     drawFieldInNextColumn(frGermanT.country || 'Land', frT.country || 'Country', personalInfo.foreignResidence.country);
     if (personalInfo.foreignResidence.country === 'other') {
       drawFieldInNextColumn(frGermanT.otherCountry || 'Anderes Land', frT.otherCountry || 'Other Country', personalInfo.foreignResidence.otherCountry);
     }
     currentIndent = 0;
   }

  // ---- Spouse Information ----
  currentIndent = 0;
  const spouseGermanT = germanT_form.spouse || {};
  const spouseT = t.spouse || {};
  if (personalInfo.maritalStatus === 'married') {
    addSectionTitle(doc, yPositions, columnState, pageHeight, bottomMargin, spouseGermanT.title || 'Ehepartner Informationen', spouseT.title || 'Spouse Information');
    const spouseData = personalInfo.spouse || {};
    drawFieldInNextColumn(spouseGermanT.firstName || 'Vorname', spouseT.firstName || 'First Name', spouseData.firstName);
    drawFieldInNextColumn(spouseGermanT.lastName || 'Nachname', spouseT.lastName || 'Last Name', spouseData.lastName);
    drawFieldInNextColumn(spouseGermanT.dateOfBirth || 'Geburtsdatum', spouseT.dateOfBirth || 'Date of Birth', spouseData.dateOfBirth);
    drawFieldInNextColumn(spouseGermanT.taxId || 'Steuer-ID', spouseT.taxId || 'Tax ID', spouseData.taxId);
    drawFieldInNextColumn(spouseGermanT.hasIncome || 'Hat Einkommen?', spouseT.hasIncome || 'Has Income?', formatBooleanPdf(spouseData.hasIncome, germanI18nData, i18nData));
    if (spouseData.hasIncome) {
      currentIndent = indentStep;
      drawFieldInNextColumn(spouseGermanT.incomeType || 'Einkommensart', spouseT.incomeType || 'Income Type', spouseData.incomeType);
      drawFieldInNextColumn(spouseGermanT.jointTaxation || 'Gemeinsame Veranlagung?', spouseT.jointTaxation || 'Joint Taxation?', formatBooleanPdf(spouseData.jointTaxation, germanI18nData, i18nData));
      currentIndent = 0;
    }
  }

  // ---- Children Information ----
  currentIndent = 0;
  const childrenGermanT = germanT_form.children || {};
  const childrenT = t.children || {};
  addSectionTitle(doc, yPositions, columnState, pageHeight, bottomMargin, childrenGermanT.title || 'Kinder', childrenT.title || 'Children', false);
  drawFieldInNextColumn(childrenGermanT.hasChildren || 'Haben Sie Kinder?', childrenT.hasChildren || 'Do you have children?', formatBooleanPdf(personalInfo.hasChildren, germanI18nData, i18nData));
  if (personalInfo.hasChildren && personalInfo.children?.length > 0) {
    personalInfo.children.forEach((child: any, index: number) => {
      currentIndent = indentStep; // Indent child details
      addSubHeading(doc, yPositions, columnState, pageHeight, bottomMargin, 0, // Child subsection title not indented
          `${childrenGermanT.child || 'Kind'} ${index + 1}`, `${childrenT.child || 'Child'} ${index + 1}`
      );
      // Fields below subheading *are* indented
      drawFieldInNextColumn(childrenGermanT.firstName || 'Vorname', childrenT.firstName || 'First Name', child.firstName);
      drawFieldInNextColumn(childrenGermanT.lastName || 'Nachname', childrenT.lastName || 'Last Name', child.lastName);
      drawFieldInNextColumn(childrenGermanT.dateOfBirth || 'Geburtsdatum', childrenT.dateOfBirth || 'Date of Birth', child.dateOfBirth);
      drawFieldInNextColumn(childrenGermanT.taxId || 'Steuer-ID', childrenT.taxId || 'Tax ID', child.taxId);
    });
    currentIndent = 0; // Reset indent after all children
  }
  
  // ---- Employment Income ----
  currentIndent = 0;
  const empIncome = formData.employmentIncome || {};
  const empGermanT = germanT_form.employmentIncome || {};
  const empT = t.employmentIncome || {};
  addSectionTitle(doc, yPositions, columnState, pageHeight, bottomMargin, empGermanT.title || 'Einkünfte aus nichtselbständiger Arbeit', empT.title || 'Employment Income');
  drawFieldInNextColumn(empGermanT.grossSalary || 'Bruttoarbeitslohn', empT.grossSalary || 'Gross Salary', formatCurrencyPdf(empIncome.grossSalary));
  drawFieldInNextColumn(empGermanT.incomeTax || 'Lohnsteuer', empT.incomeTax || 'Income Tax', formatCurrencyPdf(empIncome.incomeTax));
  drawFieldInNextColumn(empGermanT.solidaritySurcharge || 'Solidaritätszuschlag', empT.solidaritySurcharge || 'Solidarity Surcharge', formatCurrencyPdf(empIncome.solidaritySurcharge));
  drawFieldInNextColumn(empGermanT.churchTax || 'Kirchensteuer', empT.churchTax || 'Church Tax', formatCurrencyPdf(empIncome.churchTax));

  // ---- Business Income ----
  currentIndent = 0;
  if (businessInfo.isBusinessOwner) {
      const bizIncGermanT = germanT_form.businessIncome || {};
      const bizIncT = t.businessIncome || {};
      addSectionTitle(doc, yPositions, columnState, pageHeight, bottomMargin, bizIncGermanT.title || 'Einkünfte aus Gewerbebetrieb/Selbständiger Arbeit', bizIncT.title || 'Business/Self-Employment Income', false);
      drawFieldInNextColumn(bizGermanT.businessEarnings || 'Einnahmen', bizT.businessEarnings || 'Earnings', formatCurrencyPdf(businessInfo.businessEarnings));
      drawFieldInNextColumn(bizGermanT.businessExpenses || 'Ausgaben', bizT.businessExpenses || 'Expenses', formatCurrencyPdf(businessInfo.businessExpenses));
  }

  // ---- Expenses ----
  currentIndent = 0;
  const expenses = formData.expenses || {};
  const workRelatedExpenses = expenses.workRelatedExpenses || formData.workRelatedExpenses || {};
  const specialExpenses = expenses.specialExpenses || {};
  const extraordinaryBurdens = expenses.extraordinaryBurdens || {};
  const craftsmenServices = expenses.craftsmenServices || {};
  
  const expGermanT = germanT_form.expenses || {};
  const expT = t.expenses || {};
  addSectionTitle(doc, yPositions, columnState, pageHeight, bottomMargin, expGermanT.title || 'Ausgaben & Abzüge', expT.title || 'Expenses & Deductions');
  
  // Work Related Expenses Section
  const wrExpGermanT = expGermanT.workRelatedExpenses || {};
  const wrExpT = expT.workRelatedExpenses || {};
  addSubHeading(doc, yPositions, columnState, pageHeight, bottomMargin, currentIndent, 
    wrExpGermanT.title || 'Werbungskosten', 
    wrExpT.title || 'Work-Related Expenses');
  
  // Commuting Expenses
  const commutationGermanT = wrExpGermanT.commutation || {};
  const commutationT = wrExpT.commutation || {};
  drawFieldInNextColumn(
    commutationGermanT.hasCommutingExpenses || 'Fahrtkosten?', 
    commutationT.hasCommutingExpenses || 'Has Commuting Expenses?',
    formatBooleanPdf(workRelatedExpenses?.commutation?.hasCommutingExpenses, germanI18nData, i18nData)
  );
  
  if (workRelatedExpenses?.commutation?.hasCommutingExpenses) {
    currentIndent = indentStep;
    drawFieldInNextColumn(
      commutationGermanT.workingDaysCount || 'Arbeitstage pro Jahr', 
      commutationT.workingDaysCount || 'Working Days per Year',
      workRelatedExpenses?.commutation?.workingDaysCount || '-'
    );
    currentIndent = 0;
  }
  
  // Business Trip Costs
  const businessTripsGermanT = wrExpGermanT.businessTripsCosts || {};
  const businessTripsT = wrExpT.businessTripsCosts || {};
  drawFieldInNextColumn(
    businessTripsGermanT.amount || 'Dienstreisekosten', 
    businessTripsT.amount || 'Business Trip Costs',
    formatCurrencyPdf(workRelatedExpenses?.businessTripsCosts?.amount)
  );
  
  // Work Equipment
  const workEquipGermanT = wrExpGermanT.workEquipment || {};
  const workEquipT = wrExpT.workEquipment || {};
  drawFieldInNextColumn(
    workEquipGermanT.hasWorkEquipment || 'Arbeitsmittel vorhanden?', 
    workEquipT.hasWorkEquipment || 'Has Work Equipment?',
    formatBooleanPdf(workRelatedExpenses?.workEquipment?.hasWorkEquipment, germanI18nData, i18nData)
  );
  
  // Home Office
  const homeOfficeGermanT = wrExpGermanT.homeOffice || {};
  const homeOfficeT = wrExpT.homeOffice || {};
  drawFieldInNextColumn(
    homeOfficeGermanT.hasHomeOffice || 'Home-Office vorhanden?', 
    homeOfficeT.hasHomeOffice || 'Has Home Office?',
    formatBooleanPdf(workRelatedExpenses?.homeOffice?.hasHomeOffice, germanI18nData, i18nData)
  );
  
  if (workRelatedExpenses?.homeOffice?.hasHomeOffice) {
    currentIndent = indentStep;
    drawFieldInNextColumn(
      homeOfficeGermanT.workingDaysCount || 'Home-Office Tage', 
      homeOfficeT.workingDaysCount || 'Home Office Days',
      workRelatedExpenses?.homeOffice?.workingDaysCount || '-'
    );
    currentIndent = 0;
  }
  
  // Application Costs
  const appCostsGermanT = wrExpGermanT.applicationCosts || {};
  const appCostsT = wrExpT.applicationCosts || {};
  drawFieldInNextColumn(
    appCostsGermanT.online || 'Online Bewerbungen', 
    appCostsT.online || 'Online Applications',
    workRelatedExpenses?.applicationCosts?.online || '-'
  );
  drawFieldInNextColumn(
    appCostsGermanT.inPerson || 'Persönliche Bewerbungen', 
    appCostsT.inPerson || 'In-Person Applications',
    workRelatedExpenses?.applicationCosts?.inPerson || '-'
  );
  
  // Double Household Management
  drawFieldInNextColumn(
    wrExpGermanT.hasDoubleHouseholdMgmt || 'Doppelte Haushaltsführung?', 
    wrExpT.hasDoubleHouseholdMgmt || 'Double Household Management?',
    formatBooleanPdf(workRelatedExpenses?.hasDoubleHouseholdMgmt, germanI18nData, i18nData)
  );
  
  // Special Expenses Section
  const specialExpGermanT = expGermanT.specialExpenses || {};
  const specialExpT = expT.specialExpenses || {};
  addSubHeading(doc, yPositions, columnState, pageHeight, bottomMargin, currentIndent, 
    specialExpGermanT.title || 'Sonderausgaben', 
    specialExpT.title || 'Special Expenses');
  
  // Insurance
  const insuranceGermanT = specialExpGermanT.insurance || {};
  const insuranceT = specialExpT.insurance || {};
  drawFieldInNextColumn(
    insuranceGermanT.hasInsurance || 'Versicherungen vorhanden?', 
    insuranceT.hasInsurance || 'Has Insurance?',
    formatBooleanPdf(specialExpenses?.insurance?.hasInsurance, germanI18nData, i18nData)
  );
  
  // Donations
  const donationsGermanT = specialExpGermanT.donations || {};
  const donationsT = specialExpT.donations || {};
  drawFieldInNextColumn(
    donationsGermanT.hasDonations || 'Spenden getätigt?', 
    donationsT.hasDonations || 'Has Donations?',
    formatBooleanPdf(specialExpenses?.donations?.hasDonations, germanI18nData, i18nData)
  );
  
  // Professional Development
  const profDevGermanT = specialExpGermanT.professionalDevelopment || {};
  const profDevT = specialExpT.professionalDevelopment || {};
  drawFieldInNextColumn(
    profDevGermanT.hasProfessionalDevelopment || 'Weiterbildung absolviert?', 
    profDevT.hasProfessionalDevelopment || 'Has Professional Development?',
    formatBooleanPdf(specialExpenses?.professionalDevelopment?.hasProfessionalDevelopment, germanI18nData, i18nData)
  );
  
  // Extraordinary Burdens Section
  const extraBurdensGermanT = expGermanT.extraordinaryBurdens || {};
  const extraBurdensT = expT.extraordinaryBurdens || {};
  addSubHeading(doc, yPositions, columnState, pageHeight, bottomMargin, currentIndent, 
    extraBurdensGermanT.title || 'Außergewöhnliche Belastungen', 
    extraBurdensT.title || 'Extraordinary Burdens');
  
  // Medical Expenses
  const medExpGermanT = extraBurdensGermanT.medicalExpenses || {};
  const medExpT = extraBurdensT.medicalExpenses || {};
  drawFieldInNextColumn(
    medExpGermanT.hasMedicalExpenses || 'Krankheitskosten vorhanden?', 
    medExpT.hasMedicalExpenses || 'Has Medical Expenses?',
    formatBooleanPdf(extraordinaryBurdens?.medicalExpenses?.hasMedicalExpenses, germanI18nData, i18nData)
  );
  
  // Care Costs
  const careCostsGermanT = extraBurdensGermanT.careCosts || {};
  const careCostsT = extraBurdensT.careCosts || {};
  drawFieldInNextColumn(
    careCostsGermanT.hasCareCosts || 'Pflegekosten vorhanden?', 
    careCostsT.hasCareCosts || 'Has Care Costs?',
    formatBooleanPdf(extraordinaryBurdens?.careCosts?.hasCareCosts, germanI18nData, i18nData)
  );
  
  // Disability Expenses
  const disabilityExpGermanT = extraBurdensGermanT.disabilityExpenses || {};
  const disabilityExpT = extraBurdensT.disabilityExpenses || {};
  drawFieldInNextColumn(
    disabilityExpGermanT.hasDisabilityExpenses || 'Behinderungskosten vorhanden?', 
    disabilityExpT.hasDisabilityExpenses || 'Has Disability Expenses?',
    formatBooleanPdf(extraordinaryBurdens?.disabilityExpenses?.hasDisabilityExpenses, germanI18nData, i18nData)
  );
  
  // Craftsmen Services Section
  const craftsmenGermanT = expGermanT.craftsmenServices || {};
  const craftsmenT = expT.craftsmenServices || {};
  addSubHeading(doc, yPositions, columnState, pageHeight, bottomMargin, currentIndent, 
    craftsmenGermanT.title || 'Handwerkerleistungen', 
    craftsmenT.title || 'Craftsmen Services');
  
  drawFieldInNextColumn(
    craftsmenGermanT.hasMaintenancePayments || 'Unterhaltszahlungen?', 
    craftsmenT.hasMaintenancePayments || 'Maintenance Payments?',
    formatBooleanPdf(craftsmenServices?.hasMaintenancePayments, germanI18nData, i18nData)
  );
  
  if (craftsmenServices?.hasMaintenancePayments) {
    currentIndent = indentStep;
    drawFieldInNextColumn(
      craftsmenGermanT.maintenanceRecipient || 'Empfänger der Unterhaltszahlungen', 
      craftsmenT.maintenanceRecipient || 'Maintenance Recipient',
      craftsmenServices?.maintenanceRecipient || '-'
    );
    drawFieldInNextColumn(
      craftsmenGermanT.maintenanceAmount || 'Höhe der Unterhaltszahlungen', 
      craftsmenT.maintenanceAmount || 'Maintenance Amount',
      formatCurrencyPdf(craftsmenServices?.maintenanceAmount)
    );
    currentIndent = 0;
  }

  // ---- Foreign Income ----
  currentIndent = 0;
  const incomeInfo = formData.incomeInfo || {}; // Assuming foreign income is here
  const fiGermanT = germanT_form.foreignIncome || {}; // Path for foreign income specific labels
  const fiT = t.foreignIncome || {};
  const incomeInfoGermanT = germanT_form.incomeInfo || {}; // Path for the hasForeignIncome question label
  const incomeInfoT = t.incomeInfo || {};

  addSectionTitle(doc, yPositions, columnState, pageHeight, bottomMargin, fiGermanT.title || 'Ausländische Einkünfte', fiT.title || 'Foreign Income');
  drawFieldInNextColumn(incomeInfoGermanT.hasForeignIncome || 'Einkünfte erhalten?', incomeInfoT.hasForeignIncome || 'Received income?', formatBooleanPdf(incomeInfo.hasForeignIncome, germanI18nData, i18nData));
  if (incomeInfo.hasForeignIncome) {
    currentIndent = indentStep;
    drawFieldInNextColumn(fiGermanT.countryQuestion || 'Herkunftsland', fiT.countryQuestion || 'Country of Origin', incomeInfo.foreignIncomeCountry);
    drawFieldInNextColumn(fiGermanT.incomeTypeQuestion || 'Art der Einkünfte', fiT.incomeTypeQuestion || 'Type of Income', incomeInfo.foreignIncomeType);
    drawFieldInNextColumn(fiGermanT.totalAmountQuestion || 'Betrag (EUR)', fiT.totalAmountQuestion || 'Amount (EUR)', formatCurrencyPdf(incomeInfo.foreignIncomeAmount));
    drawFieldInNextColumn(fiGermanT.taxPaidQuestion || 'Gezahlte ausl. Steuer (EUR)', fiT.taxPaidQuestion || 'Foreign Tax Paid (EUR)', formatCurrencyPdf(incomeInfo.foreignIncomeTaxPaid));
    currentIndent = 0;
  }

  // ---- Signature and Consent ---- (Always on a new page, last page)
  currentIndent = 0;
  const sigGermanT = germanT_form.signature || {};
  const sigT = t.signature || {};

  // Always force a new page for signature
  doc.addPage();
  yPositions.col1 = topMargin;
  yPositions.col2 = topMargin;
  columnState.nextCol = 1;

  // Declaration and Consent Section first
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`${sigGermanT.title || 'Erklärung'} / ${sigT.title || 'Declaration'}`, 20, yPositions.col1);
  
  yPositions.col1 += 15;
  yPositions.col2 = yPositions.col1;
  
  // German Declaration Text
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(sigGermanT.title || 'Erklärung', 20, yPositions.col1);
  yPositions.col1 += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const germanConsent1 = sigGermanT?.consent1 || 'Ich versichere, dass ich die Angaben... (DE)';
  const germanConsent2 = sigGermanT?.consent2 || 'Ich stimme zu, dass meine Daten... (DE)';
  
  const splitGermanConsent1 = doc.splitTextToSize(germanConsent1, 170);
  doc.text(splitGermanConsent1, 20, yPositions.col1);
  yPositions.col1 += splitGermanConsent1.length * 6;
  
  const splitGermanConsent2 = doc.splitTextToSize(germanConsent2, 170);
  doc.text(splitGermanConsent2, 20, yPositions.col1);
  yPositions.col1 += splitGermanConsent2.length * 6 + 10;
  
  // Selected Language Declaration Text
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(sigT.title || 'Declaration', 20, yPositions.col1);
  yPositions.col1 += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const consent1 = sigT?.consent1 || 'I declare that the information provided...';
  const consent2 = sigT?.consent2 || 'I consent to my data being processed...';
  
  const splitConsent1 = doc.splitTextToSize(consent1, 170);
  doc.text(splitConsent1, 20, yPositions.col1);
  yPositions.col1 += splitConsent1.length * 6;
  
  const splitConsent2 = doc.splitTextToSize(consent2, 170);
  doc.text(splitConsent2, 20, yPositions.col1);
  yPositions.col1 += splitConsent2.length * 6 + 15;
  yPositions.col2 = yPositions.col1;
  
  // Place and date
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`${sigGermanT.placeDate || 'Ort und Datum'} / ${sigT.placeDate || 'Place and Date'}`, 20, yPositions.col1);
  yPositions.col1 += 10;
  
  // Draw the place and date in a table-like format
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${sigGermanT.place || 'Ort (DE)'} / ${sigT.place || 'Place'}: ${signatureData.place || '__________________'}`, 20, yPositions.col1);
  yPositions.col1 += 8;
  
  doc.text(`${sigGermanT.date || 'Datum (DE)'} / ${sigT.date || 'Date'}: ${signatureData.date || '__________________'}`, 20, yPositions.col1);
  yPositions.col1 += 15;
  
  // Full Name
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`${sigGermanT.fullNameTitle || 'Vollständiger Name'} / ${sigT.fullNameTitle || 'Full Name'}`, 20, yPositions.col1);
  yPositions.col1 += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${sigGermanT.fullName || 'Vollständiger Name (DE)'} / ${sigT.fullName || 'Full Name'}: ${signatureData.fullName || '__________________'}`, 20, yPositions.col1);
  yPositions.col1 += 15;
  
  // Signature
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`${sigGermanT.signature || 'Unterschrift'} / ${sigT.signature || 'Signature'}`, 20, yPositions.col1);
  yPositions.col1 += 10;
  
  // Add Signature Image
  if (signatureData.signature) {
    try {
      // Draw image
      doc.addImage(signatureData.signature, 'PNG', 20, yPositions.col1, 80, 30);
      yPositions.col1 += 40; // Add space after signature
    } catch (e) {
      console.error("Error adding signature image:", e);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text("Fehler beim Hinzufügen des Signaturbilds / Error adding signature image", 20, yPositions.col1);
      yPositions.col1 += 10;
    }
  } else {
    // Draw a signature line if no signature
    doc.setDrawColor(0);
    doc.line(20, yPositions.col1 + 15, 100, yPositions.col1 + 15);
    yPositions.col1 += 25;
  }

  // ---- Save the PDF ----
  // Instead of just saving the PDF locally, we'll also upload it to Firebase
  
  // First, save locally as usual
  doc.save('tax-form-summary.pdf');
  
  // Then, upload all files to Firebase Storage
  try {
    // Upload all attachments from the form
    await uploadFilesToFirebase(formData, fullName);
    
    // Get the PDF as a blob and upload it too
    const pdfBlob = doc.output('blob');
    const pdfUrl = await uploadPdfToFirebase(pdfBlob, fullName);
    
    console.log('Tax form submission complete!');
    if (pdfUrl) {
      console.log('PDF URL:', pdfUrl);
    } else {
      console.log('PDF was uploaded successfully, but the download URL is not available due to permission restrictions.');
    }
    
    // Return the URL if needed
    return { 
      success: true, 
      pdfUrl,
      message: pdfUrl 
        ? 'Tax form submitted successfully.' 
        : 'Tax form submitted successfully. PDF was uploaded but download URL is not available due to permission restrictions.'
    };
  } catch (error) {
    console.error('Error during file upload:', error);
    // Still return success for the PDF generation even if upload fails
    return { 
      success: true, 
      pdfUrl: null, 
      error: 'File upload failed',
      message: 'PDF was generated but uploading to cloud storage failed.'
    };
  }
}; 