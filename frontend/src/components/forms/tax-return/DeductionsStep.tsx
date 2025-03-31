// import React from 'react';
// import { Label, FormSection, Input } from '../utils/UIComponents';
// import { TaxFormData } from '../taxTypes';
// import languageData from '../i18n/language.json';

// interface DeductionsStepProps {
//   formData: TaxFormData;
//   handleChange: (section: keyof TaxFormData, field: string, value: any) => void;
//   validationErrors: Record<string, any> | null;
//   hasError: (section: string, field: string) => boolean;
//   getInputClass?: (section: string, field: string) => string;
// }

// const DeductionsStep: React.FC<DeductionsStepProps> = ({
//   formData,
//   handleChange,
//   validationErrors,
//   hasError,
//   getInputClass = () => "auth-input"
// }) => {
//   // Common input class that handles validation state
//   const getInputClassWithError = (section: string, field: string) => {
//     return hasError(section, field) 
//       ? `border-red-500` 
//       : '';
//   };

//   // Helper function for number fields to convert string to number safely
//   const handleNumberChange = (section: keyof TaxFormData, field: string, value: string) => {
//     const parsedValue = value === '' ? null : parseFloat(value);
//     handleChange(section, field, parsedValue);
//   };

//   return (
//     <div>
//       <FormSection 
//         germanTitle={languageData.de.deductions.workRelatedExpenses}
//         englishTitle={languageData.en.deductions.workRelatedExpenses}
//       >
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* Commuting Expenses */}
//           <div className="form-group">
//             <Label 
//               htmlFor="commutingExpenses"
//               germanText={<div className="font-bold">{languageData.de.deductions.commutingExpenses}</div>}
//               englishText={<div className="text-neutral-600">{languageData.en.deductions.commutingExpenses}</div>}
//             />
//             <Input
//               id="commutingExpenses"
//               type="number"
//               min={0}
//               step={0.01}
//               value={formData.deductions.commutingExpenses || ''}
//               onChange={(e) => handleNumberChange('deductions', 'commutingExpenses', e.target.value)}
//               className={getInputClassWithError('deductions', 'commutingExpenses')}
//             />
//             {hasError('deductions', 'commutingExpenses') && (
//               <p className="text-red-500 text-sm mt-1">
//                 {validationErrors?.deductions?.commutingExpenses}
//               </p>
//             )}
//           </div>
        
//           {/* Business Trip Costs */}
//           <div className="form-group">
//             <Label 
//               htmlFor="businessTripsCosts"
//               germanText={<div className="font-bold">{languageData.de.deductions.businessTripsCosts}</div>}
//               englishText={<div className="text-neutral-600">{languageData.en.deductions.businessTripsCosts}</div>}
//             />
//             <Input
//               id="businessTripsCosts"
//               type="number"
//               min={0}
//               step={0.01}
//               value={formData.deductions.businessTripsCosts || ''}
//               onChange={(e) => handleNumberChange('deductions', 'businessTripsCosts', e.target.value)}
//               className={getInputClassWithError('deductions', 'businessTripsCosts')}
//             />
//             {hasError('deductions', 'businessTripsCosts') && (
//               <p className="text-red-500 text-sm mt-1">
//                 {validationErrors?.deductions?.businessTripsCosts}
//               </p>
//             )}
//           </div>
        
//           {/* Work Equipment */}
//           <div className="form-group">
//             <Label 
//               htmlFor="workEquipment"
//               germanText={<div className="font-bold">{languageData.de.deductions.workEquipment}</div>}
//               englishText={<div className="text-neutral-600">{languageData.en.deductions.workEquipment}</div>}
//             />
//             <Input
//               id="workEquipment"
//               type="number"
//               min={0}
//               step={0.01}
//               value={formData.deductions.workEquipment || ''}
//               onChange={(e) => handleNumberChange('deductions', 'workEquipment', e.target.value)}
//               className={getInputClassWithError('deductions', 'workEquipment')}
//             />
//             {hasError('deductions', 'workEquipment') && (
//               <p className="text-red-500 text-sm mt-1">
//                 {validationErrors?.deductions?.workEquipment}
//               </p>
//             )}
//           </div>
        
