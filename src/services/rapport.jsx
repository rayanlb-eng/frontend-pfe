import { apiRequest } from './apiClient'

// Service prepare pour Rapport.
// La page Rapport reste actuellement alimentee par Analyse + Fiches cote front.
// Quand le backend sera pret, elle devra lire un export ou une synthese serveur.

// Endpoint deja present dans le backend actuel:
// GET /api/trainings
export function getTrainings() {
  return apiRequest('/trainings')
}

// Endpoint deja present dans le backend actuel:
// GET /api/export/training-needs/?year=2026
// Non active dans la page tant que la demo reste front-only.
export function exportTrainingNeedsReport(year) {
  return apiRequest(`/export/training-needs/?year=${year}`)
}
