export interface Cliente {
  id: number
  nombre: string
  email: string
  telefono?: string
  empresa?: string
  fechaRegistro: Date
  activo: boolean
}

export interface NuevoCliente {
  nombre: string
  email: string
  telefono?: string
  empresa?: string
}

export interface AuthData {
  user: {
    id: string
    email: string
    name?: string
  } | null
  token?: string
}

export type AuthMode = 'login' | 'register' | 'forgot-password' | 'signin' | 'signup'

export type AppPage = 
  | 'home' 
  | 'services' 
  | 'about' 
  | 'portfolio' 
  | 'contact' 
  | 'dashboard'
  | 'clients'
  | 'admin'
  | 'landing'
  | 'auth'

export interface AuthFormData {
  email: string
  password: string
  name?: string
}

export interface DashboardItem {
  id: number
  header: string
  type: string
  status: string
  target: string
  limit: string
  reviewer: string
}