import React from 'react';
//import { TaxFormData } from './taxTypes';
import TaxReturnForm from './BaseForm';
import languageData from './i18n/language.json';
const TaxReturnPage: React.FC = () => {
  // const handleSubmit = (data: TaxFormData) => {
  //   console.log('Form submitted:', data);
  //   // Here you would typically send the data to your backend
  //   // For example: axios.post('/api/tax-returns', data)
  // };
  
  return (
    <div className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium text-neutral-900">
            {languageData.de.title} / {languageData.en.title}
          </h1>
          <p className="mt-2 text-lg text-neutral-600">
            {languageData.de.completeForm} / {languageData.en.completeForm}
          </p>
        </div>
        
        <TaxReturnForm />
      </div>
    </div>
  );
};

export default TaxReturnPage;
