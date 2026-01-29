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

export type EntityType = 'CHARACTER' | 'LOCATION' | 'FACTION' | 'ITEM' | 'EVENT' | 'CHAPTER' | 'CONCEPT';

export interface ProjectResponse {
  id: string;
  ownerId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
}

export interface UpdateProjectRequest {
  name: string;
}

export interface TagResponse {
  id: string;
  projectId: string;
  name: string;
  color: string;
}

export interface CreateTagRequest {
  name: string;
  color?: string;
}

export interface EntityResponse {
  id: string;
  projectId: string;
  type: EntityType;
  title: string;
  content: Record<string, unknown>;
  tags: TagResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateEntityRequest {
  type: EntityType;
  title: string;
  content?: Record<string, unknown>;
}

export interface UpdateEntityRequest {
  type?: EntityType;
  title: string;
  content?: Record<string, unknown>;
}

export interface RelationshipResponse {
  id: string;
  projectId: string;
  fromEntityId: string;
  toEntityId: string;
  relationType: string;
  contextEntityId: string | null;
  createdAt: string;
  fromEntityTitle?: string;
  toEntityTitle?: string;
  contextEntityTitle?: string;
}

export interface CreateRelationshipRequest {
  fromEntityId: string;
  toEntityId: string;
  relationType: string;
  contextEntityId?: string;
}

export interface LinkResponse {
  id: string;
  projectId: string;
  fromEntityId: string;
  toEntityId: string;
  note: string | null;
  createdAt: string;
  fromEntityTitle?: string;
  toEntityTitle?: string;
}

export interface CreateLinkRequest {
  fromEntityId: string;
  toEntityId: string;
  note?: string;
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

  // Project endpoints
  async getProjects(): Promise<ProjectResponse[]> {
    return this.request<ProjectResponse[]>("/projects", {
      method: "GET",
    });
  }

  async getProject(id: string): Promise<ProjectResponse> {
    return this.request<ProjectResponse>(`/projects/${id}`, {
      method: "GET",
    });
  }

  async createProject(data: CreateProjectRequest): Promise<ProjectResponse> {
    return this.request<ProjectResponse>("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateProject(id: string, data: UpdateProjectRequest): Promise<ProjectResponse> {
    return this.request<ProjectResponse>(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: string): Promise<void> {
    return this.request<void>(`/projects/${id}`, {
      method: "DELETE",
    });
  }

  // Entity endpoints
  async getEntities(projectId: string, type?: EntityType, tagId?: string): Promise<EntityResponse[]> {
    const params = new URLSearchParams();
    if (type) params.append("type", type);
    if (tagId) params.append("tagId", tagId);
    const queryString = params.toString();
    return this.request<EntityResponse[]>(`/projects/${projectId}/entities${queryString ? `?${queryString}` : ""}`, {
      method: "GET",
    });
  }

  async searchEntities(projectId: string, query: string): Promise<EntityResponse[]> {
    return this.request<EntityResponse[]>(`/projects/${projectId}/entities/search?q=${encodeURIComponent(query)}`, {
      method: "GET",
    });
  }

  async getEntity(id: string): Promise<EntityResponse> {
    return this.request<EntityResponse>(`/entities/${id}`, {
      method: "GET",
    });
  }

  async createEntity(projectId: string, data: CreateEntityRequest): Promise<EntityResponse> {
    return this.request<EntityResponse>(`/projects/${projectId}/entities`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateEntity(id: string, data: UpdateEntityRequest): Promise<EntityResponse> {
    return this.request<EntityResponse>(`/entities/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteEntity(id: string): Promise<void> {
    return this.request<void>(`/entities/${id}`, {
      method: "DELETE",
    });
  }

  async addTagToEntity(entityId: string, tagId: string): Promise<EntityResponse> {
    return this.request<EntityResponse>(`/entities/${entityId}/tags/${tagId}`, {
      method: "POST",
    });
  }

  async removeTagFromEntity(entityId: string, tagId: string): Promise<EntityResponse> {
    return this.request<EntityResponse>(`/entities/${entityId}/tags/${tagId}`, {
      method: "DELETE",
    });
  }

  // Tag endpoints
  async getTags(projectId: string): Promise<TagResponse[]> {
    return this.request<TagResponse[]>(`/projects/${projectId}/tags`, {
      method: "GET",
    });
  }

  async createTag(projectId: string, data: CreateTagRequest): Promise<TagResponse> {
    return this.request<TagResponse>(`/projects/${projectId}/tags`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async deleteTag(id: string): Promise<void> {
    return this.request<void>(`/tags/${id}`, {
      method: "DELETE",
    });
  }

  // Relationship endpoints
  async getRelationships(projectId: string, type?: string): Promise<RelationshipResponse[]> {
    const params = new URLSearchParams();
    if (type) params.append("type", type);
    const queryString = params.toString();
    return this.request<RelationshipResponse[]>(`/projects/${projectId}/relationships${queryString ? `?${queryString}` : ""}`, {
      method: "GET",
    });
  }

  async getEntityRelationships(entityId: string): Promise<RelationshipResponse[]> {
    return this.request<RelationshipResponse[]>(`/entities/${entityId}/relationships`, {
      method: "GET",
    });
  }

  async getRelationship(id: string): Promise<RelationshipResponse> {
    return this.request<RelationshipResponse>(`/relationships/${id}`, {
      method: "GET",
    });
  }

  async createRelationship(projectId: string, data: CreateRelationshipRequest): Promise<RelationshipResponse> {
    return this.request<RelationshipResponse>(`/projects/${projectId}/relationships`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async deleteRelationship(id: string): Promise<void> {
    return this.request<void>(`/relationships/${id}`, {
      method: "DELETE",
    });
  }

  // Link endpoints
  async getLinks(projectId: string): Promise<LinkResponse[]> {
    return this.request<LinkResponse[]>(`/projects/${projectId}/links`, {
      method: "GET",
    });
  }

  async getEntityLinks(entityId: string): Promise<LinkResponse[]> {
    return this.request<LinkResponse[]>(`/entities/${entityId}/links`, {
      method: "GET",
    });
  }

  async createLink(projectId: string, data: CreateLinkRequest): Promise<LinkResponse> {
    return this.request<LinkResponse>(`/projects/${projectId}/links`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async deleteLink(id: string): Promise<void> {
    return this.request<void>(`/links/${id}`, {
      method: "DELETE",
    });
  }
}

export const api = new ApiClient();
