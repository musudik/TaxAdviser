import React from 'react';
import { ValidationErrors } from '../validation';
import { SignaturePad } from '../signature-pad';
import FKInputField from '../../../ui/FKInputField';
import { LanguageCode } from '../constants'; // Assuming constants file exists

interface TFSignatureProps {
  formData: { [key: string]: any };
  handleChange: (section: string, field: string, value: any) => void;
  selectedLanguage: LanguageCode; // Use specific type
  i18nData: any; // Use specific type later
  germanI18nData: any; // Use specific type later
  validationErrors: ValidationErrors | null;
  showValidationErrors: boolean;
}

// Helper component for section styling
const FormSection = ({ title, children }: { title: React.ReactNode, children: React.ReactNode }) => (
  <div className="border border-gray-200 rounded-md p-4 mb-4">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const TFSignature: React.FC<TFSignatureProps> = ({
  formData,
  handleChange,
  selectedLanguage,
  i18nData,
  germanI18nData,
  validationErrors,
  showValidationErrors
}) => {
  const handleFieldChange = (field: string, value: any) => {
    handleChange('signature', field, value);
  };

  // Get translations
  const t = i18nData?.taxForm || {}; // Top level for different sections
  const germanT = germanI18nData?.taxForm || t; 
  const sigT = t.signature || {};
  const germanSigT = germanT.signature || sigT;
  const termsT = t.terms || {};
  const germanTermsT = germanT.terms || termsT;
  const declT = t.declaration || {};
  const germanDeclT = germanT.declaration || declT;

  const signatureData = formData.signature || {};

  const getErrorKey = (field: string): string | undefined => {
    if (!showValidationErrors || !validationErrors?.signature) {
      return undefined;
    }
    const signatureErrors = validationErrors.signature;
    if (typeof signatureErrors !== 'object' || signatureErrors === null) return undefined;
    const errorKey = signatureErrors[field];
    return typeof errorKey === 'string' ? errorKey : undefined;
  };

  const fieldHasError = (field: string): boolean => {
    return !!getErrorKey(field);
  };

  const getValidationMessage = (field: string): string | undefined => {
    const errorKey = getErrorKey(field);
    if (!errorKey) return undefined;

    // Validation messages might be top-level
    const germanMsg = germanI18nData?.validation?.[errorKey]; 
    const selectedMsg = i18nData?.validation?.[errorKey];

    if (germanMsg && selectedMsg && germanMsg !== selectedMsg) {
      return `${germanMsg} / ${selectedMsg}`;
    }
    return germanMsg || selectedMsg || errorKey;
  };

  return (
    <div className="space-y-6">
      {/* Declaration Section */}
      <FormSection title={<>{germanDeclT.title || 'Erklärung (DE)'} / {declT.title || 'Declaration'}</>}>
        <div className="space-y-4 border rounded-md p-4 bg-neutral-50">
          {/* German Declaration Text */}
          <h3 className="font-medium text-neutral-900 mb-4">{germanDeclT.title || 'Erklärung'}</h3>
          <div className="space-y-3">
            <p className="text-sm text-neutral-700">
              {germanDeclT.text1 || 'Ich versichere, dass ich die Angaben... (DE)'}
            </p>
            <p className="text-sm text-neutral-700">
               {germanDeclT.text2 || 'Ich stimme zu, dass meine Daten... (DE)'}
            </p>
          </div>

          {/* Selected Language Declaration Text */}
          <h3 className="font-medium text-neutral-900 mb-4 mt-6">{declT.title || 'Declaration'}</h3>
          <div className="space-y-3 text-sm text-neutral-700">
            <p>
              {declT.text1 || 'I declare that the information provided... '}
            </p>
            <p>
               {declT.text2 || 'I consent to my data being processed...'}
            </p>
          </div>
        </div>
      </FormSection>

      {/* Place and Date Section */}
      <FormSection title={<>{germanSigT.placeDate || 'Ort und Datum (DE)'} / {sigT.placeDate || 'Place and Date'}</>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FKInputField
            id="place"
            mainLanguage={germanSigT.place || 'Ort (DE)'} // Correct pattern
            selectedLanguage={sigT.place || 'Place'} // Correct pattern
            value={signatureData.place || ''}
            onChange={(e) => handleFieldChange('place', e.target.value)}
            mandatory={true}
            hasError={fieldHasError('place')}
            validationError={getValidationMessage('place')}
          />
          <FKInputField
            id="date"
            type="date"
            mainLanguage={germanSigT.date || 'Datum (DE)'} // Correct pattern
            selectedLanguage={sigT.date || 'Date'} // Correct pattern
            value={signatureData.date || ''}
            onChange={(e) => handleFieldChange('date', e.target.value)}
            mandatory={true}
            hasError={fieldHasError('date')}
            validationError={getValidationMessage('date')}
          />
        </div>
      </FormSection>

      {/* Signature Section */}
      <FormSection title={<>{germanSigT.title || 'Unterschrift (DE)'} / {sigT.title || 'Signature'}</>}>
        <div className="space-y-4">
           {/* Label for Signature Pad */} 
           <div className="mb-1">
             <label className="block font-medium text-sm text-neutral-900">
               {germanSigT.signature || 'Digitale Unterschrift (DE)'}
             </label>
             <label className="block text-neutral-500 text-sm">
                {sigT.signature || 'Digital Signature'}
             </label>
          </div>
          <SignaturePad
            onSave={(signatureDataUrl) => handleFieldChange('signature', signatureDataUrl)}
            initialValue={signatureData.signature || ''}
          />
          {fieldHasError('signature') && (
            <p className="text-red-500 text-sm">
              {getValidationMessage('signature')}
            </p>
          )}
        </div>
      </FormSection>

      {/* Terms and Conditions Section */}
      <FormSection title={<>{germanTermsT.title || 'Bedingungen (DE)'} / {termsT.title || 'Terms'}</>}>
        <div className="space-y-4">
          {/* Accept Terms Checkbox - Using standard input for checkbox styling */}
          <div className="flex items-start">
            <input
              type="checkbox"
              id="acceptTerms"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
              checked={signatureData.acceptTerms || false}
              onChange={(e) => handleFieldChange('acceptTerms', e.target.checked)}
            />
            <label htmlFor="acceptTerms" className="ml-3 block text-sm">
              <span className="font-medium text-neutral-900">{germanTermsT.accept || 'Ich akzeptiere die Bedingungen (DE)'}</span>
              <span className="block text-neutral-500">{termsT.accept || 'I accept the terms and conditions'}</span>
            </label>
          </div>
          {fieldHasError('acceptTerms') && (
            <p className="text-red-500 text-sm">
              {getValidationMessage('acceptTerms')}
            </p>
          )}

          {/* Accept Data Protection Checkbox */}
          <div className="flex items-start">
            <input
              type="checkbox"
              id="acceptDataProtection"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
              checked={signatureData.acceptDataProtection || false}
              onChange={(e) => handleFieldChange('acceptDataProtection', e.target.checked)}
            />
            <label htmlFor="acceptDataProtection" className="ml-3 block text-sm">
              <span className="font-medium text-neutral-900">{germanTermsT.dataProtection || 'Ich akzeptiere die Datenschutzerklärung (DE)'}</span>
              <span className="block text-neutral-500">{termsT.dataProtection || 'I accept the data protection policy'}</span>
            </label>
          </div>
          {fieldHasError('acceptDataProtection') && (
            <p className="text-red-500 text-sm">
              {getValidationMessage('acceptDataProtection')}
            </p>
          )}
        </div>
      </FormSection>
    </div>
  );
};

export default TFSignature; 