import { apiRequest } from './apiClient'

export function normalizeBackendRole(role) {
  if (role === 'HR') return 'DDRH'
  if (role === 'MANAGER') return 'Employeur'
  if (role === 'ADMIN') return 'Admin'
  return role || 'Employeur'
}

export async function loginUser(credentials) {
  return apiRequest('/auth/login/', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export function getCurrentUser() {
  return apiRequest('/auth/me/')
}

export function logoutUser() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('connectedUserRole')
  localStorage.removeItem('connectedUserEmail')
}
