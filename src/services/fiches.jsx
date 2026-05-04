import { apiRequest } from './apiClient'

// Service prepare pour le workflow Fiches.
// Il n'est pas encore active dans les pages car le backend n'expose pas
// encore un workflow complet de collecte / envoi / reouverture.
// Quand le backend sera pret, ces fonctions devront remplacer :
// - getStoredTrackingRows()
// - getStoredFormStates()
// - saveTrackingRows()
// - saveFormStates()

// TODO backend:
// GET /api/forms/
export function getFiches() {
  return apiRequest('/forms/')
}

// TODO backend:
// GET /api/forms/:id/
export function getFicheById(ficheId) {
  return apiRequest(`/forms/${ficheId}/`)
}

// TODO backend:
// POST /api/forms/send/
export function sendFiches(payload) {
  return apiRequest('/forms/send/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// TODO backend:
// PATCH /api/forms/:id/
export function saveFicheDraft(ficheId, payload) {
  return apiRequest(`/forms/${ficheId}/`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

// TODO backend:
// POST /api/forms/:id/submit/
export function submitFiche(ficheId) {
  return apiRequest(`/forms/${ficheId}/submit/`, {
    method: 'POST',
  })
}

// TODO backend:
// POST /api/forms/:id/reopen/
export function reopenFiche(ficheId) {
  return apiRequest(`/forms/${ficheId}/reopen/`, {
    method: 'POST',
  })
}

// TODO backend:
// POST /api/forms/:id/lock/
export function lockFiche(ficheId) {
  return apiRequest(`/forms/${ficheId}/lock/`, {
    method: 'POST',
  })
}
