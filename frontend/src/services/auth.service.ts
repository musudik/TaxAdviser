import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  async googleLogin(): Promise<void> {
    window.location.href = `${API_URL}/auth/google`;
  }

  async microsoftLogin(): Promise<void> {
    window.location.href = `${API_URL}/auth/microsoft`;
  }

  async enableMfa(token: string, secret: string): Promise<{ success: boolean }> {
    const response = await axios.post(
      `${API_URL}/auth/mfa/enable`,
      { secret },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  }

  async verifyMfa(token: string, mfaToken: string): Promise<{ success: boolean }> {
    const response = await axios.post(
      `${API_URL}/auth/mfa/verify`,
      { token: mfaToken },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  }
}

export default new AuthService(); 