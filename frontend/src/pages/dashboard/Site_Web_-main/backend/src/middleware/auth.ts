import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase';

// Extender el tipo Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de autorización requerido'
      });
    }


    const token = authHeader.substring(7); // Remover "Bearer "

    try {
      // Verificar el token con Supabase
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return res.status(401).json({
          success: false,
          message: 'Token inválido o expirado'
        });
      }

      // Agregar información del usuario al request
      req.user = {
        id: user.id,
        email: user.email || ''
      };

      next();
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: 'Token malformado'
      });
    }
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Middleware opcional de autenticación
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(); // Continuar sin usuario autenticado
  }

  try {
    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (!error && user) {
      req.user = {
        id: user.id,
        email: user.email || ''
      };
    }
  } catch (error) {
    // Ignorar errores en autenticación opcional
  }

  next();
};