import { apiRequest } from './apiClient'

// Service prepare pour les notifications.
// A activer quand le backend exposera enfin les routes notifications.
// Il remplacera plus tard la logique locale utilisee dans le header et dans Fiches.

// TODO backend:
// GET /api/notifications/
export function getNotifications() {
  return apiRequest('/notifications/')
}

// TODO backend:
// GET /api/notifications/:id/
export function getNotificationById(notificationId) {
  return apiRequest(`/notifications/${notificationId}/`)
}

// TODO backend:
// PATCH /api/notifications/:id/read/
export function markNotificationAsRead(notificationId) {
  return apiRequest(`/notifications/${notificationId}/read/`, {
    method: 'PATCH',
  })
}

// TODO backend:
// PATCH /api/notifications/read-all/
export function markAllNotificationsAsRead() {
  return apiRequest('/notifications/read-all/', {
    method: 'PATCH',
  })
}

// TODO backend:
// DELETE /api/notifications/:id/
export function deleteNotification(notificationId) {
  return apiRequest(`/notifications/${notificationId}/`, {
    method: 'DELETE',
  })
}
