import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { ensureSession } from '@/lib/session'
import { Cliente, NuevoCliente } from '../types'

export const useClients = (user: User | null) => {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nuevoCliente, setNuevoCliente] = useState<NuevoCliente>({
    nombre: '',
    email: '',
    telefono: ''
  })

  // Cargar clientes cuando el usuario esté autenticado
  useEffect(() => {
    if (user) {
      cargarClientes()
    }
  }, [user])

  // Cargar clientes
  const cargarClientes = async () => {
    try {
      setLoading(true)
      
      if (!user) {
        throw new Error('Usuario no autenticado')
      }

      // Solo cargar clientes del usuario actual
      await ensureSession()
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setClientes(data || [])
    } catch (err: any) {
      setError(err.message)
      console.error('Error cargando clientes:', err)
    } finally {
      setLoading(false)
    }
  }

  // Crear cliente
  const crearCliente = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      if (!user) {
        throw new Error('Usuario no autenticado')
      }

      // Incluir el user_id del usuario autenticado
      const clienteConUser = {
        ...nuevoCliente,
        user_id: user.id
      }

      await ensureSession()
      const { data, error } = await supabase
        .from('clientes')
        .insert([clienteConUser])
        .select()

      if (error) throw error
      
      setClientes([data[0], ...clientes])
      setNuevoCliente({ nombre: '', email: '', telefono: '' })
      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.error('Error creando cliente:', err)
    } finally {
      setLoading(false)
    }
  }

  // Eliminar cliente
  const eliminarCliente = async (id: number) => {
    try {
      if (!user) {
        throw new Error('Usuario no autenticado')
      }

      // Solo eliminar si el cliente pertenece al usuario actual
      await ensureSession()
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error
      
      setClientes(clientes.filter(c => c.id !== id))
    } catch (err: any) {
      setError(err.message)
      console.error('Error eliminando cliente:', err)
    }
  }

  return {
    clientes,
    loading,
    error,
    nuevoCliente,
    setNuevoCliente,
    cargarClientes,
    crearCliente,
    eliminarCliente
  }
}
