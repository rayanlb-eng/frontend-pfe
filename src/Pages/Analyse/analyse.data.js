import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import BarChartIcon from '@mui/icons-material/BarChart'
import DescriptionIcon from '@mui/icons-material/Description'
import PeopleIcon from '@mui/icons-material/People'

export const ANALYSE_DECISIONS_STORAGE_KEY = 'analyseTrainingDecisions'

const defaultAccent = 'rgba(255,255,255,0.16)'

export function getStoredAnalyseState() {
  const raw = localStorage.getItem(ANALYSE_DECISIONS_STORAGE_KEY)
  return raw ? JSON.parse(raw) : {}
}

export function saveStoredAnalyseState(state) {
  localStorage.setItem(ANALYSE_DECISIONS_STORAGE_KEY, JSON.stringify(state))
}

export function cleanText(value) {
  return String(value || '')
    .replaceAll('ÃƒÂ©', 'é')
    .replaceAll('ÃƒÂ¨', 'è')
    .replaceAll('ÃƒÂª', 'ê')
    .replaceAll('ÃƒÂ«', 'ë')
    .replaceAll('Ãƒ ', 'à')
    .replaceAll('ÃƒÂ¢', 'â')
    .replaceAll('ÃƒÂ¹', 'ù')
    .replaceAll('ÃƒÂ»', 'û')
    .replaceAll('ÃƒÂ®', 'î')
    .replaceAll('ÃƒÂ¯', 'ï')
    .replaceAll('ÃƒÂ´', 'ô')
    .replaceAll('ÃƒÂ§', 'ç')
    .replaceAll('Ã©', 'é')
    .replaceAll('Ã¨', 'è')
    .replaceAll('Ãª', 'ê')
    .replaceAll('Ã«', 'ë')
    .replaceAll('Ã ', 'à')
    .replaceAll('Ã¢', 'â')
    .replaceAll('Ã¹', 'ù')
    .replaceAll('Ã»', 'û')
    .replaceAll('Ã®', 'î')
    .replaceAll('Ã¯', 'ï')
    .replaceAll('Ã´', 'ô')
    .replaceAll('Ã§', 'ç')
    .replaceAll('â€™', "'")
    .replaceAll('â€“', '-')
}

export function normalizeTrainingTitle(title) {
  return cleanText(title).trim().toLowerCase()
}

export function getPriorityColor(priority) {
  if (priority === 'Haute') return '#dc2626'
  if (priority === 'Moyenne') return '#d97706'
  return '#15803d'
}

export function getDecisionColor(decision) {
  if (decision === 'Acceptée') return '#15803d'
  if (decision === 'Refusée') return '#b45309'
  if (decision === 'Non justifiée') return '#dc2626'
  return '#64748b'
}

export function getCategoryFromRequest(title, context = '') {
  const text = `${cleanText(title)} ${cleanText(context)}`.toLowerCase()

  if (text.includes('excel') || text.includes('power bi')) return 'Outils'
  if (
    text.includes('cyber') ||
    text.includes('itil') ||
    text.includes('si') ||
    text.includes('audit')
  ) {
    return 'Technique'
  }
  if (text.includes('leadership') || text.includes('management') || text.includes('changement')) {
    return 'Transversale'
  }

  return 'Métier'
}

export function getDefaultPriority(structuresCount, employeesCount) {
  if (structuresCount >= 3 || employeesCount >= 5) return 'Haute'
  if (structuresCount >= 2 || employeesCount >= 3) return 'Moyenne'
  return 'Basse'
}

export function computeScore(priority, structuresCount, employeesCount) {
  const priorityWeight = priority === 'Haute' ? 40 : priority === 'Moyenne' ? 25 : 12
  return priorityWeight + structuresCount * 18 + employeesCount * 8
}

export function buildAnalyseRows(trackingRows, formStates, employeesDirectory, analyseState) {
  const eligibleRows = trackingRows.filter(
    (row) => row.formStatus === 'Soumise' || row.ddrhDecision === 'Validee'
  )

  const groups = new Map()

  eligibleRows.forEach((trackingRow) => {
    const requests = formStates[trackingRow.id]?.trainingRequests || []

    requests.forEach((request) => {
      const title = cleanText(request.intituleFormation).trim()
      if (!title) return

      const groupKey = normalizeTrainingTitle(title)
      const existing = groups.get(groupKey) || {
        key: groupKey,
        formation: title,
        categorie: getCategoryFromRequest(request.intituleFormation, request.contexteFormation),
        structuresMap: new Map(),
        employeesMap: new Map(),
      }

      existing.structuresMap.set(trackingRow.recipientId, {
        recipientId: trackingRow.recipientId,
        structure: cleanText(trackingRow.structure),
        manager: cleanText(trackingRow.manager),
        trackingId: trackingRow.id,
        formStatus: trackingRow.formStatus,
        ddrhDecision: trackingRow.ddrhDecision || '',
      })

      ;(request.employeeIds || []).forEach((employeeId) => {
        const employee = employeesDirectory.find(
          (item) => String(item.idEmploye) === String(employeeId)
        )

        existing.employeesMap.set(`${trackingRow.recipientId}-${employeeId}`, {
          employeeId: String(employeeId),
          fullName: employee
            ? `${cleanText(employee.prenom)} ${cleanText(employee.nom)}`
            : `Employé ${employeeId}`,
          poste: employee ? cleanText(employee.poste) : 'Poste non renseigné',
          division: employee ? cleanText(employee.division) : '',
          structure: cleanText(trackingRow.structure),
          manager: cleanText(trackingRow.manager),
        })
      })

      groups.set(groupKey, existing)
    })
  })

  return Array.from(groups.values())
    .map((group) => {
      const structures = Array.from(group.structuresMap.values())
      const employees = Array.from(group.employeesMap.values())
      const persisted = analyseState[group.key] || {}
      const priorite =
        persisted.priorite || getDefaultPriority(structures.length, employees.length)
      const decision = persisted.decision || 'À décider'

      return {
        key: group.key,
        formation: group.formation,
        categorie: group.categorie,
        structures,
        employees,
        structuresCount: structures.length,
        employeesCount: employees.length,
        priorite,
        decision,
        comment: persisted.comment || '',
        score: computeScore(priorite, structures.length, employees.length),
      }
    })
    .sort((left, right) => right.score - left.score)
}

export function buildAnalyseStats(rows) {
  return [
    {
      title: 'Formations regroupées',
      value: rows.length,
      subtitle: 'Besoins consolidés depuis les fiches soumises',
      background: 'linear-gradient(135deg, #16A34A, #4ADE80)',
      Icon: BarChartIcon,
      borderColor: defaultAccent,
    },
    {
      title: 'Employés concernés',
      value: rows.reduce((total, row) => total + row.employeesCount, 0),
      subtitle: 'Participants identifiés',
      background: 'linear-gradient(135deg, #2563EB, #60A5FA)',
      Icon: PeopleIcon,
      borderColor: defaultAccent,
    },
    {
      title: 'À décider',
      value: rows.filter((row) => row.decision === 'À décider').length,
      subtitle: 'Arbitrages encore ouverts',
      background: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
      Icon: AssignmentTurnedInIcon,
      borderColor: defaultAccent,
    },
    {
      title: 'Non justifiées',
      value: rows.filter((row) => row.decision === 'Non justifiée').length,
      subtitle: 'Demandes écartées par la DDRH',
      background: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
      Icon: DescriptionIcon,
      borderColor: defaultAccent,
    },
  ]
}
