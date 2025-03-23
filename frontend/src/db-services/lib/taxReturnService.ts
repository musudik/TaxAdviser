import { TaxFormData } from '@/components/forms/tax-return/taxTypes';
import axios from 'axios';

// API base URL - Use import.meta.env for Vite instead of process.env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Saves a tax return form to the database
 * @param formData The tax return form data
 * @param partnerId The partner ID
 * @returns The ID of the saved form
 */
export const saveTaxReturnForm = async (formData: TaxFormData, partnerId: string): Promise<string> => {
  try {
    // Ensure the data matches the DTO structure exactly
    const payload = {
      clientId: formData.clientId || '',
      partnerId: partnerId,
      status: 'submitted',
      type: formData.type || 'standard',
      personalInfo: formData.personalInfo,
      children: formData.children || [],
      incomeInfo: {
        ...formData.incomeInfo,
        isEmployed: formData.incomeInfo.isEmployed === undefined ? false : formData.incomeInfo.isEmployed,
        isBusinessOwner: formData.incomeInfo.isBusinessOwner === undefined ? false : formData.incomeInfo.isBusinessOwner,
        hasStockIncome: formData.incomeInfo.hasStockIncome === undefined ? false : formData.incomeInfo.hasStockIncome,
        hasRentalProperty: formData.incomeInfo.hasRentalProperty === undefined ? false : formData.incomeInfo.hasRentalProperty,
        hasForeignIncome: formData.incomeInfo.hasForeignIncome === undefined ? false : formData.incomeInfo.hasForeignIncome
      },
      deductions: formData.deductions,
      taxCredits: formData.taxCredits,
      signature: formData.signature || null,
      submittedAt: new Date().toISOString()
    };

    console.log('Submitting tax return form with payload:', JSON.stringify(payload));

    // Make API call to save the tax return
    const response = await axios.post(`${API_BASE_URL}/tax-returns`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Return the ID of the saved form
    return response.data.id;
  } catch (error) {
    console.error('Error saving tax return form:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', error.response.data);
        throw new Error(`Failed to save tax return form: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response received from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error(`Request setup error: ${error.message}`);
      }
    }
    
    throw new Error('Failed to save tax return form');
  }
};

/**
 * Gets a tax return form by ID
 * @param formId The ID of the form to get
 * @returns The tax return form data
 */
export const getTaxReturnForm = async (formId: string): Promise<TaxFormData> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tax-returns/${formId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting tax return form:', error);
    throw new Error('Failed to get tax return form');
  }
};

/**
 * Gets all tax return forms for a client
 * @param clientId The client ID
 * @returns Array of tax return forms
 */
export const getClientTaxReturnForms = async (clientId: string): Promise<TaxFormData[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tax-returns/client/${clientId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting client tax return forms:', error);
    throw new Error('Failed to get client tax return forms');
  }
};

/**
 * Gets all tax return forms for a partner
 * @param partnerId The partner ID
 * @returns Array of tax return forms
 */
export const getPartnerTaxReturnForms = async (partnerId: string): Promise<TaxFormData[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tax-returns/partner/${partnerId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting partner tax return forms:', error);
    throw new Error('Failed to get partner tax return forms');
  }
};

/**
 * Updates a tax return form
 * @param formId The ID of the form to update
 * @param formData The updated form data
 * @returns The updated tax return form
 */
export const updateTaxReturnForm = async (formId: string, formData: Partial<TaxFormData>): Promise<TaxFormData> => {
  try {
    const payload = {
      ...formData,
      updatedAt: new Date().toISOString()
    };
    
    const response = await axios.put(`${API_BASE_URL}/tax-returns/${formId}`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating tax return form:', error);
    throw new Error('Failed to update tax return form');
  }
};

/**
 * Deletes a tax return form
 * @param formId The ID of the form to delete
 * @returns A success message
 */
export const deleteTaxReturnForm = async (formId: string): Promise<{ message: string }> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/tax-returns/${formId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting tax return form:', error);
    throw new Error('Failed to delete tax return form');
  }
}; 