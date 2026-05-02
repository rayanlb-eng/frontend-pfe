import { initialTrackingRows, initialFormStates, structureRecipients } from './data'

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

function parseLocalDate(value) {
  if (!value) return null

  if (String(value).includes('/')) {
    const [day, month, year] = String(value).split('/')
    if (!day || !month || !year) return null
    return new Date(Number(year), Number(month) - 1, Number(day))
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function getDaysDifference(left, right) {
  const leftDay = startOfDay(left).getTime()
  const rightDay = startOfDay(right).getTime()
  return Math.round((leftDay - rightDay) / (1000 * 60 * 60 * 24))
}

export function syncDeadlineReminderNotifications() {
  const notifications = getStoredNotifications()
  const trackingRows = getStoredTrackingRows()
  const formStates = getStoredFormStates()
  const recipientsById = new Map(structureRecipients.map((recipient) => [recipient.id, recipient]))
  const existingIds = new Set(notifications.map((item) => item.id))
  const today = startOfDay(new Date())
  const nextNotifications = []

  trackingRows.forEach((row) => {
    if (row.formStatus === 'Soumise' || row.locked) return

    const formState = formStates[row.id]
    const deadline = parseLocalDate(formState?.echeance)
    const sentAt = parseLocalDate(row.sentAt)
    if (!deadline) return

    const recipient = recipientsById.get(row.recipientId)
    const daysUntilDeadline = getDaysDifference(deadline, today)
    const daysSinceSent = sentAt ? getDaysDifference(today, sentAt) : -1

    const reminderDefinitions = [
      {
        stage: 'after-7-days',
        shouldCreate: daysSinceSent >= 7,
        title: 'Rappel de soumission',
        message: `Rappel : votre fiche doit etre soumise avant le ${deadline.toLocaleDateString('fr-FR')}.`,
      },
      {
        stage: 'before-deadline-3',
        shouldCreate: daysUntilDeadline > 0 && daysUntilDeadline <= 3,
        title: 'Rappel avant date limite',
        message: `Rappel : votre fiche doit etre soumise avant le ${deadline.toLocaleDateString('fr-FR')}.`,
      },
      {
        stage: 'deadline-day',
        shouldCreate: daysUntilDeadline === 0,
        title: 'Dernier rappel de soumission',
        message: `Dernier rappel : votre fiche doit etre soumise aujourd hui, avant le ${deadline.toLocaleDateString('fr-FR')}.`,
      },
    ]

    reminderDefinitions.forEach((reminder) => {
      if (!reminder.shouldCreate) return

      const notificationId = `notif-reminder-${row.id}-${reminder.stage}`
      if (existingIds.has(notificationId)) return

      nextNotifications.push({
        id: notificationId,
        type: 'deadline-reminder',
        reminderStage: reminder.stage,
        recipientId: row.recipientId,
        recipientEmail: recipient?.email || '',
        title: reminder.title,
        message: reminder.message,
        trackingId: row.id,
        read: false,
        createdAt: new Date().toLocaleDateString('fr-FR'),
      })
    })
  })

  if (nextNotifications.length === 0) {
    return 0
  }

  saveNotifications([...nextNotifications, ...notifications])
  return nextNotifications.length
}
