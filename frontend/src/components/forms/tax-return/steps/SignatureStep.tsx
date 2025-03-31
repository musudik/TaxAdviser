import React from 'react';
import { TaxFormData } from '../taxTypes';
import { FormSection, Input, Label } from '../utils/UIComponents';
import { SignaturePad } from "../signature-pad";
import languageData from '../i18n/language.json';

interface SignatureStepProps {
  formData: TaxFormData;
  handleChange: (section: keyof TaxFormData, field: string, value: any) => void;
  validationErrors?: Record<string, any> | null;
  hasError: (section: string, field: string) => boolean;
  getInputClass?: (section: string, field: string) => string;
  showValidationErrors?: boolean;
}

const SignatureStep: React.FC<SignatureStepProps> = ({
  formData,
  handleChange,
  validationErrors,
  hasError,
  getInputClass = () => "auth-input",
  showValidationErrors = false
}) => {
  // Common input class that handles validation state
  const getInputClassWithError = (section: string, field: string) => {
    const baseClass = getInputClass(section, field);
    return hasError(section, field) && showValidationErrors
      ? `${baseClass} border-2 border-red-500` 
      : baseClass;
  };

  // Make sure signature object is initialized
  React.useEffect(() => {
    // Initialize only if signature is null
    if (!formData.signature) {
      handleChange('signature', '', {
        place: '',
        date: '',
        signature: ''
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once

  console.log('Signature state:', formData.signature);

  return (
    <div className="space-y-6">
      {/* Declaration Section */}
      <FormSection germanTitle="Erklärung" englishTitle="Declaration">
        <div className="space-y-4 border rounded-md p-4 bg-neutral-50">
          {/* German Declaration */}
          <h3 className="font-['Switzer-Medium'] text-neutral-900 mb-4">Erklärung</h3>
          <div className="space-y-3">
            <p className="text-sm text-neutral-700">
              Ich versichere, dass ich die Angaben in dieser Steuererklärung wahrheitsgemäß nach bestem Wissen und Gewissen gemacht habe. Die beigefügten Unterlagen und Belege sind vollständig und authentisch. Mir ist bekannt, dass ich für falsche oder unterlassene Angaben strafrechtlich zur Verantwortung gezogen werden kann.
            </p>
            <p className="text-sm text-neutral-700">
              Ich stimme zu, dass meine Daten zum Zweck der Steuererklärung verarbeitet und gespeichert werden. Die Verarbeitung erfolgt unter Beachtung der geltenden Datenschutzbestimmungen.
            </p>
          </div>

          {/* English Declaration */}
          <h3 className="font-['Switzer-Medium'] text-neutral-900 mb-4 mt-6">Declaration</h3>
          <div className="space-y-3 text-sm text-neutral-700">
            <p>
              I declare that the information provided in this tax return is true and correct to the best of my knowledge and belief. All attached documents and receipts are complete and authentic. I understand that I may be held criminally liable for false or omitted information.
            </p>
            <p>
              I consent to my data being processed and stored for the purpose of tax return preparation. The processing will be carried out in compliance with applicable data protection regulations.
            </p>
          </div>
        </div>
      </FormSection>

      {/* Place and Date */}
      <FormSection germanTitle="Ort und Datum" englishTitle="Place and Date">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label 
              htmlFor="place"
              germanText={<div className="font-bold">{languageData.de.signature.place}</div>}
              englishText={<div className="text-neutral-600">{languageData.en.signature.place}</div>}
            />
            <input
              id="place"
              type="text"
              value={formData.signature?.place || ''}
              onChange={(e) => {
                handleChange('signature', 'place', e.target.value);
              }}
              className={`w-full px-3 py-2 border rounded-md ${getInputClassWithError('signature', 'place')}`}
              required
            />
            {hasError('signature', 'place') && showValidationErrors && (
              <p className="text-red-500 text-sm mt-1">
                {languageData.de.validation.required} / {languageData.en.validation.required}
              </p>
            )}
          </div>
          <div>
            <Label 
              htmlFor="date"
              germanText={<div className="font-bold">{languageData.de.signature.date}</div>}
              englishText={<div className="text-neutral-600">{languageData.en.signature.date}</div>}
            />
            <input
              id="date"
              type="date"
              value={formData.signature?.date || ''}
              onChange={(e) => {
                handleChange('signature', 'date', e.target.value);
              }}
              className={`w-full px-3 py-2 border rounded-md ${getInputClassWithError('signature', 'date')}`}
              required
            />
            {hasError('signature', 'date') && showValidationErrors && (
              <p className="text-red-500 text-sm mt-1">
                {languageData.de.validation.date} / {languageData.en.validation.date}
              </p>
            )}
          </div>
        </div>
      </FormSection>

      {/* Signature */}
      <FormSection germanTitle="Unterschrift" englishTitle="Signature">
        <div className="space-y-4">
          <SignaturePad
            onSave={(signatureData) => {
              handleChange('signature', 'signature', signatureData);
            }}
            initialValue={formData.signature?.signature || ''}
          />
          {hasError('signature', 'signature') && showValidationErrors && (
            <p className="text-red-500 text-sm">
              {languageData.de.validation.required} / {languageData.en.validation.required}
            </p>
          )}
        </div>
      </FormSection>
    </div>
  );
};

export default SignatureStep; 