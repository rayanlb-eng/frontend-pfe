import { apiRequest } from './apiClient'

// Service prepare pour Analyse.
// Aujourd'hui la page consolide les demandes a partir de Fiches en local.
// Quand le backend sera pret, cette couche devra remplacer buildAnalyseRows()
// ou au moins recevoir les decisions DDRH depuis l'API.

// TODO backend:
// GET /api/training-needs/
export function getTrainingNeeds() {
  return apiRequest('/training-needs/')
}

// Endpoint deja present dans le backend actuel:
// POST /api/decesion/:id
export function submitDecision(trainingNeedId, payload) {
  return apiRequest(`/decesion/${trainingNeedId}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// TODO backend:
// PATCH /api/training-needs/:id
export function updateTrainingNeed(trainingNeedId, payload) {
  return apiRequest(`/training-needs/${trainingNeedId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}
