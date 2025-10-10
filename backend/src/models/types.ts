// Interfaces para la base de datos

export interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
}

export interface NuevoCliente {
  nombre: string;
  email: string;
  telefono: string;
  user_id: string;
}

export interface Usuario {
  id: string;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: Usuario;
  token?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  count?: number;
}

// Tipos para requests
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface CreateClienteRequest {
  nombre: string;
  email: string;
  telefono: string;
}

export interface UpdateClienteRequest {
  nombre?: string;
  email?: string;
  telefono?: string;
}