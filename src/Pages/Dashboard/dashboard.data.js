import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded'
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded'
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
import DraftsRoundedIcon from '@mui/icons-material/DraftsRounded'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded'
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded'
import { structureRecipients } from '../Fiches/data/data'
import {
  getStoredFormStates,
  getStoredNotifications,
  getStoredTrackingRows,
} from '../Fiches/data/storage'
import { initialUsers } from '../Users/users.data'

const defaultAccent = 'rgba(255,255,255,0.16)'

const formStatusPalette = {
  'Non ouverte': '#f59e0b',
  Brouillon: '#2563eb',
  Soumise: '#0f9d58',
}

const quickActionPalette = {
  primary: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)',
  success: 'linear-gradient(135deg, #0f9d58 0%, #34d399 100%)',
  warning: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
  accent: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
}

const recipientById = new Map(structureRecipients.map((recipient) => [recipient.id, recipient]))
const dashboardUsers = initialUsers

function parseTrackingDate(value) {
  const [day, month, year] = String(value || '').split('/')
  if (!day || !month || !year) {
    return new Date(0)
  }

  return new Date(Number(year), Number(month) - 1, Number(day))
}

function formatShortDate(dateValue) {
  return dateValue.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
  })
}

function getRowsWithRecipientMeta() {
  return getStoredTrackingRows().map((row) => ({
    ...row,
    recipientEmail: recipientById.get(row.recipientId)?.email || '',
  }))
}

function getTrainingLabel(formState) {
  if (!formState) {
    return 'Formation a preciser'
  }

  if (Array.isArray(formState.trainingRequests) && formState.trainingRequests.length > 0) {
    return formState.trainingRequests[0].intituleFormation || 'Formation a preciser'
  }

  return formState.intituleFormation || 'Formation a preciser'
}

function getTrainingRequestCount(formState) {
  if (!formState) {
    return 0
  }

  if (Array.isArray(formState.trainingRequests) && formState.trainingRequests.length > 0) {
    return formState.trainingRequests.length
  }

  return formState.intituleFormation ? 1 : 0
}

function getRequestedEmployeesCount(formState) {
  if (!formState) {
    return 0
  }

  if (Array.isArray(formState.trainingRequests) && formState.trainingRequests.length > 0) {
    const uniqueEmployees = new Set(
      formState.trainingRequests.flatMap((request) =>
        Array.isArray(request.employeeIds) ? request.employeeIds : []
      )
    )
    return uniqueEmployees.size
  }

  return formState.employeMatricule ? 1 : 0
}

function formatDeadline(deadline) {
  if (!deadline) return 'Non definie'
  const date = new Date(deadline)
  if (Number.isNaN(date.getTime())) return deadline
  return date.toLocaleDateString('fr-FR')
}

function getEmployerCurrentRow(rows) {
  if (rows.length === 0) return null

  const ordered = [...rows].sort((left, right) => {
    const leftScore = left.locked
      ? 1
      : left.reopened
        ? 5
        : left.formStatus === 'Brouillon'
          ? 4
          : left.formStatus === 'Non ouverte'
            ? 3
            : left.formStatus === 'Soumise'
              ? 2
              : 0
    const rightScore = right.locked
      ? 1
      : right.reopened
        ? 5
        : right.formStatus === 'Brouillon'
          ? 4
          : right.formStatus === 'Non ouverte'
            ? 3
            : right.formStatus === 'Soumise'
              ? 2
              : 0

    if (rightScore !== leftScore) return rightScore - leftScore
    return parseTrackingDate(right.sentAt) - parseTrackingDate(left.sentAt)
  })

  return ordered[0]
}

function getEmployerStatusLabel(row) {
  if (!row) return 'Aucune fiche'
  if (row.locked) return 'Verrouillee'
  if (row.reopened) return 'Reouverte par DDRH'
  if (row.formStatus === 'Brouillon') return 'Brouillon'
  if (row.formStatus === 'Soumise') return 'Soumise'
  if (row.formStatus === 'Non ouverte') return 'Disponible'
  return row.formStatus
}

