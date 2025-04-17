import React from 'react';
import { generateTaxFormPdf } from '../../../lib/generateTaxFormPdf';

// Define the AppLanguageData interface inline
interface AppLanguageData {
  taxForm?: {
    [key: string]: any;
  };
}

// Define the TaxFormData interface inline
interface TaxFormData {
  [key: string]: any;
}

interface PDFExportButtonProps {
  formData: TaxFormData;
  germanI18nData: AppLanguageData | null;
  i18nData: AppLanguageData | null;
  className?: string;
}

/**
 * Button component that triggers PDF export of the tax form data
 */
const PDFExportButton: React.FC<PDFExportButtonProps> = ({
  formData,
  germanI18nData,
  i18nData,
  className = '',
}) => {
  const handleExportPDF = () => {
    try {
      generateTaxFormPdf(formData, germanI18nData, i18nData);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Please try again later.');
    }
  };

  return (
    <button 
      onClick={handleExportPDF}
      className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white text-neutral-700 hover:bg-gray-50 ${className}`}
      type="button"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      <span>{i18nData?.taxForm?.signature?.exportPDF || 'Export as PDF'}</span>
    </button>
  );
};

export default PDFExportButton; 