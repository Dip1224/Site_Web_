import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('❌ Variables de entorno de Supabase no configuradas');
}

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false
  }
});

// Función para probar la conexión
export const testConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('*', { count: 'exact', head: true })
      .limit(1);
    
    if (error) {
      console.log('⚠️ Error de conexión:', error.message);
      return false;
    } 
    
    console.log('✅ Supabase conectado correctamente');
    return true;
  } catch (error) {
    console.log('❌ Error conectando a Supabase:', error);
    return false;
  }
};

export default supabase;