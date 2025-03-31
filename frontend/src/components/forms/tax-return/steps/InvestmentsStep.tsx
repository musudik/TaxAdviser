import React from 'react';
import { Label, FormSection, Input } from '../utils/UIComponents';
import { TaxFormData } from '../taxTypes';
import languageData from '../i18n/language.json';

interface InvestmentsStepProps {
  formData: TaxFormData;
  handleChange: (section: keyof TaxFormData, field: string, value: any) => void;
  validationErrors: Record<string, any> | null;
  hasError: (section: string, field: string) => boolean;
  showValidationErrors: boolean;
  getInputClass?: (section: string, field: string) => string;
}

const InvestmentsStep: React.FC<InvestmentsStepProps> = ({
  formData,
  handleChange,
  validationErrors,
  hasError,
  showValidationErrors,
  getInputClass = () => "auth-input"
}) => {
  // Common input class that handles validation state
  const getInputClassWithError = (section: string, field: string) => {
    const baseClass = getInputClass(section, field);
    return hasError(section, field) && showValidationErrors
      ? `${baseClass} border-2 border-red-500` 
      : baseClass;
  };

  return (
    <div>
      <FormSection 
        germanTitle={languageData.de.incomeInfo.investmentsTitle}
        englishTitle={languageData.en.incomeInfo.investmentsTitle}
      >
        <div className="space-y-6">
          {/* Investment Income Question */}
          <div className="form-group">
            <Label 
              htmlFor="hasStockIncome"
              germanText={<div className="font-bold">{languageData.de.incomeInfo.hasStockIncome}</div>}
              englishText={<div className="text-neutral-600">{languageData.en.incomeInfo.hasStockIncome}</div>}
            />
            <div className="flex space-x-4 mt-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="hasStockIncomeNo"
                  name="hasStockIncome"
                  checked={formData.incomeInfo.hasStockIncome === false}
                  onChange={() => handleChange('incomeInfo', 'hasStockIncome', false)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="hasStockIncomeNo" className="ml-2 text-neutral-700">
                  <span className="font-bold">Nein</span> / <span className="text-neutral-600">No</span>
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="hasStockIncomeYes"
                  name="hasStockIncome"
                  checked={formData.incomeInfo.hasStockIncome === true}
                  onChange={() => handleChange('incomeInfo', 'hasStockIncome', true)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="hasStockIncomeYes" className="ml-2 text-neutral-700">
                  <span className="font-bold">Ja</span> / <span className="text-neutral-600">Yes</span>
                </label>
              </div>
            </div>
            {hasError('incomeInfo', 'hasStockIncome') && showValidationErrors && (
              <p className="text-red-500 text-sm mt-1">
                {formData.incomeInfo.hasStockIncome === undefined 
                  ? 'Bitte wählen Sie eine Option aus / Please select an option'
                  : typeof validationErrors?.incomeInfo?.hasStockIncome === 'string'
                    ? validationErrors.incomeInfo.hasStockIncome
                    : 'Bitte wählen Sie eine Option aus / Please select an option'
                }
              </p>
            )}
          </div>

          {/* Show investment details if user has investment income */}
          {formData.incomeInfo.hasStockIncome && (
            <>
              {/* Dividend Earnings */}
              <div className="form-group">
                <Label 
                  htmlFor="dividendEarnings"
                  germanText={<div className="font-bold">{languageData.de.incomeInfo.dividendEarnings}</div>}
                  englishText={<div className="text-neutral-600">{languageData.en.incomeInfo.dividendEarnings}</div>}
                />
                <Input
                  id="dividendEarnings"
                  type="number"
                  value={formData.incomeInfo.dividendEarnings || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    const parsedValue = value === '' ? null : parseFloat(value);
                    handleChange('incomeInfo', 'dividendEarnings', parsedValue);
                  }}
                  className={getInputClassWithError('incomeInfo', 'dividendEarnings')}
                  required
                />
                {hasError('incomeInfo', 'dividendEarnings') && showValidationErrors && (
                  <p className="text-red-500 text-sm mt-1">
                    {typeof validationErrors?.incomeInfo?.dividendEarnings === 'string'
                      ? validationErrors.incomeInfo.dividendEarnings
                      : 'Bitte geben Sie einen gültigen Betrag ein / Please enter a valid amount'}
                  </p>
                )}
              </div>

              {/* Bank Certificate Question */}
              <div className="form-group">
                <Label 
                  htmlFor="hasBankCertificate"
                  germanText={<div className="font-bold">{languageData.de.incomeInfo.hasBankCertificate}</div>}
                  englishText={<div className="text-neutral-600">{languageData.en.incomeInfo.hasBankCertificate}</div>}
                />
                <div className="flex space-x-4 mt-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="hasBankCertificateNo"
                      name="hasBankCertificate"
                      checked={formData.incomeInfo.hasBankCertificate === false}
                      onChange={() => handleChange('incomeInfo', 'hasBankCertificate', false)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="hasBankCertificateNo" className="ml-2 text-neutral-700">
                      <span className="font-bold">Nein</span> / <span className="text-neutral-600">No</span>
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="hasBankCertificateYes"
                      name="hasBankCertificate"
                      checked={formData.incomeInfo.hasBankCertificate === true}
                      onChange={() => handleChange('incomeInfo', 'hasBankCertificate', true)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="hasBankCertificateYes" className="ml-2 text-neutral-700">
                      <span className="font-bold">Ja</span> / <span className="text-neutral-600">Yes</span>
                    </label>
                  </div>
                </div>
                {hasError('incomeInfo', 'hasBankCertificate') && showValidationErrors && (
                  <p className="text-red-500 text-sm mt-1">
                    {typeof validationErrors?.incomeInfo?.hasBankCertificate === 'string'
                      ? validationErrors.incomeInfo.hasBankCertificate
                      : 'Bitte wählen Sie eine Option aus / Please select an option'}
                  </p>
                )}
              </div>

              {/* Bank Certificate File Upload (if user has certificate) */}
              {formData.incomeInfo.hasBankCertificate && (
                <div className="form-group">
                  <Label 
                    htmlFor="bankCertificateFile"
                    germanText={<div className="font-bold">Bankbescheinigung</div>}
                    englishText={<div className="text-neutral-600">Bank Certificate</div>}
                  />
                  <input
                    id="bankCertificateFile"
                    type="file"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleChange('incomeInfo', 'bankCertificateFile', e.target.files[0]);
                      } else {
                        handleChange('incomeInfo', 'bankCertificateFile', null);
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
                  {hasError('incomeInfo', 'bankCertificateFile') && showValidationErrors && (
                    <p className="text-red-500 text-sm mt-1">
                      {typeof validationErrors?.incomeInfo?.bankCertificateFile === 'string'
                        ? validationErrors.incomeInfo.bankCertificateFile
                        : 'Bitte laden Sie die Bankbescheinigung hoch / Please upload the bank certificate'}
                    </p>
                  )}
                </div>
              )}

              {/* Stock Sales Question */}
              <div className="form-group">
                <Label 
                  htmlFor="hasStockSales"
                  germanText={<div className="font-bold">{languageData.de.incomeInfo.hasStockSales}</div>}
                  englishText={<div className="text-neutral-600">{languageData.en.incomeInfo.hasStockSales}</div>}
                />
                <div className="flex space-x-4 mt-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="hasStockSalesNo"
                      name="hasStockSales"
                      checked={formData.incomeInfo.hasStockSales === false}
                      onChange={() => handleChange('incomeInfo', 'hasStockSales', false)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="hasStockSalesNo" className="ml-2 text-neutral-700">
                      <span className="font-bold">Nein</span> / <span className="text-neutral-600">No</span>
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="hasStockSalesYes"
                      name="hasStockSales"
                      checked={formData.incomeInfo.hasStockSales === true}
                      onChange={() => handleChange('incomeInfo', 'hasStockSales', true)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="hasStockSalesYes" className="ml-2 text-neutral-700">
                      <span className="font-bold">Ja</span> / <span className="text-neutral-600">Yes</span>
                    </label>
                  </div>
                </div>
                {hasError('incomeInfo', 'hasStockSales') && showValidationErrors && (
                  <p className="text-red-500 text-sm mt-1">
                    {typeof validationErrors?.incomeInfo?.hasStockSales === 'string'
                      ? validationErrors.incomeInfo.hasStockSales
                      : 'Bitte wählen Sie eine Option aus / Please select an option'}
                  </p>
                )}
              </div>

              {/* Stock Profit/Loss (if user has stock sales) */}
              {formData.incomeInfo.hasStockSales && (
                <div className="form-group">
                  <Label 
                    htmlFor="stockProfitLoss"
                    germanText={<div className="font-bold">{languageData.de.incomeInfo.stockProfitLoss}</div>}
                    englishText={<div className="text-neutral-600">{languageData.en.incomeInfo.stockProfitLoss}</div>}
                  />
                  <Input
                    id="stockProfitLoss"
                    type="number"
                    value={formData.incomeInfo.stockProfitLoss || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      const parsedValue = value === '' ? null : parseFloat(value);
                      handleChange('incomeInfo', 'stockProfitLoss', parsedValue);
                    }}
                    className={getInputClassWithError('incomeInfo', 'stockProfitLoss')}
                    required
                  />
                  {hasError('incomeInfo', 'stockProfitLoss') && showValidationErrors && (
                    <p className="text-red-500 text-sm mt-1">
                      {typeof validationErrors?.incomeInfo?.stockProfitLoss === 'string'
                        ? validationErrors.incomeInfo.stockProfitLoss
                        : 'Bitte geben Sie einen gültigen Betrag ein / Please enter a valid amount'}
                    </p>
                  )}
                </div>
              )}

              {/* Foreign Stocks Question */}
              <div className="form-group">
                <Label 
                  htmlFor="hasForeignStocks"
                  germanText={<div className="font-bold">{languageData.de.incomeInfo.hasForeignStocks}</div>}
                  englishText={<div className="text-neutral-600">{languageData.en.incomeInfo.hasForeignStocks}</div>}
                />
                <div className="flex space-x-4 mt-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="hasForeignStocksNo"
                      name="hasForeignStocks"
                      checked={formData.incomeInfo.hasForeignStocks === false}
                      onChange={() => handleChange('incomeInfo', 'hasForeignStocks', false)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="hasForeignStocksNo" className="ml-2 text-neutral-700">
                      <span className="font-bold">Nein</span> / <span className="text-neutral-600">No</span>
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="hasForeignStocksYes"
                      name="hasForeignStocks"
                      checked={formData.incomeInfo.hasForeignStocks === true}
                      onChange={() => handleChange('incomeInfo', 'hasForeignStocks', true)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="hasForeignStocksYes" className="ml-2 text-neutral-700">
                      <span className="font-bold">Ja</span> / <span className="text-neutral-600">Yes</span>
                    </label>
                  </div>
                </div>
                {hasError('incomeInfo', 'hasForeignStocks') && showValidationErrors && (
                  <p className="text-red-500 text-sm mt-1">
                    {typeof validationErrors?.incomeInfo?.hasForeignStocks === 'string'
                      ? validationErrors.incomeInfo.hasForeignStocks
                      : 'Bitte wählen Sie eine Option aus / Please select an option'}
                  </p>
                )}
              </div>

              {/* Foreign Tax Information (if user has foreign stocks) */}
              {formData.incomeInfo.hasForeignStocks && (
                <>
                  <div className="form-group">
                    <Label 
                      htmlFor="foreignTaxPaid"
                      germanText={<div className="font-bold">{languageData.de.incomeInfo.foreignTaxPaid}</div>}
                      englishText={<div className="text-neutral-600">{languageData.en.incomeInfo.foreignTaxPaid}</div>}
                    />
                    <Input
                      id="foreignTaxPaid"
                      type="number"
                      value={formData.incomeInfo.foreignTaxPaid || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        const parsedValue = value === '' ? null : parseFloat(value);
                        handleChange('incomeInfo', 'foreignTaxPaid', parsedValue);
                      }}
                      className={getInputClassWithError('incomeInfo', 'foreignTaxPaid')}
                      required
                    />
                    {hasError('incomeInfo', 'foreignTaxPaid') && showValidationErrors && (
                      <p className="text-red-500 text-sm mt-1">
                        {typeof validationErrors?.incomeInfo?.foreignTaxPaid === 'string'
                          ? validationErrors.incomeInfo.foreignTaxPaid
                          : 'Bitte geben Sie einen gültigen Betrag ein / Please enter a valid amount'}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <Label 
                      htmlFor="foreignTaxCertificateFile"
                      germanText={<div className="font-bold">Ausländische Steuerbescheinigung</div>}
                      englishText={<div className="text-neutral-600">Foreign Tax Certificate</div>}
                    />
                    <input
                      id="foreignTaxCertificateFile"
                      type="file"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          handleChange('incomeInfo', 'foreignTaxCertificateFile', e.target.files[0]);
                        } else {
                          handleChange('incomeInfo', 'foreignTaxCertificateFile', null);
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
                    {hasError('incomeInfo', 'foreignTaxCertificateFile') && showValidationErrors && (
                      <p className="text-red-500 text-sm mt-1">
                        {typeof validationErrors?.incomeInfo?.foreignTaxCertificateFile === 'string'
                          ? validationErrors.incomeInfo.foreignTaxCertificateFile
                          : 'Bitte laden Sie die ausländische Steuerbescheinigung hoch / Please upload the foreign tax certificate'}
                      </p>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </FormSection>
    </div>
  );
};

export default InvestmentsStep; 