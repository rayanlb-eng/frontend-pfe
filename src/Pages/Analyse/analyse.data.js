import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import BalanceRoundedIcon from '@mui/icons-material/BalanceRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded'
import {
  FICHE_FORMS_STORAGE_KEY,
  TRACKING_ROWS_STORAGE_KEY,
  getStoredFormStates,
  getStoredTrackingRows,
  saveFormStates,
  saveTrackingRows,
} from '../Fiches/fiches.data'

export const ANALYSIS_STATE_STORAGE_KEY = 'analysisPrioritiesState'
export const ANALYSIS_BUDGET_CAPACITY = 900000

export const analysisSummaryCards = [
  {
    key: 'submitted',
    title: 'Fiches soumises',
    Icon: AutoAwesomeRoundedIcon,
    background: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)',
  },
  {
    key: 'nonJustified',
    title: 'Demandes non justifiees',
    Icon: ReportProblemRoundedIcon,
    background: 'linear-gradient(135deg, #ef4444 0%, #fb7185 100%)',
  },
  {
    key: 'budget',
    title: 'Budget engage',
    Icon: BalanceRoundedIcon,
    background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
  },
  {
    key: 'locked',
    title: 'Fiches verrouillees',
    Icon: LockRoundedIcon,
    background: 'linear-gradient(135deg, #0f9d58 0%, #34d399 100%)',
  },
]

function normalizeKey(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
}

function computeUrgencyScore(echeance) {
  if (!echeance) return 35
  const today = new Date()
  const deadline = new Date(echeance)
  const diffInDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diffInDays <= 30) return 100
  if (diffInDays <= 60) return 75
  if (diffInDays <= 120) return 55
  return 35
}

function estimateBudget(title, requestCount) {
  const normalizedTitle = normalizeKey(title)

  let baseBudget = 100000

  if (
    normalizedTitle.includes('cyber') ||
    normalizedTitle.includes('securite') ||
    normalizedTitle.includes('data')
  ) {
    baseBudget = 210000
  } else if (
    normalizedTitle.includes('leadership') ||
    normalizedTitle.includes('management') ||
    normalizedTitle.includes('projet')
  ) {
    baseBudget = 160000
  } else if (
    normalizedTitle.includes('communication') ||
    normalizedTitle.includes('comportement')
  ) {
    baseBudget = 120000
  }

  return baseBudget + Math.max(0, requestCount - 1) * 45000
}

function computeBudgetScore(estimatedBudget) {
  if (estimatedBudget <= 150000) return 95
  if (estimatedBudget <= 250000) return 75
  if (estimatedBudget <= 350000) return 55
  return 30
}

function computePriority(requestCount, urgencyScore, budgetScore) {
  const requestScore = Math.min(requestCount * 25, 100)
  const finalScore = Math.round(requestScore * 0.4 + urgencyScore * 0.35 + budgetScore * 0.25)

  if (finalScore >= 75) return { label: 'Haute', score: finalScore }
  if (finalScore >= 50) return { label: 'Moyenne', score: finalScore }
  return { label: 'Basse', score: finalScore }
}

export function getStoredAnalysisState() {
  const raw = localStorage.getItem(ANALYSIS_STATE_STORAGE_KEY)
  return raw ? JSON.parse(raw) : {}
}

export function saveAnalysisState(nextState) {
  localStorage.setItem(ANALYSIS_STATE_STORAGE_KEY, JSON.stringify(nextState))
}

