import React from 'react';
import { Label, FormSection, Input, Select } from '../utils/UIComponents';
import { TaxFormData } from '../taxTypes';
import languageData from '../i18n/language.json';

interface PersonalInfoStepProps {
  formData: TaxFormData;
  handleChange: (section: keyof TaxFormData, field: string, value: any) => void;
  handleAddressChange: (field: string, value: string) => void;
  validationErrors: Record<string, any> | null;
  hasError: (section: string, field: string) => boolean;
  setFormData: React.Dispatch<React.SetStateAction<TaxFormData>>;
  onFormDataChange: (updatedFormData: TaxFormData) => void;
  showValidationErrors: boolean;
  getInputClass?: (section: string, field: string) => string;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  formData,
  handleChange,
  handleAddressChange,
  validationErrors,
  hasError,
  setFormData,
  onFormDataChange,
  showValidationErrors,
  getInputClass = () => "auth-input"
}) => {
  // List of countries for the dropdown
  const countries = [
    { code: 'de', name: 'Deutschland / Germany' },
    { code: 'at', name: 'Österreich / Austria' },
    { code: 'ch', name: 'Schweiz / Switzerland' },
    { code: 'fr', name: 'Frankreich / France' },
    { code: 'nl', name: 'Niederlande / Netherlands' },
    { code: 'be', name: 'Belgien / Belgium' },
    { code: 'lu', name: 'Luxemburg / Luxembourg' },
    { code: 'other', name: 'Andere / Other' }
  ];

  const maritalStatusOptions = [
    { value: 'single', label: 'Ledig / Single' },
    { value: 'married', label: 'Verheiratet / Married' },
    { value: 'divorced', label: 'Geschieden / Divorced' },
    { value: 'widowed', label: 'Verwitwet / Widowed' }
  ];

  const incomeTypeOptions = [
    { value: 'employment', label: 'Anstellung / Employment' },
    { value: 'selfEmployment', label: 'Selbständig / Self-Employment' },
    { value: 'pension', label: 'Rente / Pension' },
    { value: 'other', label: 'Sonstige / Other' }
  ];

  // Common input class that handles validation state
  const getInputClassWithError = (section: string, field: string) => {
    const baseClass = getInputClass(section, field);
    // Only show red border when there's an error and showValidationErrors is true
    return hasError(section, field) && showValidationErrors
      ? `${baseClass} border-2 border-red-500` 
      : baseClass;
  };

  // Helper function for address changes
  const handleAddressChangeHelper = (field: string, value: string) => {
    // Call the prop function to update address fields
    handleAddressChange(field, value);
    
    // Log the update for debugging
    console.log(`Updated address.${field} to: ${value}`);
  };

  // Helper function to check for child-specific errors
  const hasChildError = (field: string, index: number): boolean => {
    if (!showValidationErrors) return false;
    
    return (
      !!validationErrors?.personalInfo?.children &&
      !!validationErrors.personalInfo.children[index] &&
      !!validationErrors.personalInfo.children[index][field]
    );
  };

  const addChild = () => {
    const updatedChildren = [...(formData.personalInfo.children || [])];
    updatedChildren.push({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      taxId: ''
    });
    
    onFormDataChange({
      ...formData,
      personalInfo: {
        ...formData.personalInfo,
        childrenCount: (formData.personalInfo.childrenCount || 0) + 1,
        children: updatedChildren
      }
    });
  };

  const removeChild = (index: number) => {
    const updatedChildren = [...(formData.personalInfo.children || [])];
    updatedChildren.splice(index, 1);
    
    onFormDataChange({
      ...formData,
      personalInfo: {
        ...formData.personalInfo,
        childrenCount: (formData.personalInfo.childrenCount || 1) - 1,
        children: updatedChildren
      }
    });
  };

  return (
    <div>
      <FormSection 
        germanTitle={languageData.de.personalInfo.title} 
        englishTitle={languageData.en.personalInfo.title}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <Label 
              htmlFor="firstName"
              germanText={<div className="font-bold">{languageData.de.personalInfo.firstName}</div>}
              englishText={<div className="text-neutral-600">{languageData.en.personalInfo.firstName}</div>}
            />
            <Input
              id="firstName"
              type="text"
              value={formData.personalInfo.firstName}
              onChange={(e) => handleChange('personalInfo', 'firstName', e.target.value)}
              className={getInputClassWithError('personalInfo', 'firstName')}
              required
            />
            {hasError('personalInfo', 'firstName') && (
              <p className="text-red-500 text-sm mt-1">
                {typeof validationErrors?.personalInfo?.firstName === 'string' 
                  ? validationErrors.personalInfo.firstName 
                  : 'Dieses Feld ist erforderlich / This field is required'}
              </p>
            )}
          </div>
          
          <div className="form-group">
            <Label 
              htmlFor="lastName"
              germanText={<div className="font-bold">{languageData.de.personalInfo.lastName}</div>}
              englishText={<div className="text-neutral-600">{languageData.en.personalInfo.lastName}</div>}
            />
            <Input
              id="lastName"
              type="text"
              value={formData.personalInfo.lastName}
              onChange={(e) => handleChange('personalInfo', 'lastName', e.target.value)}
              className={getInputClassWithError('personalInfo', 'lastName')}
              required
            />
            {hasError('personalInfo', 'lastName') && (
              <p className="text-red-500 text-sm mt-1">
                {typeof validationErrors?.personalInfo?.lastName === 'string'
                  ? validationErrors.personalInfo.lastName
                  : 'Dieses Feld ist erforderlich / This field is required'}
              </p>
            )}
          </div>
          
          <div className="form-group">
            <Label 
              htmlFor="taxId"
              germanText={<div className="font-bold">{languageData.de.personalInfo.taxId}</div>}
              englishText={<div className="text-neutral-600">{languageData.en.personalInfo.taxId}</div>}
            />
            <Input
              id="taxId"
              type="text"
              value={formData.personalInfo.taxId}
              onChange={(e) => handleChange('personalInfo', 'taxId', e.target.value)}
              className={getInputClassWithError('personalInfo', 'taxId')}
              required
            />
            {hasError('personalInfo', 'taxId') && (
              <p className="text-red-500 text-sm mt-1">
                {typeof validationErrors?.personalInfo?.taxId === 'string'
                  ? validationErrors.personalInfo.taxId
                  : 'Bitte geben Sie eine gültige Steuer-ID ein / Please enter a valid tax ID'}
              </p>
            )}
          </div>
          
          <div className="form-group">
            <Label 
              htmlFor="dateOfBirth"
              germanText={<div className="font-bold">{languageData.de.personalInfo.dateOfBirth}</div>}
              englishText={<div className="text-neutral-600">{languageData.en.personalInfo.dateOfBirth}</div>}
            />
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.personalInfo.dateOfBirth}
              onChange={(e) => handleChange('personalInfo', 'dateOfBirth', e.target.value)}
              className={getInputClassWithError('personalInfo', 'dateOfBirth')}
              required
            />
            {hasError('personalInfo', 'dateOfBirth') && (
              <p className="text-red-500 text-sm mt-1">
                {typeof validationErrors?.personalInfo?.dateOfBirth === 'string'
                  ? validationErrors.personalInfo.dateOfBirth
                  : 'Bitte geben Sie ein gültiges Datum ein / Please enter a valid date'}
              </p>
            )}
          </div>
          
          <div className="form-group">
            <Label 
              htmlFor="maritalStatus"
              germanText={<div className="font-bold">{languageData.de.personalInfo.maritalStatus}</div>}
              englishText={<div className="text-neutral-600">{languageData.en.personalInfo.maritalStatus}</div>}
            />
            <Select
              id="maritalStatus"
              value={formData.personalInfo.maritalStatus || ''}
              onChange={(e) => handleChange('personalInfo', 'maritalStatus', e.target.value)}
            >
              <option value="">-- {languageData.de.common.select} / {languageData.en.common.select} --</option>
              {maritalStatusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            {hasError('personalInfo', 'maritalStatus') && (
              <p className="text-red-500 text-sm mt-1">
                {typeof validationErrors?.personalInfo?.maritalStatus === 'string'
                  ? validationErrors.personalInfo.maritalStatus
                  : 'Bitte wählen Sie einen Familienstand aus / Please select a marital status'}
              </p>
            )}
          </div>
        </div>
      </FormSection>

      {/* Address Section */}
      <FormSection 
        germanTitle={languageData.de.personalInfo.address.title} 
        englishTitle={languageData.en.personalInfo.address.title}
      >
        <div className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <Label 
                htmlFor="street"
                germanText={<div className="font-bold">{languageData.de.personalInfo.address.street}</div>}
                englishText={<div className="text-neutral-600">{languageData.en.personalInfo.address.street}</div>}
              />
              <Input
                id="street"
                type="text"
                value={formData.personalInfo.address.street}
                onChange={(e) => handleAddressChangeHelper('street', e.target.value)}
                className={getInputClassWithError('personalInfo', 'address.street')}
                required
              />
              {hasError('personalInfo', 'address.street') && (
                <p className="text-red-500 text-sm mt-1">
                  {typeof validationErrors?.personalInfo?.address?.street === 'string'
                    ? validationErrors.personalInfo.address.street
                    : 'Dieses Feld ist erforderlich / This field is required'}
                </p>
              )}
            </div>
            
            <div className="form-group">
              <Label 
                htmlFor="houseNumber"
                germanText={<div className="font-bold">{languageData.de.personalInfo.address.houseNumber}</div>}
                englishText={<div className="text-neutral-600">{languageData.en.personalInfo.address.houseNumber}</div>}
              />
              <Input
                id="houseNumber"
                type="text"
                value={formData.personalInfo.address.houseNumber}
                onChange={(e) => handleAddressChangeHelper('houseNumber', e.target.value)}
                className={getInputClassWithError('personalInfo', 'address.houseNumber')}
                required
              />
              {hasError('personalInfo', 'address.houseNumber') && (
                <p className="text-red-500 text-sm mt-1">
                  {typeof validationErrors?.personalInfo?.address?.houseNumber === 'string'
                    ? validationErrors.personalInfo.address.houseNumber
                    : 'Dieses Feld ist erforderlich / This field is required'}
                </p>
              )}
            </div>
            
            <div className="form-group">
              <Label 
                htmlFor="postalCode"
                germanText={<div className="font-bold">{languageData.de.personalInfo.address.postalCode}</div>}
                englishText={<div className="text-neutral-600">{languageData.en.personalInfo.address.postalCode}</div>}
              />
              <Input
                id="postalCode"
                type="text"
                value={formData.personalInfo.address.postalCode}
                onChange={(e) => handleAddressChangeHelper('postalCode', e.target.value)}
                className={getInputClassWithError('personalInfo', 'address.postalCode')}
                required
              />
              {hasError('personalInfo', 'address.postalCode') && (
                <p className="text-red-500 text-sm mt-1">
                  {typeof validationErrors?.personalInfo?.address?.postalCode === 'string'
                    ? validationErrors.personalInfo.address.postalCode
                    : 'Bitte geben Sie eine gültige Postleitzahl ein / Please enter a valid postal code'}
                </p>
              )}
            </div>
            
            <div className="form-group">
              <Label 
                htmlFor="city"
                germanText={<div className="font-bold">{languageData.de.personalInfo.address.city}</div>}
                englishText={<div className="text-neutral-600">{languageData.en.personalInfo.address.city}</div>}
              />
              <Input
                id="city"
                type="text"
                value={formData.personalInfo.address.city}
                onChange={(e) => handleAddressChangeHelper('city', e.target.value)}
                className={getInputClassWithError('personalInfo', 'address.city')}
                required
              />
              {hasError('personalInfo', 'address.city') && (
                <p className="text-red-500 text-sm mt-1">
                  {typeof validationErrors?.personalInfo?.address?.city === 'string'
                    ? validationErrors.personalInfo.address.city
                    : 'Dieses Feld ist erforderlich / This field is required'}
                </p>
              )}
            </div>
          </div>
        </div>
      </FormSection>

      {/* Foreign Residence Information */}
      <FormSection 
        germanTitle={languageData.de.personalInfo.foreignResidence.title} 
        englishTitle={languageData.en.personalInfo.foreignResidence.title}
      >
        <div className="mb-4">
          <div className="form-group">
            <Label 
              htmlFor="hasForeignResidence"
              germanText={<div className="font-bold">{languageData.de.personalInfo.foreignResidence.hasForeignResidence}</div>}
              englishText={<div className="text-neutral-600">{languageData.en.personalInfo.foreignResidence.hasForeignResidence}</div>}
            />
            <div className="flex space-x-4 mt-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="hasForeignResidenceNo"
                  name="hasForeignResidence"
                  checked={formData.personalInfo.hasForeignResidence === false}
                  onChange={() => handleChange('personalInfo', 'hasForeignResidence', false)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="hasForeignResidenceNo" className="ml-2 text-neutral-700">
                  <span className="font-bold">Nein</span> / <span className="text-neutral-600">No</span>
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="hasForeignResidenceYes"
                  name="hasForeignResidence"
                  checked={formData.personalInfo.hasForeignResidence === true}
                  onChange={() => handleChange('personalInfo', 'hasForeignResidence', true)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="hasForeignResidenceYes" className="ml-2 text-neutral-700">
                  <span className="font-bold">Ja</span> / <span className="text-neutral-600">Yes</span>
                </label>
              </div>
            </div>
            {hasError('personalInfo', 'hasForeignResidence') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.personalInfo?.hasForeignResidence}
              </p>
            )}
          </div>
          
          {formData.personalInfo.hasForeignResidence && (
            <div className="ml-6 space-y-4">
              <div className="form-group">
                <Label 
                  htmlFor="foreignResidenceCountry"
                  germanText={<div className="font-bold">{languageData.de.personalInfo.foreignResidence.country}</div>}
                  englishText={<div className="text-neutral-600">{languageData.en.personalInfo.foreignResidence.country}</div>}
                />
                <Select
                  id="foreignResidenceCountry"
                  value={formData.personalInfo.foreignResidenceCountry || ''}
                  onChange={(e) => handleChange('personalInfo', 'foreignResidenceCountry', e.target.value)}
                >
                  <option value="">-- {languageData.de.common.select} / {languageData.en.common.select} --</option>
                  {countries.map(country => (
                    <option key={country.code} value={country.code}>{country.name}</option>
                  ))}
                </Select>
                {hasError('personalInfo', 'foreignResidenceCountry') && (
                  <p className="text-red-500 text-sm mt-1">
                    {typeof validationErrors?.personalInfo?.foreignResidenceCountry === 'string'
                      ? validationErrors.personalInfo.foreignResidenceCountry
                      : 'Bitte wählen Sie ein Land aus / Please select a country'}
                  </p>
                )}
              </div>
              
              {formData.personalInfo.foreignResidenceCountry === 'other' && (
                <div className="form-group">
                  <Label 
                    htmlFor="otherForeignResidenceCountry"
                    germanText={<div className="font-bold">{languageData.de.personalInfo.foreignResidence.otherCountry}</div>}
                    englishText={<div className="text-neutral-600">{languageData.en.personalInfo.foreignResidence.otherCountry}</div>}
                  />
                  <Input
                    id="otherForeignResidenceCountry"
                    type="text"
                    value={formData.personalInfo.otherForeignResidenceCountry || ''}
                    onChange={(e) => handleChange('personalInfo', 'otherForeignResidenceCountry', e.target.value)}
                    className={getInputClassWithError('personalInfo', 'otherForeignResidenceCountry')}
                  />
                  {hasError('personalInfo', 'otherForeignResidenceCountry') && (
                    <p className="text-red-500 text-sm mt-1">
                      {typeof validationErrors?.personalInfo?.otherForeignResidenceCountry === 'string'
                        ? validationErrors.personalInfo.otherForeignResidenceCountry
                        : 'Bitte geben Sie ein Land ein / Please enter a country'}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </FormSection>

      {/* Spouse Information (Only shown if marital status is married) */}
      {formData.personalInfo.maritalStatus === 'married' && (
        <FormSection 
          germanTitle={languageData.de.personalInfo.spouse.title} 
          englishTitle={languageData.en.personalInfo.spouse.title}
        >
          <div className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <Label 
                  htmlFor="spouseFirstName"
                  germanText={<div className="font-bold">{languageData.de.personalInfo.spouse.firstName}</div>}
                  englishText={<div className="text-neutral-600">{languageData.en.personalInfo.spouse.firstName}</div>}
                />
                <Input
                  id="spouseFirstName"
                  type="text"
                  value={formData.personalInfo.spouseFirstName || ''}
                  onChange={(e) => handleChange('personalInfo', 'spouseFirstName', e.target.value)}
                  className={getInputClassWithError('personalInfo', 'spouseFirstName')}
                />
                {hasError('personalInfo', 'spouseFirstName') && (
                  <p className="text-red-500 text-sm mt-1">
                    {typeof validationErrors?.personalInfo?.spouseFirstName === 'string'
                      ? validationErrors.personalInfo.spouseFirstName
                      : 'Dieses Feld ist erforderlich / This field is required'}
                  </p>
                )}
              </div>
              
              <div className="form-group">
                <Label 
                  htmlFor="spouseLastName"
                  germanText={<div className="font-bold">{languageData.de.personalInfo.spouse.lastName}</div>}
                  englishText={<div className="text-neutral-600">{languageData.en.personalInfo.spouse.lastName}</div>}
                />
                <Input
                  id="spouseLastName"
                  type="text"
                  value={formData.personalInfo.spouseLastName || ''}
                  onChange={(e) => handleChange('personalInfo', 'spouseLastName', e.target.value)}
                  className={getInputClassWithError('personalInfo', 'spouseLastName')}
                />
                {hasError('personalInfo', 'spouseLastName') && (
                  <p className="text-red-500 text-sm mt-1">
                    {typeof validationErrors?.personalInfo?.spouseLastName === 'string'
                      ? validationErrors.personalInfo.spouseLastName
                      : 'Dieses Feld ist erforderlich / This field is required'}
                  </p>
                )}
              </div>
              
              <div className="form-group">
                <Label 
                  htmlFor="spouseDateOfBirth"
                  germanText={<div className="font-bold">{languageData.de.personalInfo.spouse.dateOfBirth}</div>}
                  englishText={<div className="text-neutral-600">{languageData.en.personalInfo.spouse.dateOfBirth}</div>}
                />
                <Input
                  id="spouseDateOfBirth"
                  type="date"
                  value={formData.personalInfo.spouseDateOfBirth || ''}
                  onChange={(e) => handleChange('personalInfo', 'spouseDateOfBirth', e.target.value)}
                  className={getInputClassWithError('personalInfo', 'spouseDateOfBirth')}
                />
                {hasError('personalInfo', 'spouseDateOfBirth') && (
                  <p className="text-red-500 text-sm mt-1">
                    {typeof validationErrors?.personalInfo?.spouseDateOfBirth === 'string'
                      ? validationErrors.personalInfo.spouseDateOfBirth
                      : 'Bitte geben Sie ein gültiges Datum ein / Please enter a valid date'}
                  </p>
                )}
              </div>
              
              <div className="form-group">
                <Label 
                  htmlFor="spouseTaxId"
                  germanText={<div className="font-bold">{languageData.de.personalInfo.spouse.taxId}</div>}
                  englishText={<div className="text-neutral-600">{languageData.en.personalInfo.spouse.taxId}</div>}
                />
                <Input
                  id="spouseTaxId"
                  type="text"
                  value={formData.personalInfo.spouseTaxId || ''}
                  onChange={(e) => handleChange('personalInfo', 'spouseTaxId', e.target.value)}
                  className={getInputClassWithError('personalInfo', 'spouseTaxId')}
                />
                {hasError('personalInfo', 'spouseTaxId') && (
                  <p className="text-red-500 text-sm mt-1">
                    {typeof validationErrors?.personalInfo?.spouseTaxId === 'string'
                      ? validationErrors.personalInfo.spouseTaxId
                      : 'Bitte geben Sie eine gültige Steuer-ID ein / Please enter a valid tax ID'}
                  </p>
                )}
              </div>
            </div>
            
            <div className="mt-4">
              <div className="form-group">
                <Label 
                  htmlFor="spouseHasIncome"
                  germanText={<div className="font-bold">{languageData.de.personalInfo.spouse.hasIncome}</div>}
                  englishText={<div className="text-neutral-600">{languageData.en.personalInfo.spouse.hasIncome}</div>}
                />
                <div className="flex space-x-4 mt-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="spouseHasIncomeNo"
                      name="spouseHasIncome"
                      checked={formData.personalInfo.spouseHasIncome === false}
                      onChange={() => handleChange('personalInfo', 'spouseHasIncome', false)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="spouseHasIncomeNo" className="ml-2 text-neutral-700">
                      <span className="font-bold">Nein</span> / <span className="text-neutral-600">No</span>
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="spouseHasIncomeYes"
                      name="spouseHasIncome"
                      checked={formData.personalInfo.spouseHasIncome === true}
                      onChange={() => handleChange('personalInfo', 'spouseHasIncome', true)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="spouseHasIncomeYes" className="ml-2 text-neutral-700">
                      <span className="font-bold">Ja</span> / <span className="text-neutral-600">Yes</span>
                    </label>
                  </div>
                </div>
                {hasError('personalInfo', 'spouseHasIncome') && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors?.personalInfo?.spouseHasIncome}
                  </p>
                )}
                
                {formData.personalInfo.spouseHasIncome && (
                  <div className="mt-2">
                    <Label 
                      htmlFor="spouseIncomeType"
                      germanText={<div className="font-bold">{languageData.de.personalInfo.spouse.incomeType}</div>}
                      englishText={<div className="text-neutral-600">{languageData.en.personalInfo.spouse.incomeType}</div>}
                    />
                    <Select
                      id="spouseIncomeType"
                      value={formData.personalInfo.spouseIncomeType || ''}
                      onChange={(e) => handleChange('personalInfo', 'spouseIncomeType', e.target.value)}
                    >
                      <option value="">-- {languageData.de.common.select} / {languageData.en.common.select} --</option>
                      {incomeTypeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                    {hasError('personalInfo', 'spouseIncomeType') && (
                      <p className="text-red-500 text-sm mt-1">
                        {typeof validationErrors?.personalInfo?.spouseIncomeType === 'string'
                          ? validationErrors.personalInfo.spouseIncomeType
                          : 'Bitte wählen Sie eine Einkommensart aus / Please select an income type'}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </FormSection>
      )}

      {/* Children Information */}
      <FormSection 
        germanTitle={languageData.de.personalInfo.children.title} 
        englishTitle={languageData.en.personalInfo.children.title}
      >
        <div>
          <div className="form-group">
            <Label 
              htmlFor="hasChildren"
              germanText={<div className="font-bold">{languageData.de.personalInfo.children.hasChildren}</div>}
              englishText={<div className="text-neutral-600">{languageData.en.personalInfo.children.hasChildren}</div>}
            />
            <div className="flex space-x-4 mt-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="hasChildrenNo"
                  name="hasChildren"
                  checked={formData.personalInfo.hasChildren === false}
                  onChange={() => handleChange('personalInfo', 'hasChildren', false)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="hasChildrenNo" className="ml-2 text-neutral-700">
                  <span className="font-bold">Nein</span> / <span className="text-neutral-600">No</span>
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="hasChildrenYes"
                  name="hasChildren"
                  checked={formData.personalInfo.hasChildren === true}
                  onChange={() => handleChange('personalInfo', 'hasChildren', true)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="hasChildrenYes" className="ml-2 text-neutral-700">
                  <span className="font-bold">Ja</span> / <span className="text-neutral-600">Yes</span>
                </label>
              </div>
            </div>
            {hasError('personalInfo', 'hasChildren') && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors?.personalInfo?.hasChildren}
              </p>
            )}
          </div>
          
          {formData.personalInfo.hasChildren && (
            <div className="mt-4 space-y-4">
              {formData.personalInfo.children?.map((child, index) => (
                <div key={index} className="p-4 border border-neutral-200 rounded-md mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-md font-medium">
                      <span className="font-bold">{languageData.de.personalInfo.children.title} {index + 1}</span> / <span className="text-neutral-600">{languageData.en.personalInfo.children.title} {index + 1}</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeChild(index)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      <span className="font-bold">{languageData.de.personalInfo.children.remove}</span> / <span className="text-neutral-600">{languageData.en.personalInfo.children.remove}</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <Label 
                        htmlFor={`child-${index}-firstName`}
                        germanText={<div className="font-bold">{languageData.de.personalInfo.children.firstName}</div>}
                        englishText={<div className="text-neutral-600">{languageData.en.personalInfo.children.firstName}</div>}
                      />
                      <Input
                        id={`child-${index}-firstName`}
                        type="text"
                        value={child.firstName || ''}
                        onChange={(e) => handleChange('personalInfo', `children.${index}.firstName`, e.target.value)}
                        className={getInputClassWithError('personalInfo', `children.${index}.firstName`)}
                        required
                      />
                      {hasChildError('firstName', index) && (
                        <p className="text-red-500 text-sm mt-1">
                          {typeof validationErrors?.personalInfo?.children?.[index]?.firstName === 'string'
                            ? validationErrors.personalInfo.children[index].firstName
                            : 'Dieses Feld ist erforderlich / This field is required'}
                        </p>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <Label 
                        htmlFor={`child-${index}-lastName`}
                        germanText={<div className="font-bold">{languageData.de.personalInfo.children.lastName}</div>}
                        englishText={<div className="text-neutral-600">{languageData.en.personalInfo.children.lastName}</div>}
                      />
                      <Input
                        id={`child-${index}-lastName`}
                        type="text"
                        value={child.lastName || ''}
                        onChange={(e) => handleChange('personalInfo', `children.${index}.lastName`, e.target.value)}
                        className={getInputClassWithError('personalInfo', `children.${index}.lastName`)}
                        required
                      />
                      {hasChildError('lastName', index) && (
                        <p className="text-red-500 text-sm mt-1">
                          {typeof validationErrors?.personalInfo?.children?.[index]?.lastName === 'string'
                            ? validationErrors.personalInfo.children[index].lastName
                            : 'Dieses Feld ist erforderlich / This field is required'}
                        </p>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <Label 
                        htmlFor={`child-${index}-dateOfBirth`}
                        germanText={<div className="font-bold">{languageData.de.personalInfo.children.dateOfBirth}</div>}
                        englishText={<div className="text-neutral-600">{languageData.en.personalInfo.children.dateOfBirth}</div>}
                      />
                      <Input
                        id={`child-${index}-dateOfBirth`}
                        type="date"
                        value={child.dateOfBirth || ''}
                        onChange={(e) => handleChange('personalInfo', `children.${index}.dateOfBirth`, e.target.value)}
                        className={getInputClassWithError('personalInfo', `children.${index}.dateOfBirth`)}
                        required
                      />
                      {hasChildError('dateOfBirth', index) && (
                        <p className="text-red-500 text-sm mt-1">
                          {typeof validationErrors?.personalInfo?.children?.[index]?.dateOfBirth === 'string'
                            ? validationErrors.personalInfo.children[index].dateOfBirth
                            : 'Bitte geben Sie ein gültiges Datum ein / Please enter a valid date'}
                        </p>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <Label 
                        htmlFor={`child-${index}-taxId`}
                        germanText={<div className="font-bold">{languageData.de.personalInfo.children.taxId}</div>}
                        englishText={<div className="text-neutral-600">{languageData.en.personalInfo.children.taxId}</div>}
                      />
                      <Input
                        id={`child-${index}-taxId`}
                        type="text"
                        value={child.taxId || ''}
                        onChange={(e) => handleChange('personalInfo', `children.${index}.taxId`, e.target.value)}
                        className={getInputClassWithError('personalInfo', `children.${index}.taxId`)}
                        required
                      />
                      {hasChildError('taxId', index) && (
                        <p className="text-red-500 text-sm mt-1">
                          {typeof validationErrors?.personalInfo?.children?.[index]?.taxId === 'string'
                            ? validationErrors.personalInfo.children[index].taxId
                            : 'Bitte geben Sie eine gültige Steuer-ID ein / Please enter a valid tax ID'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="mt-4">
                <button
                  type="button"
                  onClick={addChild}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span className="font-bold">{languageData.de.personalInfo.children.add}</span> / <span className="text-neutral-100">{languageData.en.personalInfo.children.add}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </FormSection>
    </div>
  );
};

export default PersonalInfoStep;