import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { CreateClienteRequest, UpdateClienteRequest, ApiResponse, Cliente } from '../models/types';

export class ClientesController {
  // Obtener todos los clientes del usuario autenticado
  static async getAll(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }

      const { data: clientes, error, count } = await supabase
        .from('clientes')
        .select('*', { count: 'exact' })
        .eq('user_id', req.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error obteniendo clientes:', error);
        return res.status(500).json({
          success: false,
          message: 'Error obteniendo clientes'
        });
      }

      const response: ApiResponse<Cliente[]> = {
        success: true,
        message: 'Clientes obtenidos exitosamente',
        data: clientes || [],
        count: count || 0
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error en getAll clientes:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Obtener un cliente por ID
  static async getById(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }

      const { id } = req.params;

      const { data: cliente, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', id)
        .eq('user_id', req.user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({
            success: false,
            message: 'Cliente no encontrado'
          });
        }
        console.error('Error obteniendo cliente:', error);
        return res.status(500).json({
          success: false,
          message: 'Error obteniendo cliente'
        });
      }

      const response: ApiResponse<Cliente> = {
        success: true,
        message: 'Cliente obtenido exitosamente',
        data: cliente
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error en getById cliente:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Crear nuevo cliente
  static async create(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }

      const { nombre, email, telefono }: CreateClienteRequest = req.body;

      // Validaciones
      if (!nombre || !email || !telefono) {
        return res.status(400).json({
          success: false,
          message: 'Nombre, email y teléfono son requeridos'
        });
      }

      // Verificar si ya existe un cliente con el mismo email para este usuario
      const { data: existing } = await supabase
        .from('clientes')
        .select('id')
        .eq('email', email)
        .eq('user_id', req.user.id)
        .single();

      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un cliente con este email'
        });
      }

      // Crear cliente
      const { data: cliente, error } = await supabase
        .from('clientes')
        .insert([
          {
            nombre,
            email,
            telefono,
            user_id: req.user.id
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creando cliente:', error);
        return res.status(500).json({
          success: false,
          message: 'Error creando cliente'
        });
      }

      const response: ApiResponse<Cliente> = {
        success: true,
        message: 'Cliente creado exitosamente',
        data: cliente
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Error en create cliente:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Actualizar cliente
  static async update(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }

      const { id } = req.params;
      const { nombre, email, telefono }: UpdateClienteRequest = req.body;

      // Al menos un campo debe ser proporcionado
      if (!nombre && !email && !telefono) {
        return res.status(400).json({
          success: false,
          message: 'Al menos un campo debe ser proporcionado para actualizar'
        });
      }

      // Verificar que el cliente pertenece al usuario
      const { data: existing } = await supabase
        .from('clientes')
        .select('id')
        .eq('id', id)
        .eq('user_id', req.user.id)
        .single();

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Cliente no encontrado'
        });
      }

      // Verificar email duplicado si se está actualizando
      if (email) {
        const { data: emailExists } = await supabase
          .from('clientes')
          .select('id')
          .eq('email', email)
          .eq('user_id', req.user.id)
          .neq('id', id)
          .single();

        if (emailExists) {
          return res.status(400).json({
            success: false,
            message: 'Ya existe otro cliente con este email'
          });
        }
      }

      // Actualizar cliente
      const updateData: any = {};
      if (nombre) updateData.nombre = nombre;
      if (email) updateData.email = email;
      if (telefono) updateData.telefono = telefono;

      const { data: cliente, error } = await supabase
        .from('clientes')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', req.user.id)
        .select()
        .single();

      if (error) {
        console.error('Error actualizando cliente:', error);
        return res.status(500).json({
          success: false,
          message: 'Error actualizando cliente'
        });
      }

      const response: ApiResponse<Cliente> = {
        success: true,
        message: 'Cliente actualizado exitosamente',
        data: cliente
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error en update cliente:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Eliminar cliente
  static async delete(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }

      const { id } = req.params;

      // Verificar que el cliente pertenece al usuario
      const { data: existing } = await supabase
        .from('clientes')
        .select('id, nombre')
        .eq('id', id)
        .eq('user_id', req.user.id)
        .single();

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Cliente no encontrado'
        });
      }

      // Eliminar cliente
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id)
        .eq('user_id', req.user.id);

      if (error) {
        console.error('Error eliminando cliente:', error);
        return res.status(500).json({
          success: false,
          message: 'Error eliminando cliente'
        });
      }

      res.status(200).json({
        success: true,
        message: `Cliente "${existing.nombre}" eliminado exitosamente`
      });
    } catch (error) {
      console.error('Error en delete cliente:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}