//           {/* Home Office Allowance */}
//           <div className="form-group">
//             <Label 
//               htmlFor="homeOfficeAllowance"
//               germanText={<div className="font-bold">{languageData.de.deductions.homeOfficeAllowance}</div>}
//               englishText={<div className="text-neutral-600">{languageData.en.deductions.homeOfficeAllowance}</div>}
//             />
//             <Input
//               id="homeOfficeAllowance"
//               type="number"
//               min={0}
//               step={0.01}
//               value={formData.deductions.homeOfficeAllowance || ''}
//               onChange={(e) => handleNumberChange('deductions', 'homeOfficeAllowance', e.target.value)}
//               className={getInputClassWithError('deductions', 'homeOfficeAllowance')}
//             />
//             {hasError('deductions', 'homeOfficeAllowance') && (
//               <p className="text-red-500 text-sm mt-1">
//                 {validationErrors?.deductions?.homeOfficeAllowance}
//               </p>
//             )}
//           </div>
//         </div>
//       </FormSection>
      
//       <FormSection 
//         germanTitle={languageData.de.deductions.specialExpenses}
//         englishTitle={languageData.en.deductions.specialExpenses}
//         className="mt-6"
//       >
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* Has Special Expenses Detailed */}
//           <div className="form-group col-span-2">
//             <Label 
//               htmlFor="hasSpecialExpensesDetailed"
//               germanText={<div className="font-bold">{languageData.de.deductions.hasSpecialExpensesDetailed}</div>}
//               englishText={<div className="text-neutral-600">{languageData.en.deductions.hasSpecialExpensesDetailed}</div>}
//             />
//             <div className="flex space-x-4 mt-2">
//               <div className="flex items-center">
//                 <input
//                   type="radio"
//                   id="hasSpecialExpensesDetailedNo"
//                   name="hasSpecialExpensesDetailed"
//                   checked={formData.deductions.hasSpecialExpensesDetailed === false}
//                   onChange={() => handleChange('deductions', 'hasSpecialExpensesDetailed', false)}
//                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                 />
//                 <label htmlFor="hasSpecialExpensesDetailedNo" className="ml-2 text-neutral-700">
//                   <span className="font-bold">Nein</span> / <span className="text-neutral-600">No</span>
//                 </label>
//               </div>
//               <div className="flex items-center">
//                 <input
//                   type="radio"
//                   id="hasSpecialExpensesDetailedYes"
//                   name="hasSpecialExpensesDetailed"
//                   checked={formData.deductions.hasSpecialExpensesDetailed === true}
//                   onChange={() => handleChange('deductions', 'hasSpecialExpensesDetailed', true)}
//                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                 />
//                 <label htmlFor="hasSpecialExpensesDetailedYes" className="ml-2 text-neutral-700">
//                   <span className="font-bold">Ja</span> / <span className="text-neutral-600">Yes</span>
//                 </label>
//               </div>
//             </div>
//             {hasError('deductions', 'hasSpecialExpensesDetailed') && (
//               <p className="text-red-500 text-sm mt-1">
//                 {validationErrors?.deductions?.hasSpecialExpensesDetailed}
//               </p>
//             )}
//           </div>
          
//           {/* Special expenses details if selected Yes */}
//           {formData.deductions.hasSpecialExpensesDetailed && (
//             <>
//               <div className="form-group">
//                 <Label 
//                   htmlFor="specialExpensesType"
//                   germanText={<div className="font-bold">{languageData.de.deductions.specialExpensesType}</div>}
//                   englishText={<div className="text-neutral-600">{languageData.en.deductions.specialExpensesType}</div>}
//                 />
//                 <Input
//                   id="specialExpensesType"
//                   type="text"
//                   value={formData.deductions.specialExpensesType || ''}
//                   onChange={(e) => handleChange('deductions', 'specialExpensesType', e.target.value)}
//                   className={getInputClassWithError('deductions', 'specialExpensesType')}
//                 />
//                 {hasError('deductions', 'specialExpensesType') && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {validationErrors?.deductions?.specialExpensesType}
//                   </p>
//                 )}
//               </div>
              
