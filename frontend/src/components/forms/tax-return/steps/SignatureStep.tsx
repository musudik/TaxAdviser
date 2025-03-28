import React from 'react';
import { TaxFormData } from '../taxTypes';
import { FormSection, Input, Label } from '../utils/UIComponents';
import { SignaturePad } from "../signature-pad";

interface SignatureStepProps {
  formData: TaxFormData;
  handleChange: (section: keyof TaxFormData, field: string, value: any) => void;
  validationErrors?: Record<string, any> | null;
  showValidationErrors?: boolean;
}

const SignatureStep: React.FC<SignatureStepProps> = ({
  formData,
  handleChange,
  validationErrors,
  showValidationErrors,
}) => {
  const hasError = (field: string) => {
    return showValidationErrors && validationErrors?.signature?.[field];
  };

  // Common input class that handles validation state
  const getInputClass = (field: string) => {
    return hasError(field) 
      ? "auth-input border-red-500" 
      : "auth-input";
  };

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label 
              htmlFor="place"
              germanText={<div className="font-bold">Ort</div>}
              englishText={<div className="text-neutral-600">Place</div>}
            />
            <Input
              value={formData.signature?.place || ''}
              onChange={(e) => handleChange('signature', 'place', e.target.value)}
              className={getInputClass('place')}
            />
            {hasError('place') && (
              <p className="text-red-500 text-sm mt-1 font-['Switzer-Regular']">This field is required</p>
            )}
          </div>
          <div>
            <Label 
              htmlFor="date"
              germanText={<div className="font-bold">Datum</div>}
              englishText={<div className="text-neutral-600">Date</div>}
            />
            <Input
              type="date"
              value={formData.signature?.date || ''}
              onChange={(e) => handleChange('signature', 'date', e.target.value)}
              className={getInputClass('date')}
            />
            {hasError('date') && (
              <p className="text-red-500 text-sm mt-1 font-['Switzer-Regular']">This field is required</p>
            )}
          </div>
          <div>
            <Label 
              htmlFor="time"
              germanText={<div className="font-bold">Uhrzeit</div>}
              englishText={<div className="text-neutral-600">Time</div>}
            />
            <Input
              type="time"
              value={formData.signature?.time || ''}
              onChange={(e) => handleChange('signature', 'time', e.target.value)}
              className={getInputClass('time')}
            />
            {hasError('time') && (
              <p className="text-red-500 text-sm mt-1 font-['Switzer-Regular']">This field is required</p>
            )}
          </div>
        </div>
      </FormSection>

      {/* Signature */}
      <FormSection germanTitle="Unterschrift" englishTitle="Signature">
        <div className="space-y-4">
          <SignaturePad
            onSave={(signatureData) => handleChange('signature', 'signature', signatureData)}
            initialValue={formData.signature?.signature || ''}
          />
          {hasError('signature') && (
            <p className="text-red-500 text-sm font-['Switzer-Regular']">Signature is required</p>
          )}
        </div>
      </FormSection>
    </div>
  );
};

export default SignatureStep; 