// API Configuration
// Centralized API base URL configuration for easy environment management

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  // Client endpoints
  LOGIN: `${API_BASE_URL}/clients/login`,
  REGISTER: `${API_BASE_URL}/clients/register`,
  ME: `${API_BASE_URL}/privateClients/me`,
  
  // Product endpoints
  PRODUCTS: `${API_BASE_URL}/products/`,
  PRODUCT_REGISTER: `${API_BASE_URL}/products/register`,
  
  // Location endpoints (protected)
  LOCATIONS: `${API_BASE_URL}/locations/`,
} as const;

