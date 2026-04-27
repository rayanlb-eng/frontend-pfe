import { initialTrackingRows, initialFormStates } from './data'

// ===== KEYS =====
export const TRACKING_ROWS_STORAGE_KEY = 'fichesTrackingRows'
export const FICHE_FORMS_STORAGE_KEY = 'fichesFormStates'
export const FICHE_NOTIFICATIONS_STORAGE_KEY = 'fichesNotifications'

// ===== TRACKING =====
export function getStoredTrackingRows() {
  const raw = localStorage.getItem(TRACKING_ROWS_STORAGE_KEY)

  if (!raw) return initialTrackingRows

  const storedRows = JSON.parse(raw)

  const storedIds = new Set(storedRows.map((row) => row.id))

  const missingSeedRows = initialTrackingRows.filter(
    (row) => !storedIds.has(row.id)
  )

  return [...storedRows, ...missingSeedRows]
}

export function saveTrackingRows(rows) {
  localStorage.setItem(TRACKING_ROWS_STORAGE_KEY, JSON.stringify(rows))
}

// ===== FORM STATES =====
export function getStoredFormStates() {
  const raw = localStorage.getItem(FICHE_FORMS_STORAGE_KEY)

  if (!raw) return initialFormStates

  const storedForms = JSON.parse(raw)

  return { ...initialFormStates, ...storedForms }
}

export function saveFormStates(forms) {
  localStorage.setItem(FICHE_FORMS_STORAGE_KEY, JSON.stringify(forms))
}

// ===== NOTIFICATIONS =====
export function getStoredNotifications() {
  const raw = localStorage.getItem(FICHE_NOTIFICATIONS_STORAGE_KEY)
  return raw ? JSON.parse(raw) : []
}

export function saveNotifications(notifications) {
  localStorage.setItem(
    FICHE_NOTIFICATIONS_STORAGE_KEY,
    JSON.stringify(notifications)
  )
}
