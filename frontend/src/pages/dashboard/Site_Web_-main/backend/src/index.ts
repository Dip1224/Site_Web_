import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { testConnection } from './config/supabase';

// Importar rutas
import authRoutes from './routes/auth';
import clientesRoutes from './routes/clientes';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de seguridad
app.use(helmet());

// CORS para permitir requests desde el frontend
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:5173'],
  credentials: true
}));

// Logging de requests
app.use(morgan('combined'));

// Compresión de respuestas
app.use(compression());

// Parsing de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Ruta de health check
app.get('/api/health', async (req, res) => {
  const isDbConnected = await testConnection();
  
  res.status(200).json({
    status: 'OK',
    message: 'Business Manager API funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: isDbConnected ? 'Conectada' : 'Desconectada'
  });
});

// Configurar rutas
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clientesRoutes);

// Middleware para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe`
  });
});

// Middleware de manejo de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('🚀 Business Manager Backend');
  console.log(`📡 Servidor corriendo en puerto ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log('=====================================');
});

export default app; 
