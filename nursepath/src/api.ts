const API_BASE_URL = '/api';

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

// Load token from localStorage on app start
export const loadAuthToken = () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    authToken = token;
  }
};

const getHeaders = (includeAuth: boolean = true) => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (includeAuth && authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    if (response.status === 401) {
      // Clear token on auth error
      setAuthToken(null);
      window.location.href = '/admin/login';
    }
    const error = await response.json();
    throw new Error(error.error || `API error: ${response.statusText}`);
  }
  return response.json();
};

export const api = {
  async get(endpoint: string, includeAuth: boolean = false) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(includeAuth),
    });
    return handleResponse(response);
  },

  async post(endpoint: string, data: unknown, includeAuth: boolean = false) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(includeAuth),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async put(endpoint: string, data: unknown, includeAuth: boolean = false) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(includeAuth),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async delete(endpoint: string, includeAuth: boolean = false) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(includeAuth),
    });
    return handleResponse(response);
  },

  setAuthToken,
  loadAuthToken,
  getAuthToken: () => authToken,
};