function buildTimelineData(rows) {
  const grouped = rows.reduce((accumulator, row) => {
    const date = parseTrackingDate(row.sentAt)
    const key = formatShortDate(date)
    accumulator[key] = (accumulator[key] || 0) + 1
    return accumulator
  }, {})

  const sortedDates = rows
    .map((row) => parseTrackingDate(row.sentAt))
    .sort((left, right) => left - right)
    .slice(-6)

  const uniqueLabels = [...new Set(sortedDates.map((date) => formatShortDate(date)))]

  return uniqueLabels.map((label) => ({
    label,
    value: grouped[label] || 0,
  }))
}

function buildEmployeesByCampaignData(rows, forms) {
  const grouped = rows.reduce((accumulator, row) => {
    const campaignYear = String(row.sentAt || '').split('/')[2] || 'Sans campagne'
    const formState = forms[row.id]
    const employeeIds = new Set()

    if (Array.isArray(formState?.trainingRequests) && formState.trainingRequests.length > 0) {
      formState.trainingRequests.forEach((request) => {
        ;(request.employeeIds || []).forEach((employeeId) => {
          employeeIds.add(String(employeeId))
        })
      })
    } else if (formState?.employeMatricule) {
      employeeIds.add(String(formState.employeMatricule))
    }

    accumulator[campaignYear] = (accumulator[campaignYear] || 0) + employeeIds.size
    return accumulator
  }, {})

  return Object.entries(grouped)
    .map(([label, value]) => ({
      label: `Campagne ${label}`,
      value,
    }))
    .sort((left, right) => String(left.label).localeCompare(String(right.label)))
}

function getFormRequestsList(forms) {
  return Object.entries(forms).flatMap(([trackingId, form]) => {
    if (Array.isArray(form.trainingRequests) && form.trainingRequests.length > 0) {
      return form.trainingRequests.map((request) => ({
        trackingId,
        ...request,
      }))
    }

    if (form.intituleFormation) {
      return [{ trackingId, ...form }]
    }

    return []
  })
}

function buildTrainingYearsData(forms) {
  const grouped = getFormRequestsList(forms).reduce((accumulator, request) => {
    const year = String(request.echeance || '').slice(0, 4) || 'Sans date'
    accumulator[year] = (accumulator[year] || 0) + 1
    return accumulator
  }, {})

  return Object.entries(grouped)
    .map(([label, value]) => ({ label, value }))
    .sort((left, right) => String(left.label).localeCompare(String(right.label)))
}

function buildDepartmentNeedsData(rows, forms) {
  const grouped = rows.reduce((accumulator, row) => {
    const form = forms[row.id]
    const count = getTrainingRequestCount(form)
    accumulator[row.structure] = (accumulator[row.structure] || 0) + count
    return accumulator
  }, {})

  return Object.entries(grouped)
    .map(([label, value]) => ({ label, value }))
    .sort((left, right) => right.value - left.value)
    .slice(0, 6)
}

function buildLatestSubmittedRows(rows, forms) {
  return [...rows]
    .filter((row) => row.formStatus === 'Soumise')
    .sort((left, right) => parseTrackingDate(right.sentAt) - parseTrackingDate(left.sentAt))
    .slice(0, 5)
    .map((row) => ({
      title: row.structure,
      subtitle: getTrainingLabel(forms[row.id]),
      meta: `Soumise le ${row.sentAt}`,
      status: row.status,
      color: formStatusPalette[row.formStatus] || '#0f9d58',
    }))
}

function buildPendingStructuresRows(rows) {
  return [...rows]
    .filter((row) => row.formStatus !== 'Soumise')
    .sort((left, right) => parseTrackingDate(left.sentAt) - parseTrackingDate(right.sentAt))
    .slice(0, 5)
    .map((row) => ({
      title: row.structure,
      subtitle: row.manager,
      meta: `Envoyee le ${row.sentAt}`,
      status: row.formStatus,
      color: '#f59e0b',
    }))
}

