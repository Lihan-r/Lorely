const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export interface ApiError {
  error: string;
  message: string;
  field?: string;
  timestamp?: string;
  traceId?: string;
}

export class ApiException extends Error {
  constructor(
    public status: number,
    public error: ApiError
  ) {
    super(error.message);
    this.name = "ApiException";
  }
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserResponse {
  id: string;
  email: string;
  createdAt: string;
}

class ApiClient {
  private accessToken: string | null = null;

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.accessToken) {
      (headers as Record<string, string>)["Authorization"] =
        `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let error: ApiError;
      try {
        error = await response.json();
      } catch {
        error = {
          error: "UNKNOWN_ERROR",
          message: "An unexpected error occurred",
        };
      }
      throw new ApiException(response.status, error);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  // Auth endpoints
  async register(data: RegisterRequest): Promise<UserResponse> {
    return this.request<UserResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async refresh(data: RefreshRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<void> {
    return this.request<void>("/auth/logout", {
      method: "POST",
    });
  }

  async getMe(): Promise<UserResponse> {
    return this.request<UserResponse>("/me", {
      method: "GET",
    });
  }
}

export const api = new ApiClient();
