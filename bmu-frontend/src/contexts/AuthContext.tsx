import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
  role_display: string;
  phone?: string;
  profile_image?: string;
  is_email_verified: boolean;
}

interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isLoading: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  role: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getStoredTokens(): AuthTokens | null {
  try {
    const access = localStorage.getItem('bmu_access_token');
    const refresh = localStorage.getItem('bmu_refresh_token');
    if (access && refresh) return { access, refresh };
  } catch {
    // ignore storage access errors
  }
  return null;
}

function storeTokens(tokens: AuthTokens) {
  localStorage.setItem('bmu_access_token', tokens.access);
  localStorage.setItem('bmu_refresh_token', tokens.refresh);
}

function clearTokens() {
  localStorage.removeItem('bmu_access_token');
  localStorage.removeItem('bmu_refresh_token');
  localStorage.removeItem('bmu_user');
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const tryRefresh = useCallback(async (refreshToken: string) => {
    try {
      const res = await axios.post(`${API_URL}/v1/auth/login/`, {
        refresh: refreshToken,
      });
      const newTokens: AuthTokens = {
        access: res.data.access,
        refresh: refreshToken,
      };
      storeTokens(newTokens);
      return true;
    } catch {
      clearTokens();
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  const fetchProfile = useCallback(async (token: string): Promise<User | null> => {
    try {
      const res = await axios.get(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const tokens = getStoredTokens();
      if (!tokens) { setIsLoading(false); return; }
      let profile = await fetchProfile(tokens.access);
      if (profile) {
        setUser(profile);
        setIsAuthenticated(true);
      } else {
        const refreshed = await tryRefresh(tokens.refresh);
        if (refreshed) {
          const newTokens = getStoredTokens();
          if (newTokens) {
            profile = await fetchProfile(newTokens.access);
            if (profile) { setUser(profile); setIsAuthenticated(true); }
          }
        }
      }
      setIsLoading(false);
    };
    init();
  }, [fetchProfile, tryRefresh]);

  const login = async (email: string, password: string) => {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    const tokens: AuthTokens = {
      access: res.data.access,
      refresh: res.data.refresh,
    };
    storeTokens(tokens);
    const userData: User = res.data.user;
    setUser(userData);
    setIsAuthenticated(true);
  };

  const register = async (data: RegisterData) => {
    const res = await axios.post(`${API_URL}/v1/auth/register/`, data);
    if (res.data.tokens) {
      storeTokens(res.data.tokens);
      setUser(res.data.user);
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    clearTokens();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (data: Partial<User>) => {
    const tokens = getStoredTokens();
    if (!tokens) throw new Error('Not authenticated');
    const res = await axios.put(`${API_URL}/v1/auth/profile/update/`, data, {
      headers: { Authorization: `Bearer ${tokens.access}` },
    });
    setUser((prev) => prev ? { ...prev, ...res.data } : null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