function buildTopRequestedTrainings(forms) {
  const grouped = getFormRequestsList(forms).reduce((accumulator, request) => {
    const label = request.intituleFormation || 'Formation a preciser'
    accumulator[label] = (accumulator[label] || 0) + 1
    return accumulator
  }, {})

  return Object.entries(grouped)
    .map(([title, total]) => ({
      title,
      subtitle: 'Demandes de formation',
      meta: `${total} demande(s)`,
      status: 'Demandee',
      color: '#2563eb',
    }))
    .sort((left, right) => Number(right.meta.split(' ')[0]) - Number(left.meta.split(' ')[0]))
    .slice(0, 5)
}

function buildPieDataFromFormStatus(rows) {
  const grouped = rows.reduce(
    (accumulator, row) => {
      accumulator[row.formStatus] = (accumulator[row.formStatus] || 0) + 1
      return accumulator
    },
    { 'Non ouverte': 0, Brouillon: 0, Soumise: 0 }
  )

  return Object.entries(grouped).map(([name, value]) => ({
    name,
    value,
    color: formStatusPalette[name] || '#94a3b8',
  }))
}

function buildEmployerNotificationItems(notifications, currentRow, currentForm) {
  const items = []

  if (currentRow.formStatus === 'Non ouverte') {
    items.push({
      title: 'Fiche disponible pour demarrer la saisie des besoins',
      type: 'warning',
    })
  }

  if (currentForm.echeance && currentRow.formStatus !== 'Soumise') {
    items.push({
      title: `Rappel avant date limite : echeance fixee au ${formatDeadline(currentForm.echeance)}`,
      type: 'warning',
    })
  }

  if (currentRow.formStatus === 'Soumise') {
    items.push({
      title: 'Confirmation de soumission envoyee a la DDRH',
      type: 'success',
    })
  }

  if (currentRow.reopened) {
    items.push({
      title: 'La DDRH a demande une correction ou une precision sur votre fiche',
      type: 'danger',
    })
  }

  notifications.slice(0, 2).forEach((item) => {
    items.push({
      title: item.title,
      type: item.type === 'relance' ? 'warning' : 'success',
    })
  })

  return items.slice(0, 4)
}

function buildEmployerReviewTable(currentRow, currentForm, notifications) {
  const trainingRequests = Array.isArray(currentForm.trainingRequests)
    ? currentForm.trainingRequests
    : currentForm.intituleFormation
      ? [currentForm]
      : []

  const notificationItems = buildEmployerNotificationItems(notifications, currentRow, currentForm)

  return {
    notifications: notificationItems,
    items: trainingRequests.map((request, index) => {
      const formation = request.intituleFormation || `Formation ${index + 1}`
      const employeesCount = Array.isArray(request.employeeIds) ? request.employeeIds.length : 0

      let status = 'En attente DDRH'
      let color = '#f59e0b'
      let comment = currentRow.ddrhComment || 'Aucun retour DDRH pour le moment.'

      if (currentRow.locked && currentRow.status === 'Completee') {
        status = 'Acceptee'
        color = '#0f9d58'
        comment = currentRow.ddrhComment || 'Demande retenue dans la consolidation finale.'
      } else if (currentRow.locked && currentRow.status !== 'Completee') {
        status = 'Rejetee'
        color = '#db5c74'
        comment =
          currentRow.ddrhComment || 'Demande non retenue au regard du budget ou des priorites.'
      } else if (currentRow.reopened) {
        status = 'Observation DDRH'
        color = '#2563eb'
        comment =
          currentRow.ddrhComment ||
          'Merci de completer ou corriger la justification avant nouvelle soumission.'
      } else if (currentRow.formStatus === 'Soumise') {
        status = 'En analyse'
        color = '#7c3aed'
        comment = currentRow.ddrhComment || 'La DDRH examine actuellement cette demande.'
      }

      return {
        formation,
        status,
        color,
        priority: request.echeance
          ? `Echeance ${formatDeadline(request.echeance)}`
          : 'Priorite standard',
        employeesCount,
        comment,
      }
    }),
  }
}

