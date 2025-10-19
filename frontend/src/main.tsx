import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App.tsx'
import LoginPage from './pages/LoginPage.tsx'
import DashboardPage from './pages/dashboard/DashboardPage.tsx'
// Legacy pages kept, but direct routes will redirect to dashboard panels
import ClientesPage from './pages/ClientesPage.tsx'
import VentasPage from './pages/VentasPage.tsx'
import GananciasPage from './pages/GananciasPage.tsx'
import ProductosPage from './pages/ProductosPage.tsx'
import TeamPage from './pages/TeamPage.tsx'
import { ProtectedRoute } from './components/ProtectedRoute.tsx'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { AuthProvider } from './contexts/AuthContext'
import { SessionGuard } from './components/SessionGuard'
import './index.css'

// Set application title to new brand
if (typeof document !== 'undefined') {
  document.title = 'WorkEz - Tecnología Empresarial'
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <SessionGuard />
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            {/* Redirect legacy top-level routes to dashboard panels */}
            <Route path="/clientes" element={<Navigate to="/dashboard?section=clientes" replace />} />
            <Route path="/ventas" element={<Navigate to="/dashboard?section=ventas" replace />} />
            <Route path="/ganancias" element={<Navigate to="/dashboard?section=ganancias" replace />} />
            <Route path="/productos" element={<Navigate to="/dashboard?section=productos" replace />} />
            <Route path="/team" element={<Navigate to="/dashboard?section=team" replace />} />
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </BrowserRouter>
)
