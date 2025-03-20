import axios from 'axios';
import { LoginCredentials, RegisterData, AuthResponse, User, UserRole } from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Function to decode JWT token
const decodeToken = (token: string): Partial<User> => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  const payload = JSON.parse(jsonPayload);
  
  return {
    id: payload.sub,
    email: payload.email,
  };
};

// Function to fetch user details
const fetchUserDetails = async (token: string): Promise<User> => {
  try {
    const response = await axios.get(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    // If we can't fetch user details, return a basic user object with the role from the token
    const partialUser = decodeToken(token);
    return {
      id: partialUser.id!,
      email: partialUser.email!,
      firstName: '',
      lastName: '',
      role: UserRole.CLIENT, // Default role
      isEmailVerified: false,
      isMfaEnabled: false,
    };
  }
};

const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    const { access_token } = response.data;
    
    if (access_token) {
      localStorage.setItem('token', access_token);
      // Decode the token to get initial user info
      const partialUser = decodeToken(access_token);
      // Fetch complete user details including role
      const user = await fetchUserDetails(access_token);
      return { access_token, user };
    }
    
    throw new Error('No access token received');
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    const { access_token } = response.data;
    
    if (access_token) {
      localStorage.setItem('token', access_token);
      // Decode the token to get initial user info
      const partialUser = decodeToken(access_token);
      // Fetch complete user details including role
      const user = await fetchUserDetails(access_token);
      return { access_token, user };
    }
    
    throw new Error('No access token received');
  },

  logout(): void {
    localStorage.removeItem('token');
  },

  getCurrentUser(): string | null {
    return localStorage.getItem('token');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  async googleLogin(): Promise<void> {
    window.location.href = `${API_URL}/auth/google`;
  },

  async microsoftLogin(): Promise<void> {
    window.location.href = `${API_URL}/auth/microsoft`;
  },

  async enableMfa(token: string, secret: string): Promise<{ success: boolean }> {
    const response = await axios.post(
      `${API_URL}/auth/mfa/enable`,
      { secret },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  async verifyMfa(token: string, mfaToken: string): Promise<{ success: boolean }> {
    const response = await axios.post(
      `${API_URL}/auth/mfa/verify`,
      { token: mfaToken },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },
};

export default authService; 