export function buildDdrhDashboardModel() {
  const rows = getRowsWithRecipientMeta()
  const forms = getStoredFormStates()
  const trainingRequests = getFormRequestsList(forms)

  const submittedRows = rows.filter((row) => row.formStatus === 'Soumise' && !row.locked)
  const totalTrainings = trainingRequests.length

  return {
    role: 'DDRH',
    stats: [
      {
        title: 'Fiches envoyees',
        value: String(rows.length),
        subtitle: 'Nombre total de fiches diffusees',
        background: 'linear-gradient(135deg, #ef4444 0%, #fb7185 100%)',
        Icon: DescriptionRoundedIcon,
        borderColor: defaultAccent,
      },
      {
        title: 'Fiches a valider',
        value: String(submittedRows.length),
        subtitle: 'Fiches soumises en attente de validation',
        background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
        Icon: AssignmentTurnedInRoundedIcon,
        borderColor: defaultAccent,
      },
      {
        title: 'Formations demandees',
        value: String(totalTrainings),
        subtitle: 'Nombre total de besoins exprimes',
        background: 'linear-gradient(135deg, #0f9d58 0%, #34d399 100%)',
        Icon: AssessmentRoundedIcon,
        borderColor: defaultAccent,
      },
      {
        title: 'Utilisateurs',
        value: String(dashboardUsers.length),
        subtitle: 'Comptes employeurs et DDRH',
        background: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)',
        Icon: PeopleAltRoundedIcon,
        borderColor: defaultAccent,
      },
    ],
    charts: {
      lineTitle: 'Nombre de formations par annee',
      lineSubtitle: 'Repartition annuelle des demandes de formation',
      lineData: buildTrainingYearsData(forms),
      lineDataKey: 'value',
      lineXAxisKey: 'label',
      pieTitle: 'Etat des fiches',
      pieSubtitle: 'Vue d ensemble du cycle de traitement',
      pieData: buildPieDataFromFormStatus(rows),
      barTitle: 'Besoins par departement',
      barSubtitle: 'Departements les plus demandeurs en formation',
      barData: buildDepartmentNeedsData(rows, forms),
      barDataKey: 'value',
      barXAxisKey: 'label',
    },
    tables: {
      latestSubmitted: {
        title: 'Dernieres fiches soumises',
        subtitle: 'Les structures qui ont repondu le plus recemment',
        items: buildLatestSubmittedRows(rows, forms),
      },
      pendingStructures: {
        title: 'Structures qui n ont pas encore repondu',
        subtitle: 'Structures encore en attente de soumission',
        items: buildPendingStructuresRows(rows),
      },
      topTrainings: {
        title: 'Formations les plus demandees',
        subtitle: 'Les besoins les plus frequents de la campagne',
        items: buildTopRequestedTrainings(forms),
      },
    },
    quick: {
      title: 'Actions rapides',
      subtitle: 'Acces direct aux operations DDRH',
      items: [
        {
          title: 'Valider les fiches',
          subtitle: 'Traiter les fiches soumises en attente de validation',
          background: quickActionPalette.primary,
          Icon: AssignmentTurnedInRoundedIcon,
        },
        {
          title: 'Aller vers analyse',
          subtitle: 'Acceder a la consolidation et a l analyse des besoins',
          background: quickActionPalette.success,
          Icon: AssessmentRoundedIcon,
        },
      ],
    },
  }
}