//               <div className="form-group">
//                 <Label 
//                   htmlFor="specialExpensesAmount"
//                   germanText={<div className="font-bold">{languageData.de.deductions.specialExpensesAmount}</div>}
//                   englishText={<div className="text-neutral-600">{languageData.en.deductions.specialExpensesAmount}</div>}
//                 />
//                 <Input
//                   id="specialExpensesAmount"
//                   type="number"
//                   min={0}
//                   step={0.01}
//                   value={formData.deductions.specialExpensesAmount || ''}
//                   onChange={(e) => handleNumberChange('deductions', 'specialExpensesAmount', e.target.value)}
//                   className={getInputClassWithError('deductions', 'specialExpensesAmount')}
//                 />
//                 {hasError('deductions', 'specialExpensesAmount') && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {validationErrors?.deductions?.specialExpensesAmount}
//                   </p>
//                 )}
//               </div>
//             </>
//           )}
          
//           {/* Church Tax and Donations (existing fields) */}
//           <div className="form-group">
//             <Label 
//               htmlFor="churchTax"
//               germanText={<div className="font-bold">{languageData.de.deductions.churchTax}</div>}
//               englishText={<div className="text-neutral-600">{languageData.en.deductions.churchTax}</div>}
//             />
//             <Input
//               id="churchTax"
//               type="number"
//               min={0}
//               step={0.01}
//               value={formData.deductions.churchTax || ''}
//               onChange={(e) => handleNumberChange('deductions', 'churchTax', e.target.value)}
//               className={getInputClassWithError('deductions', 'churchTax')}
//             />
//             {hasError('deductions', 'churchTax') && (
//               <p className="text-red-500 text-sm mt-1">
//                 {validationErrors?.deductions?.churchTax}
//               </p>
//             )}
//           </div>
          
//           <div className="form-group">
//             <Label 
//               htmlFor="donationsAndFees"
//               germanText={<div className="font-bold">{languageData.de.deductions.donationsAndFees}</div>}
//               englishText={<div className="text-neutral-600">{languageData.en.deductions.donationsAndFees}</div>}
//             />
//             <Input
//               id="donationsAndFees"
//               type="number"
//               min={0}
//               step={0.01}
//               value={formData.deductions.donationsAndFees || ''}
//               onChange={(e) => handleNumberChange('deductions', 'donationsAndFees', e.target.value)}
//               className={getInputClassWithError('deductions', 'donationsAndFees')}
//             />
//             {hasError('deductions', 'donationsAndFees') && (
//               <p className="text-red-500 text-sm mt-1">
//                 {validationErrors?.deductions?.donationsAndFees}
//               </p>
//             )}
//           </div>
//         </div>
//       </FormSection>
      
//       <FormSection 
//         germanTitle={languageData.de.deductions.insurancePremiums}
//         englishTitle={languageData.en.deductions.insurancePremiums}
//         className="mt-6"
//       >
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* Has Private Insurance */}
//           <div className="form-group col-span-2">
//             <Label 
//               htmlFor="hasPrivateInsurance"
//               germanText={<div className="font-bold">{languageData.de.deductions.hasPrivateInsurance}</div>}
//               englishText={<div className="text-neutral-600">{languageData.en.deductions.hasPrivateInsurance}</div>}
//             />
//             <div className="flex space-x-4 mt-2">
//               <div className="flex items-center">
//                 <input
//                   type="radio"
//                   id="hasPrivateInsuranceNo"
//                   name="hasPrivateInsurance"
//                   checked={formData.deductions.hasPrivateInsurance === false}
//                   onChange={() => handleChange('deductions', 'hasPrivateInsurance', false)}
//                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                 />
//                 <label htmlFor="hasPrivateInsuranceNo" className="ml-2 text-neutral-700">
//                   <span className="font-bold">Nein</span> / <span className="text-neutral-600">No</span>
//                 </label>
//               </div>
//               <div className="flex items-center">
//                 <input
//                   type="radio"
//                   id="hasPrivateInsuranceYes"
//                   name="hasPrivateInsurance"
//                   checked={formData.deductions.hasPrivateInsurance === true}
//                   onChange={() => handleChange('deductions', 'hasPrivateInsurance', true)}
//                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                 />
//                 <label htmlFor="hasPrivateInsuranceYes" className="ml-2 text-neutral-700">
//                   <span className="font-bold">Ja</span> / <span className="text-neutral-600">Yes</span>
//                 </label>
//               </div>
//             </div>
//             {hasError('deductions', 'hasPrivateInsurance') && (
//               <p className="text-red-500 text-sm mt-1">
//                 {validationErrors?.deductions?.hasPrivateInsurance}
//               </p>
//             )}
//           </div>
          
