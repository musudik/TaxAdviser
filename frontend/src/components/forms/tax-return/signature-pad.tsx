import React, { useEffect, useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '././utils/UIComponents';

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
      // Small delay to ensure the canvas is ready
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
      onSave(''); // Clear the saved signature
    }
  };

  const handleSave = () => {
    if (signatureRef.current) {
      if (signatureRef.current.isEmpty()) {
        alert('Please sign before saving');
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

  // Auto-save signature when canvas is updated
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
        <Button
          type="button"
          onClick={handleClear}
          className="flex-1 border border-gray-300 hover:bg-gray-100"
        >
          Clear
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          className={`flex-1 ${isSigned ? 'bg-[#7c3aed] hover:bg-[#6d28d9] text-white' : 'bg-gray-300 hover:bg-gray-400 text-gray-700'}`}
          disabled={!isSigned}
        >
          Save Signature
        </Button>
      </div>
      {dataURL && (
        <div className="mt-2 text-sm text-green-600">
          Signature saved ✓
        </div>
      )}
    </div>
  );
}; 