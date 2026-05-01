import { Navigate, Route, Routes } from 'react-router-dom'
import ForgotPasswordPage from '../Pages/auth/ForgotPasswordPage'
import LoginPage from '../Pages/auth/LoginPage'
import ResetPasswordPage from '../Pages/auth/ResetPasswordPage'
import TwoFactorPage from '../Pages/auth/TwoFactorPage'
import Dashboard from '../Pages/Dashboard/dashboard'
import AnalysePage from '../Pages/Analyse/AnalysePage'
import FicheFormPage from '../Pages/Fiches/FicheFormPage'
import FichesDdrh from '../Pages/Fiches/FichesDdrh'
import FichesEmp from '../Pages/Fiches/FichesEmp'
import Rapport from '../Pages/Rapport/Rapport'
import Users from '../Pages/Users/Users'
import Parametres from '../Pages/Parametres/Parameters'
import { CONNECTED_USER_ROLE_KEY } from '../Pages/Users/users.data'
import ProtectedRoute from './ProtectedRoute'

function getFichesDefaultPath() {
  const connectedRole = localStorage.getItem(CONNECTED_USER_ROLE_KEY) || 'DDRH'
  return connectedRole === 'DDRH' ? '/fiches/gestion' : '/fiches/mes'
}

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
        path="/rapport"
        element={
          <ProtectedRoute>
            <Rapport />
          </ProtectedRoute>
        }
      />

      <Route
        path="/fiches"
        element={
          <ProtectedRoute>
            <Navigate to={getFichesDefaultPath()} replace />
          </ProtectedRoute>
        }
      />

      <Route
        path="/fiches/gestion"
        element={
          <ProtectedRoute>
            <FichesDdrh />
          </ProtectedRoute>
        }
      />

      <Route
        path="/fiches/mes"
        element={
          <ProtectedRoute>
            <FichesEmp />
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
