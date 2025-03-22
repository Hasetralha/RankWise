const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
  token?: string;
}

export interface UserSettings {
  notifications: {
    email: boolean;
    browser: boolean;
    weeklyDigest: boolean;
    sitemapUpdates: boolean;
    securityAlerts: boolean;
  };
  preferences: {
    defaultChangeFreq: string;
    defaultPriority: string;
    darkMode: boolean;
    language: string;
    timezone: string;
    dateFormat: string;
  };
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
  };
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  company?: string;
  role?: string;
  settings: UserSettings;
  createdAt: string;
  updatedAt: string;
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

export const loginUser = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  try {
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
    
    if (!data.success || !data.token || !data.data) {
      throw new Error(data.message || 'Login failed');
    }

    // Store the token
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.data));

    return {
      user: data.data,
      token: data.token
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const registerUser = async (name: string, email: string, password: string): Promise<{ user: User; token: string }> => {
  try {
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
    
    if (!data.success || !data.token || !data.data) {
      throw new Error(data.message || 'Registration failed');
    }

    // Store the token
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.data));

    return {
      user: data.data,
      token: data.token
    };
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

// Helper function to get the current user
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Helper function to logout
export const logout = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Clear any other user-related data
    localStorage.removeItem('metaTags');
    localStorage.removeItem('contentAnalyses');
    localStorage.removeItem('sitemaps');
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

export const updateUserSettings = async (settings: Partial<User>): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data: ApiResponse = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error(data.message || 'Failed to update settings');
    }

    // Update local storage
    localStorage.setItem('user', JSON.stringify(data.data));

    return data.data;
  } catch (error) {
    console.error('Settings update error:', error);
    throw error;
  }
};

export const uploadAvatar = async (file: File): Promise<User> => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch(`${API_BASE_URL}/users/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data: ApiResponse = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error(data.message || 'Failed to upload avatar');
    }

    // Update local storage
    localStorage.setItem('user', JSON.stringify(data.data));

    return data.data;
  } catch (error) {
    console.error('Avatar upload error:', error);
    throw error;
  }
}; 