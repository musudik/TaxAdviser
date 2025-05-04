import axios from 'axios';
import { LoginCredentials, RegisterData, AuthResponse, User, UserRole } from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL || 'https://tax-adviser-backend.onrender.com/api';

const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  }
};

export default authService;