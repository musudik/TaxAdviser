import React, { useEffect, useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

interface SignaturePadProps {
  onSave: (signatureData: string) => void;
  initialValue?: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, initialValue }) => {
  const signatureRef = useRef<SignatureCanvas | null>(null);
  const [isSigned, setIsSigned] = useState(false);
  const [dataURL, setDataURL] = useState<string>(initialValue || '');

  // Load initial value if provided
  useEffect(() => {
    if (initialValue && signatureRef.current) {
      const img = new Image();
      img.onload = () => {
        if (signatureRef.current) {
          const ctx = signatureRef.current.getCanvas().getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            setIsSigned(true);
            setDataURL(initialValue);
          }
        }
      };
      img.src = initialValue;
    }
  }, [initialValue]);

  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setIsSigned(false);
      setDataURL('');
      onSave('');
    }
  };

  const handleSave = () => {
    if (signatureRef.current) {
      if (signatureRef.current.isEmpty()) {
        alert('Bitte unterschreiben Sie / Please sign before saving');
        return;
      }
      
      const newDataURL = signatureRef.current.toDataURL('image/png');
      setDataURL(newDataURL);
      onSave(newDataURL);
      setIsSigned(true);
    }
  };

  const handleBegin = () => {
    setIsSigned(true);
  };

  const handleEnd = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      const newDataURL = signatureRef.current.toDataURL('image/png');
      setDataURL(newDataURL);
      onSave(newDataURL);
    }
  };

  return (
    <div className="signature-pad-container">
      <div className="border rounded-md p-1 mb-2 bg-white">
        <SignatureCanvas
          ref={signatureRef}
          penColor="black"
          canvasProps={{
            className: "signature-canvas w-full h-44",
            style: { 
              width: '100%', 
              height: '11rem',
              backgroundColor: 'white'
            }
          }}
          onBegin={handleBegin}
          onEnd={handleEnd}
        />
      </div>
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={handleClear}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Löschen / Clear
        </button>
        <button
          type="button"
          onClick={handleSave}
          className={`flex-1 px-4 py-2 border rounded-md text-sm font-medium ${
            isSigned 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 border-transparent' 
              : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          disabled={!isSigned}
        >
          Unterschrift speichern / Save Signature
        </button>
      </div>
      {dataURL && (
        <div className="mt-2 text-sm text-green-600">
          Unterschrift gespeichert / Signature saved ✓
        </div>
      )}
    </div>
  );
}; 