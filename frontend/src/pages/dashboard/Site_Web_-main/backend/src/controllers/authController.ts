import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/types';

export class AuthController {
  // Registro de usuario
  static async register(req: Request, res: Response) {
    try {
      const { email, password }: RegisterRequest = req.body;

      // Validaciones básicas
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email y contraseña son requeridos'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'La contraseña debe tener al menos 6 caracteres'
        });
      }

      // Registrar usuario en Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      const response: AuthResponse = {
        success: true,
        message: 'Usuario registrado exitosamente',
        user: data.user ? {
          id: data.user.id,
          email: data.user.email || '',
          created_at: data.user.created_at || ''
        } : undefined,
        token: data.session?.access_token
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Inicio de sesión
  static async login(req: Request, res: Response) {
    try {
      const { email, password }: LoginRequest = req.body;

      // Validaciones básicas
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email y contraseña son requeridos'
        });
      }

      // Autenticar con Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      const response: AuthResponse = {
        success: true,
        message: 'Inicio de sesión exitoso',
        user: data.user ? {
          id: data.user.id,
          email: data.user.email || '',
          created_at: data.user.created_at || ''
        } : undefined,
        token: data.session?.access_token
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Cerrar sesión
  static async logout(req: Request, res: Response) {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(200).json({
        success: true,
        message: 'Sesión cerrada exitosamente'
      });
    } catch (error) {
      console.error('Error en logout:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Obtener perfil del usuario autenticado
  static async profile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Perfil obtenido exitosamente',
        data: req.user
      });
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}