export function buildAnalysisItems() {
  const trackingRows = getStoredTrackingRows()
  const formStates = getStoredFormStates()
  const storedAnalysisState = getStoredAnalysisState()

  const submittedRows = trackingRows.filter((row) => row.formStatus === 'Soumise')

  const grouped = submittedRows.reduce((accumulator, row) => {
    const form = formStates[row.id] || {}
    const key = normalizeKey(form.intituleFormation || row.templateName || row.id)

    if (!accumulator[key]) {
      accumulator[key] = {
        id: key,
        title: form.intituleFormation || row.templateName,
        demandes: [],
        structures: new Set(),
        employeurs: [],
        earliestDeadline: form.echeance || '',
        context: form.contexteFormation || '',
        objective: form.objectif || '',
        locked: false,
        status: 'En analyse',
      }
    }

    accumulator[key].demandes.push(row.id)
    accumulator[key].structures.add(row.structure)
    accumulator[key].employeurs.push(row.manager)

    if (form.echeance) {
      if (!accumulator[key].earliestDeadline || form.echeance < accumulator[key].earliestDeadline) {
        accumulator[key].earliestDeadline = form.echeance
      }
    }

    if (!accumulator[key].context && form.contexteFormation) {
      accumulator[key].context = form.contexteFormation
    }

    if (!accumulator[key].objective && form.objectif) {
      accumulator[key].objective = form.objectif
    }

    return accumulator
  }, {})

  return Object.values(grouped).map((item) => {
    const requestCount = item.demandes.length
    const urgencyScore = computeUrgencyScore(item.earliestDeadline)
    const estimatedBudget = estimateBudget(item.title, requestCount)
    const budgetScore = computeBudgetScore(estimatedBudget)
    const autoPriority = computePriority(requestCount, urgencyScore, budgetScore)
    const persisted = storedAnalysisState[item.id] || {}

    return {
      ...item,
      structures: Array.from(item.structures),
      autoPriority: autoPriority.label,
      autoPriorityScore: autoPriority.score,
      manualPriority: persisted.manualPriority || autoPriority.label,
      estimatedBudget,
      urgencyScore,
      budgetScore,
      requestCount,
      status: persisted.status || 'En analyse',
      justificationNote: persisted.justificationNote || '',
      locked: Boolean(persisted.locked),
      demandePrecision: Boolean(persisted.demandePrecision),
    }
  })
}

export function computeAnalysisSummary(items) {
  const totalBudget = items.reduce(
    (sum, item) => (item.status === 'Reportee' ? sum : sum + item.estimatedBudget),
    0
  )

  return {
    submitted: items.reduce((sum, item) => sum + item.requestCount, 0),
    nonJustified: items.filter((item) => item.status === 'Non justifiee').length,
    budget: totalBudget,
    locked: items.filter((item) => item.locked).length,
    totalBudget,
    exceedsBudget: totalBudget > ANALYSIS_BUDGET_CAPACITY,
  }
}

export function persistAnalysisItem(nextItem) {
  const currentState = getStoredAnalysisState()
  const nextState = {
    ...currentState,
    [nextItem.id]: {
      manualPriority: nextItem.manualPriority,
      status: nextItem.status,
      justificationNote: nextItem.justificationNote,
      locked: nextItem.locked,
      demandePrecision: nextItem.demandePrecision,
    },
  }
  saveAnalysisState(nextState)
}

export function lockAnalysisItem(itemId) {
  const currentState = getStoredAnalysisState()
  const nextState = {
    ...currentState,
    [itemId]: {
      ...(currentState[itemId] || {}),
      locked: true,
    },
  }
  saveAnalysisState(nextState)

  const trackingRows = getStoredTrackingRows()
  const formStates = getStoredFormStates()

  const nextRows = trackingRows.map((row) => {
    const form = formStates[row.id] || {}
    const key = normalizeKey(form.intituleFormation || row.templateName || row.id)

    if (key !== itemId) return row

    return {
      ...row,
      locked: true,
    }
  })

  saveTrackingRows(nextRows)
}

export function reopenAnalysisItem(itemId) {
  const currentState = getStoredAnalysisState()
  const nextState = {
    ...currentState,
    [itemId]: {
      ...(currentState[itemId] || {}),
      locked: false,
    },
  }
  saveAnalysisState(nextState)

  const trackingRows = getStoredTrackingRows()
  const formStates = getStoredFormStates()

  const nextRows = trackingRows.map((row) => {
    const form = formStates[row.id] || {}
    const key = normalizeKey(form.intituleFormation || row.templateName || row.id)

    if (key !== itemId) return row

    return {
      ...row,
      locked: false,
    }
  })

  saveTrackingRows(nextRows)
}

export { TRACKING_ROWS_STORAGE_KEY, FICHE_FORMS_STORAGE_KEY, saveTrackingRows, saveFormStates }
