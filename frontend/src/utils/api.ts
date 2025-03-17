const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
  token?: string;
}

const handleApiError = async (response: Response) => {
  try {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Request failed');
    } else {
      const text = await response.text();
      console.error('Non-JSON response:', text);
      throw new Error('Server returned non-JSON response. The API server might not be running.');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

export const loginUser = async (email: string, password: string): Promise<string> => {
  try {
    console.log('Attempting login to:', `${API_BASE_URL}/auth/login`);
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data: ApiResponse = await response.json();
    
    if (!data.success || !data.token) {
      throw new Error(data.message || 'Login failed');
    }

    // Store the token
    localStorage.setItem('token', data.token);
    return data.token;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const registerUser = async (name: string, email: string, password: string): Promise<string> => {
  try {
    console.log('Attempting registration to:', `${API_BASE_URL}/auth/register`);
    
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data: ApiResponse = await response.json();
    
    if (!data.success || !data.token) {
      throw new Error(data.message || 'Registration failed');
    }

    // Store the token
    localStorage.setItem('token', data.token);
    return data.token;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
};

// Helper function to get the token
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}; 