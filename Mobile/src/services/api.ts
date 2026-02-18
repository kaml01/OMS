import { Platform } from 'react-native';
import { storage } from '../utils/storage';

const BASE_URL = Platform.select({
  android: 'http://10.0.2.2:8000/api',
  ios: 'http://localhost:8000/api',
  web: 'http://localhost:8000/api',
  default: 'http://localhost:8000/api',
});

async function refreshAccessToken(): Promise<string | null> {
  try {
    const refreshToken = await storage.getRefreshToken();
    if (!refreshToken) return null;

    const response = await fetch(`${BASE_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (data.access) {
      await storage.saveTokens(data.access, data.refresh || refreshToken);
      return data.access;
    }
    return null;
  } catch {
    return null;
  }
}

async function fetchWithAuth(
  url: string,
  options: RequestInit,
  token?: string
): Promise<Response> {
  const response = await fetch(url, options);

  if (response.status === 401 && token) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      const retryHeaders = { ...options.headers, Authorization: `Bearer ${newToken}` };
      return fetch(url, { ...options, headers: retryHeaders });
    }
  }

  return response;
}

export const api = {

  get: async (endpoint: string, token?: string): Promise<any> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const url = `${BASE_URL}${endpoint}`;
      console.log('Fetching:', url);

      const response = await fetchWithAuth(url, { method: 'GET', headers }, token);

      console.log('Status:', response.status);

      if (!response.ok) {
        console.error('API Error:', response.status);
        return { error: true, status: response.status };
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('Fetch Error:', error);
      return { error: true, status: 0 };
    }
  },

  post: async (endpoint: string, body: object, token?: string): Promise<any> => {

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {

      const url = `${BASE_URL}${endpoint}`;
      console.log('Posting to:', url);

      const response = await fetchWithAuth(
        url,
        { method: 'POST', headers, body: JSON.stringify(body) },
        token
      );

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('Post Error:', error);
      return null;
    }

  },


  delete: async (endpoint: string, token?: string): Promise<any> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const url = `${BASE_URL}${endpoint}`;
      const response = await fetchWithAuth(url, { method: 'DELETE', headers }, token);

      if (!response.ok) {
        return { success: false };
      }

      return { success: true };
    } catch (error) {
      console.error('Delete Error:', error);
      return { success: false };
    }
  },

};
