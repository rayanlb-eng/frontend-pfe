import { Navigate, Route, Routes } from 'react-router-dom'
import ForgotPasswordPage from '../Pages/auth/ForgotPasswordPage'
import LoginPage from '../Pages/auth/LoginPage'
import ResetPasswordPage from '../Pages/auth/ResetPasswordPage'
import TwoFactorPage from '../Pages/auth/TwoFactorPage'
import Dashboard from '../Pages/Dashboard/dashboard'
import AnalysePage from '../Pages/Analyse/AnalysePage'
import FicheFormPage from '../Pages/Fiches/FicheFormPage'
import FichesPage from '../Pages/Fiches/FichesPage'
import Users from '../Pages/Users/Users'
import Parametres from '../Pages/Parametres/Parameters'
import ProtectedRoute from './ProtectedRoute'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login/2fa" element={<TwoFactorPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analyse"
        element={
          <ProtectedRoute>
            <AnalysePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/fiches"
        element={
          <ProtectedRoute>
            <FichesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/fiches/form/:trackingId"
        element={
          <ProtectedRoute>
            <FicheFormPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/parametres"
        element={
          <ProtectedRoute>
            <Parametres />
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
