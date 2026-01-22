"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { api, UserResponse, ApiException } from "@/lib/api";

interface AuthState {
  user: UserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "lorely_access_token";
const REFRESH_TOKEN_KEY = "lorely_refresh_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const clearAuth = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    api.setAccessToken(null);
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, []);

  const refreshAuth = useCallback(async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      return false;
    }

    try {
      const response = await api.refresh({ refreshToken });
      localStorage.setItem(TOKEN_KEY, response.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
      api.setAccessToken(response.accessToken);
      return true;
    } catch {
      clearAuth();
      return false;
    }
  }, [clearAuth]);

  const fetchUser = useCallback(async () => {
    try {
      const user = await api.getMe();
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      if (error instanceof ApiException && error.status === 401) {
        // Try to refresh
        const refreshed = await refreshAuth();
        if (refreshed) {
          try {
            const user = await api.getMe();
            setState({
              user,
              isLoading: false,
              isAuthenticated: true,
            });
            return;
          } catch {
            // Fall through to clearAuth
          }
        }
      }
      clearAuth();
    }
  }, [clearAuth, refreshAuth]);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      api.setAccessToken(token);
      fetchUser();
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    const response = await api.login({ email, password });
    localStorage.setItem(TOKEN_KEY, response.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    api.setAccessToken(response.accessToken);

    const user = await api.getMe();
    setState({
      user,
      isLoading: false,
      isAuthenticated: true,
    });
  };

  const register = async (email: string, password: string) => {
    await api.register({ email, password });
    // After registration, log them in
    await login(email, password);
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // Ignore errors on logout
    }
    clearAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