export function buildEmployerDashboardModel(connectedEmail) {
  const rows = getRowsWithRecipientMeta().filter((row) => row.recipientEmail === connectedEmail)
  const notifications = getStoredNotifications().filter(
    (item) => item.recipientEmail === connectedEmail
  )
  const forms = getStoredFormStates()

  const drafts = rows.filter((row) => row.formStatus === 'Brouillon')
  const submitted = rows.filter((row) => row.formStatus === 'Soumise')
  const unopened = rows.filter((row) => row.formStatus === 'Non ouverte')
  const currentRow = getEmployerCurrentRow(rows)
  const currentForm = currentRow ? forms[currentRow.id] || {} : null
  const currentTrainingCount = currentForm ? getTrainingRequestCount(currentForm) : 0
  const requestedEmployeesCount = currentForm ? getRequestedEmployeesCount(currentForm) : 0
  const currentStatusLabel = getEmployerStatusLabel(currentRow)

  return {
    role: 'EMPLOYEUR',
    stats: [
      {
        title: 'Statut de ma fiche',
        value: currentStatusLabel,
        subtitle: 'Etat actuel de traitement',
        background: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)',
        Icon: DraftsRoundedIcon,
        borderColor: defaultAccent,
      },
      {
        title: 'Date limite',
        value: currentForm?.echeance ? formatDeadline(currentForm.echeance) : '--',
        subtitle: 'Echeance principale de soumission',
        background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
        Icon: ScheduleRoundedIcon,
        borderColor: defaultAccent,
      },
      {
        title: 'Formations demandees',
        value: String(currentTrainingCount),
        subtitle: `${requestedEmployeesCount} employe(s) concernes`,
        background: 'linear-gradient(135deg, #0f9d58 0%, #34d399 100%)',
        Icon: AssignmentTurnedInRoundedIcon,
        borderColor: defaultAccent,
      },
      {
        title: 'Besoins en formation',
        value: String(requestedEmployeesCount),
        subtitle: 'Nombre total d\'employes a former',
        background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
        Icon: PeopleAltRoundedIcon,
        borderColor: defaultAccent,
      },
    ],
    charts: {
      lineTitle: 'Suivi de mes fiches',
      lineSubtitle: 'Repartition des receptions sur la campagne actuelle',
      lineData: buildTimelineData(rows),
      lineDataKey: 'value',
      lineXAxisKey: 'label',
      pieTitle: 'Etat de mes demandes',
      pieSubtitle: 'Brouillons, soumissions et fiches a ouvrir',
      pieData: buildPieDataFromFormStatus(rows),
      barTitle: 'Employes formes par campagne',
      barSubtitle: 'Nombre d employes concernes par les formations de chaque campagne',
      barData: buildEmployeesByCampaignData(rows, forms),
      barDataKey: 'value',
      barXAxisKey: 'label',
    },
    workflow: {
      title: 'Avancement de mes actions',
      subtitle: 'Lecture, remplissage et soumission de vos fiches',
      steps: [
        {
          title: 'Fiches a ouvrir',
          subtitle: 'Demandes recues mais non encore commencees',
          progress: rows.length === 0 ? 0 : Math.round((unopened.length / rows.length) * 100),
          chip: unopened.length > 0 ? 'A traiter' : 'Termine',
          color: '#f59e0b',
        },
        {
          title: 'Brouillons en cours',
          subtitle: 'Fiches partiellement completees',
          progress: rows.length === 0 ? 0 : Math.round((drafts.length / rows.length) * 100),
          chip: drafts.length > 0 ? 'En cours' : 'Stable',
          color: '#2563eb',
        },
        {
          title: 'Soumissions finalisees',
          subtitle: 'Fiches deja transmises a la DDRH',
          progress: rows.length === 0 ? 0 : Math.round((submitted.length / rows.length) * 100),
          chip: submitted.length > 0 ? 'Soumis' : 'A faire',
          color: '#0f9d58',
        },
      ],
    },
    focusBlock: {
      title: 'Bloc principal',
      subtitle: 'Une fiche contient une ou plusieurs formations et plusieurs employes par formation',
      trackingId: currentRow?.id || '',
      ficheLabel: currentRow?.templateName || 'Aucune fiche active',
      statusLabel: currentStatusLabel,
      deadlineLabel: currentForm?.echeance ? formatDeadline(currentForm.echeance) : 'Non definie',
      trainingCount: currentTrainingCount,
      buttonLabel:
        currentRow?.formStatus === 'Soumise' && !currentRow?.reopened
          ? 'Voir ma fiche'
          : 'Continuer le brouillon',
      messages: [
        ...(currentRow?.reopened
          ? [
              {
                text: 'Votre fiche a ete reouverte par la DDRH pour correction.',
                background: '#eef4ff',
                border: '#d8e5ff',
                color: '#3156d3',
              },
            ]
          : []),
        ...(currentRow?.locked
          ? [
              {
                text: 'Votre fiche est verrouillee par la DDRH. Elle n est plus modifiable.',
                background: '#fff4df',
                border: '#f5dfb4',
                color: '#b96d12',
              },
            ]
          : []),
      ],
    },
    reviewTable: {
      title: 'Retour DDRH',
      subtitle: 'Notifications et commentaires DDRH sur votre fiche',
      ...buildEmployerReviewTable(
        currentRow || { formStatus: 'Non ouverte', locked: false, reopened: false, ddrhComment: '' },
        currentForm || {},
        notifications
      ),
    },
    quick: {
      title: 'Actions rapides',
      subtitle: 'Acces direct a vos operations courantes',
      items: [
        {
          title: 'Completer mes fiches',
          subtitle: 'Reprendre une fiche en brouillon ou reouverte',
          background: quickActionPalette.primary,
          Icon: DraftsRoundedIcon,
        },
        {
          title: 'Soumettre a la DDRH',
          subtitle: 'Finaliser les besoins de formation de votre structure',
          background: quickActionPalette.success,
          Icon: AssignmentTurnedInRoundedIcon,
        },
        {
          title: 'Suivre mes relances',
          subtitle: 'Verifier les rappels et les echeances recues',
          background: quickActionPalette.warning,
          Icon: ScheduleRoundedIcon,
        },
        {
          title: 'Securiser mon acces',
          subtitle: 'Verifier la 2FA et les notifications de connexion',
          background: quickActionPalette.accent,
          Icon: ShieldRoundedIcon,
        },
      ],
    },
  }
}