//           {/* Private insurance details if selected Yes */}
//           {formData.deductions.hasPrivateInsurance && (
//             <>
//               <div className="form-group">
//                 <Label 
//                   htmlFor="insuranceTypes"
//                   germanText={<div className="font-bold">{languageData.de.deductions.insuranceTypes}</div>}
//                   englishText={<div className="text-neutral-600">{languageData.en.deductions.insuranceTypes}</div>}
//                 />
//                 <Input
//                   id="insuranceTypes"
//                   type="text"
//                   value={formData.deductions.insuranceTypes || ''}
//                   onChange={(e) => handleChange('deductions', 'insuranceTypes', e.target.value)}
//                   className={getInputClassWithError('deductions', 'insuranceTypes')}
//                 />
//                 {hasError('deductions', 'insuranceTypes') && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {validationErrors?.deductions?.insuranceTypes}
//                   </p>
//                 )}
//               </div>
              
//               <div className="form-group">
//                 <Label 
//                   htmlFor="insuranceContributions"
//                   germanText={<div className="font-bold">{languageData.de.deductions.insuranceContributions}</div>}
//                   englishText={<div className="text-neutral-600">{languageData.en.deductions.insuranceContributions}</div>}
//                 />
//                 <Input
//                   id="insuranceContributions"
//                   type="number"
//                   min={0}
//                   step={0.01}
//                   value={formData.deductions.insuranceContributions || ''}
//                   onChange={(e) => handleNumberChange('deductions', 'insuranceContributions', e.target.value)}
//                   className={getInputClassWithError('deductions', 'insuranceContributions')}
//                 />
//                 {hasError('deductions', 'insuranceContributions') && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {validationErrors?.deductions?.insuranceContributions}
//                   </p>
//                 )}
//               </div>
//             </>
//           )}
          
//           {/* Health Insurance and Pension Insurance (existing fields) */}
//           <div className="form-group">
//             <Label 
//               htmlFor="privateHealthInsurance"
//               germanText={<div className="font-bold">{languageData.de.deductions.privateHealthInsurance}</div>}
//               englishText={<div className="text-neutral-600">{languageData.en.deductions.privateHealthInsurance}</div>}
//             />
//             <Input
//               id="privateHealthInsurance"
//               type="number"
//               min={0}
//               step={0.01}
//               value={formData.deductions.privateHealthInsurance || ''}
//               onChange={(e) => handleNumberChange('deductions', 'privateHealthInsurance', e.target.value)}
//               className={getInputClassWithError('deductions', 'privateHealthInsurance')}
//             />
//             {hasError('deductions', 'privateHealthInsurance') && (
//               <p className="text-red-500 text-sm mt-1">
//                 {validationErrors?.deductions?.privateHealthInsurance}
//               </p>
//             )}
//           </div>
          
//           <div className="form-group">
//             <Label 
//               htmlFor="privatePensionInsurance"
//               germanText={<div className="font-bold">{languageData.de.deductions.privatePensionInsurance}</div>}
//               englishText={<div className="text-neutral-600">{languageData.en.deductions.privatePensionInsurance}</div>}
//             />
//             <Input
//               id="privatePensionInsurance"
//               type="number"
//               min={0}
//               step={0.01}
//               value={formData.deductions.privatePensionInsurance || ''}
//               onChange={(e) => handleNumberChange('deductions', 'privatePensionInsurance', e.target.value)}
//               className={getInputClassWithError('deductions', 'privatePensionInsurance')}
//             />
//             {hasError('deductions', 'privatePensionInsurance') && (
//               <p className="text-red-500 text-sm mt-1">
//                 {validationErrors?.deductions?.privatePensionInsurance}
//               </p>
//             )}
//           </div>
//         </div>
//       </FormSection>
//     </div>
//   );
// };

// export default DeductionsStep; 