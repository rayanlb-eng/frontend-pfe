import GppBadRoundedIcon from '@mui/icons-material/GppBadRounded'
import { Alert, Box, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import MainLayout from '../../components/layout/mainLayout'
import { CONNECTED_USER_ROLE_KEY } from '../Users/users.data'
import {
  ANALYSIS_BUDGET_CAPACITY,
  analysisSummaryCards,
  buildAnalysisItems,
  computeAnalysisSummary,
  lockAnalysisItem,
  persistAnalysisItem,
  reopenAnalysisItem,
} from './analyse.data'
import { analysisGridSx } from './analyse.styles'
import {
  AnalysisBudgetPanel,
  AnalysisItemsPanel,
  AnalysisSummaryCards,
} from './analyse.sections'

export default function AnalysePage() {
  const connectedUserRole = localStorage.getItem(CONNECTED_USER_ROLE_KEY) || 'DDRH'
  const [items, setItems] = useState(buildAnalysisItems())
  const summary = useMemo(() => computeAnalysisSummary(items), [items])

  const updateItem = (itemId, updater) => {
    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== itemId) return item
        const nextItem = updater(item)
        persistAnalysisItem(nextItem)
        return nextItem
      })
    )
  }

  const handlePriorityChange = (item, manualPriority) => {
    updateItem(item.id, (currentItem) => ({ ...currentItem, manualPriority }))
  }

  const handleStatusChange = (item, status) => {
    updateItem(item.id, (currentItem) => ({
      ...currentItem,
      status,
      demandePrecision: status === 'Precision demandee',
    }))
  }

  const handleNoteChange = (item, justificationNote) => {
    updateItem(item.id, (currentItem) => ({ ...currentItem, justificationNote }))
  }

  const handleLock = (item) => {
    lockAnalysisItem(item.id)
    updateItem(item.id, (currentItem) => ({
      ...currentItem,
      locked: true,
      status: currentItem.status === 'En analyse' ? 'Validee' : currentItem.status,
    }))
  }

  const handleUnlock = (item) => {
    reopenAnalysisItem(item.id)
    updateItem(item.id, (currentItem) => ({
      ...currentItem,
      locked: false,
    }))
  }

  if (connectedUserRole !== 'DDRH') {
    return (
      <MainLayout>
        <Alert severity="error" icon={<GppBadRoundedIcon fontSize="inherit" />} sx={{ borderRadius: '14px' }}>
          Cette fonctionnalite est reservee a la DDRH. Un employeur ne peut pas acceder a
          l&apos;analyse et a la priorisation des besoins.
        </Alert>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <Box sx={{ display: 'grid', gap: 3 }}>
        <Box>
          <Typography sx={{ fontSize: '1.6rem', fontWeight: 800, color: '#1b2740' }}>
            Analyse et priorisation
          </Typography>
          <Typography sx={{ mt: 0.55, fontSize: '0.92rem', color: '#72809a', maxWidth: 860 }}>
            La DDRH regroupe les demandes similaires, laisse le systeme calculer une priorite
            automatique, puis ajuste manuellement selon l&apos;urgence et le budget disponible.
          </Typography>
        </Box>

        <AnalysisSummaryCards summaryCards={analysisSummaryCards} summary={summary} />

        {summary.exceedsBudget ? (
          <Alert severity="warning" sx={{ borderRadius: '14px' }}>
            Le budget depasse la capacite prevue. Reduisez certaines priorites ou reportez des
            formations avant le verrouillage final.
          </Alert>
        ) : null}

        <Box sx={analysisGridSx}>
          <AnalysisItemsPanel
            items={items}
            onPriorityChange={handlePriorityChange}
            onStatusChange={handleStatusChange}
            onNoteChange={handleNoteChange}
            onLock={handleLock}
            onUnlock={handleUnlock}
          />
          <AnalysisBudgetPanel summary={summary} budgetCapacity={ANALYSIS_BUDGET_CAPACITY} />
        </Box>
      </Box>
    </MainLayout>
  )
}
