import { apiRequest } from './apiClient'

// Service users pret a remplacer les donnees de demo de la page Users.
// Une fois le backend stabilise, la page devra lire uniquement ces fonctions
// et supprimer la logique front-only restante.
export function getUsers() {
  return apiRequest('/users/')
}

export function createUser(user) {
  return apiRequest('/users/', {
    method: 'POST',
    body: JSON.stringify(user),
  })
}

export function updateUser(userId, updates) {
  return apiRequest(`/users/${userId}/`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  })
}

export function deleteUser(userId) {
  return apiRequest(`/users/${userId}/`, {
    method: 'DELETE',
  })
}