export const tooltipStyle = {
  contentStyle: {
    borderRadius: 12,
    border: '1px solid #e6ebf2',
    background: 'rgba(255,255,255,0.98)',
    boxShadow: '0 14px 28px rgba(20, 31, 56, 0.10)',
  },
  labelStyle: { color: '#516078', fontWeight: 700 },
  itemStyle: { color: '#18263f' },
}

export const dashboardSurfaceSx = {
  p: { xs: 2, md: 2.3 },
  borderRadius: '18px',
  background: 'linear-gradient(180deg, rgba(255,255,255,0.99) 0%, rgba(248,250,255,0.98) 100%)',
  border: '1px solid #e5ebf3',
  boxShadow: '0 10px 24px rgba(20, 31, 56, 0.08)',
}

export const dashboardMainGridSx = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    lg: '1.4fr 1fr',
  },
  gap: 2,
}

export const dashboardSecondaryGridSx = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    lg: '1.15fr 1fr',
  },
  gap: 2,
}

export const alertsListSx = {
  spacing: 1,
}

export const alertItemSx = {
  p: 1.3,
  borderRadius: '12px',
  border: '1px solid #edf1f6',
  background: '#fbfcff',
}

export const campaignCardSx = {
  p: 1.4,
  borderRadius: '14px',
  border: '1px solid #e8edf5',
  background: '#fff',
}

export const quickActionsGridSx = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(2, 1fr)',
  },
  gap: 1.4,
}

export const quickActionCardSx = (background) => ({
  p: 2,
  minHeight: 132,
  borderRadius: '14px',
  position: 'relative',
  overflow: 'hidden',
  background,
  border: '1px solid rgba(255,255,255,0.16)',
  boxShadow: '0 10px 20px rgba(20, 31, 56, 0.10)',
})

export const floatingIconSx = {
  position: 'absolute',
  top: 10,
  right: 12,
  color: 'rgba(255,255,255,0.20)',
  '& svg': { fontSize: 32 },
}

export const whiteActionButtonSx = {
  mt: 2,
  bgcolor: 'rgba(255,255,255,0.18)',
  color: '#fff',
  textTransform: 'none',
  fontWeight: 700,
  borderRadius: '10px',
  boxShadow: 'none',
  '&:hover': {
    bgcolor: 'rgba(255,255,255,0.24)',
    boxShadow: 'none',
  },
}

export const recentListSx = {
  spacing: 1,
}

export const recentItemSx = {
  p: 1.35,
  borderRadius: '12px',
  border: '1px solid #edf1f6',
  background: '#fff',
}
