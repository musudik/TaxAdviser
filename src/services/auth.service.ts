import axios from 'axios';
import { LoginCredentials, RegisterData, AuthResponse, User, UserRole } from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'; 