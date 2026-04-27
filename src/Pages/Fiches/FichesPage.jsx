import { Navigate } from 'react-router-dom'
import { CONNECTED_USER_ROLE_KEY } from '../Users/users.data'

export default function FichesPage() {
  const role = localStorage.getItem(CONNECTED_USER_ROLE_KEY) || 'Employeur'

  if (role === 'DDRH') {
    return <Navigate to="/fiches/gestion" replace />
  }

  return <Navigate to="/fiches/mes" replace />
}