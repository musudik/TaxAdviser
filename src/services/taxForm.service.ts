import axios from 'axios';
import { TaxForm, TaxFormResponse } from '../types/taxForm';

const API_URL = `${import.meta.env.VITE_API_URL}/tax-forms`;

// Helper to get the auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// ... existing code ... 