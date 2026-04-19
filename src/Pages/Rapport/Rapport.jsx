import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded'
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded'
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import MainLayout from '../../components/layout/mainLayout'
import { getStoredAnalysisState } from '../Analyse/analyse.data'
import { getStoredFormStates, getStoredTrackingRows } from '../Fiches/fiches.data'

const REPORT_STATUS_STORAGE_KEY = 'rapportStatusState'
const REPORT_STATUS = {
  DRAFT: 'Brouillon',
  GENERATED: 'Genere',
  NEEDS_REVIEW: 'A corriger',
  FINALIZED: 'Finalise',
  SENT: 'Envoye',
  FAILED: 'Generation indisponible',
}

function normalizeKey(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
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

function buildReportData() {
  const trackingRows = getStoredTrackingRows()
  const formStates = getStoredFormStates()
  const analysisState = getStoredAnalysisState()

  const submittedRows = trackingRows.filter((row) => row.formStatus === 'Soumise')

  const duplicateMap = submittedRows.reduce((accumulator, row) => {
    const form = formStates[row.id] || {}
    const duplicateKey = `${normalizeKey(form.employeMatricule)}::${normalizeKey(form.intituleFormation)}`

    if (!accumulator[duplicateKey]) {
      accumulator[duplicateKey] = []
    }

    accumulator[duplicateKey].push(row.id)
    return accumulator
  }, {})

  const groupedItems = submittedRows.reduce((accumulator, row) => {
    const form = formStates[row.id] || {}
    const title = form.intituleFormation || row.templateName || 'Sans intitule'
    const key = normalizeKey(title)
    const analysisItem = analysisState[key] || {}
    const duplicateKey = `${normalizeKey(form.employeMatricule)}::${normalizeKey(form.intituleFormation)}`
    const hasDuplicate = duplicateMap[duplicateKey]?.length > 1

    if (!accumulator[key]) {
      accumulator[key] = {
        id: key,
        title,
        requests: [],
        structures: new Set(),
        priorities: [],
        statuses: [],
        anomalies: [],
      }
    }

    accumulator[key].requests.push({
      trackingId: row.id,
      manager: row.manager,
      structure: row.structure,
      employeMatricule: form.employeMatricule || '',
      employeName: `${form.employeNom || ''} ${form.employePrenom || ''}`.trim(),
      objective: form.objectif || '',
      kpi: form.kpi || '',
      echeance: form.echeance || '',
      duplicate: hasDuplicate,
    })
    accumulator[key].structures.add(row.structure)
    accumulator[key].priorities.push(analysisItem.manualPriority || 'Moyenne')
    accumulator[key].statuses.push(analysisItem.status || 'En analyse')

    if (hasDuplicate) {
      accumulator[key].anomalies.push({
        trackingId: row.id,
        message: `Formation demandee deux fois pour le matricule ${form.employeMatricule || 'inconnu'}.`,
      })
    }

    return accumulator
  }, {})

  const items = Object.values(groupedItems).map((item) => {
    const requestCount = item.requests.length
    const budget = estimateBudget(item.title, requestCount)
    const nonJustifiedCount = item.statuses.filter((status) => status === 'Non justifiee').length
    const reportStatus =
      nonJustifiedCount > 0
        ? 'A revoir'
        : item.anomalies.length > 0
          ? 'Anomalie'
          : 'Pret'

    return {
      id: item.id,
      title: item.title,
      requestCount,
      structures: Array.from(item.structures),
      budget,
      priority: item.priorities.includes('Haute')
        ? 'Haute'
        : item.priorities.includes('Moyenne')
          ? 'Moyenne'
          : 'Basse',
      status: reportStatus,
      anomalies: item.anomalies,
      requests: item.requests,
      validatedRequests: item.statuses.filter((status) => status === 'Validee').length,
      nonJustifiedCount,
    }
  })

  const totalBudget = items.reduce((sum, item) => sum + item.budget, 0)
  const anomaliesCount = items.reduce((sum, item) => sum + item.anomalies.length, 0)
  const topThemes = [...items]
    .sort((a, b) => b.requestCount - a.requestCount)
    .slice(0, 3)
    .map((item) => `${item.title} (${item.requestCount})`)

  const trends = [
    `Themes dominants : ${topThemes.join(', ') || 'Aucun theme disponible'}`,
    `${items.filter((item) => item.priority === 'Haute').length} formation(s) sont actuellement classees en priorite haute.`,
    `${items.reduce((sum, item) => sum + item.validatedRequests, 0)} fiche(s) ont deja une priorite validee dans l'analyse DDRH.`,
  ]

  return {
    items,
    summary: {
      retained: items.length,
      budget: totalBudget,
      priority: items.filter((item) => item.priority === 'Haute').length,
      anomalies: anomaliesCount,
    },
    trends,
  }
}

function summaryCardSx(background) {
  return {
    p: 2,
    minHeight: 126,
    borderRadius: '14px',
    position: 'relative',
    overflow: 'hidden',
    background,
    border: '1px solid rgba(255,255,255,0.16)',
    boxShadow: '0 10px 20px rgba(20, 31, 56, 0.10)',
  }
}

function chipSx(kind) {
  const map = {
    Haute: { bg: '#ffe7ec', color: '#cc3558' },
    Moyenne: { bg: '#fff3df', color: '#c77817' },
    Basse: { bg: '#e8f7ee', color: '#168553' },
    Pret: { bg: '#e8f7ee', color: '#168553' },
    Anomalie: { bg: '#ffe7ec', color: '#cc3558' },
    'A revoir': { bg: '#fff3df', color: '#c77817' },
  }

  const style = map[kind] || { bg: '#eef2f7', color: '#64748b' }

  return {
    bgcolor: style.bg,
    color: style.color,
    fontWeight: 800,
    borderRadius: '10px',
  }
}

const surfaceSx = {
  p: { xs: 2, md: 2.3 },
  borderRadius: '18px',
  background:
    'linear-gradient(180deg, rgba(255,255,255,0.99) 0%, rgba(248,250,255,0.98) 100%)',
  border: '1px solid #e5ebf3',
  boxShadow: '0 10px 24px rgba(20, 31, 56, 0.08)',
}

export default function Rapport() {
  const [reportData, setReportData] = useState(() => buildReportData())
  const [reportStatus, setReportStatus] = useState(
    () => localStorage.getItem(REPORT_STATUS_STORAGE_KEY) || REPORT_STATUS.DRAFT
  )
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    localStorage.setItem(REPORT_STATUS_STORAGE_KEY, reportStatus)
  }, [reportStatus])

  const hasAnomalies = reportData.summary.anomalies > 0
  const reportReady =
    reportStatus === REPORT_STATUS.GENERATED ||
    reportStatus === REPORT_STATUS.FINALIZED ||
    reportStatus === REPORT_STATUS.SENT
  const reportSent = reportStatus === REPORT_STATUS.SENT
  const generationFailed = reportStatus === REPORT_STATUS.FAILED

  const handleGenerateReport = () => {
    const nextData = buildReportData()
    setReportData(nextData)
    setReportStatus(
      nextData.summary.anomalies > 0 ? REPORT_STATUS.NEEDS_REVIEW : REPORT_STATUS.GENERATED
    )
    setFeedback(
      nextData.summary.anomalies > 0
        ? 'Le rapport a ete regenere mais des anomalies restent a corriger.'
        : "Le rapport de synthese a ete genere avec succes et l'apercu est disponible."
    )
  }

  const handleSimulateFailure = () => {
    setReportStatus(REPORT_STATUS.FAILED)
    setFeedback(
      "La generation automatique a echoue. La DDRH peut telecharger les fiches et poursuivre l'analyse hors ligne."
    )
  }

  const handleResolveAnomaly = (itemId, trackingId) => {
    setReportData((currentData) => {
      const nextItems = currentData.items.map((item) => {
        if (item.id !== itemId) return item

        const nextAnomalies = item.anomalies.filter((anomaly) => anomaly.trackingId !== trackingId)
        return {
          ...item,
          anomalies: nextAnomalies,
          status: nextAnomalies.length === 0 && item.nonJustifiedCount === 0 ? 'Pret' : item.status,
        }
      })

      return {
        ...currentData,
        items: nextItems,
        summary: {
          ...currentData.summary,
          anomalies: Math.max(0, currentData.summary.anomalies - 1),
        },
      }
    })

    setReportStatus(REPORT_STATUS.NEEDS_REVIEW)
    setFeedback('L anomalie a ete corrigee manuellement. Relancez la generation pour finaliser le rapport.')
  }

  const handleExport = (format) => {
    if (reportStatus === REPORT_STATUS.GENERATED) {
      setReportStatus(REPORT_STATUS.FINALIZED)
    }
    setFeedback(`Export ${format} prepare pour la direction.`)
  }

  const handleOfflineDownload = (label) => {
    setFeedback(`${label} telecharge pour traitement hors ligne.`)
  }

  const handleFinalizeReport = () => {
    if (hasAnomalies) {
      setReportStatus(REPORT_STATUS.NEEDS_REVIEW)
      setFeedback('Le rapport contient encore des anomalies. Corrigez-les avant finalisation.')
      return
    }

    setReportStatus(REPORT_STATUS.FINALIZED)
    setFeedback('Le rapport est finalise. Vous pouvez maintenant l exporter ou l envoyer.')
  }

  const handleSendToDirection = () => {
    setReportStatus(REPORT_STATUS.SENT)
    setFeedback('Le rapport finalise a ete prepare pour envoi a la direction.')
  }

  const reportStatusColor =
    reportStatus === REPORT_STATUS.SENT || reportStatus === REPORT_STATUS.FINALIZED
      ? 'success'
      : reportStatus === REPORT_STATUS.GENERATED
        ? 'info'
        : reportStatus === REPORT_STATUS.NEEDS_REVIEW || reportStatus === REPORT_STATUS.FAILED
          ? 'warning'
          : 'default'

  const summaryCards = [
    {
      title: 'Fiches retenues',
      value: reportData.summary.retained,
      subtitle: 'Formations compilees',
      background: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)',
      Icon: AssessmentRoundedIcon,
    },
    {
      title: 'Budget estime',
      value: `${Math.round(reportData.summary.budget / 1000)}k`,
      subtitle: 'DZD consolides',
      background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
      Icon: TrendingUpRoundedIcon,
    },
    {
      title: 'Priorites hautes',
      value: reportData.summary.priority,
      subtitle: 'Demandes prioritaires',
      background: 'linear-gradient(135deg, #0f9d58 0%, #34d399 100%)',
      Icon: TaskAltRoundedIcon,
    },
    {
      title: 'Anomalies',
      value: reportData.summary.anomalies,
      subtitle: 'Corrections necessaires',
      background: 'linear-gradient(135deg, #ef4444 0%, #fb7185 100%)',
      Icon: ErrorOutlineRoundedIcon,
    },
  ]

  return (
    <MainLayout>
      <Box sx={{ display: 'grid', gap: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
            alignItems: { xs: 'flex-start', md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Box>
            <Typography sx={{ fontSize: '1.6rem', fontWeight: 800, color: '#1b2740' }}>
              Rapport de synthese
            </Typography>
            <Typography sx={{ mt: 0.55, fontSize: '0.92rem', color: '#72809a', maxWidth: 860 }}>
              Compilation des fiches, application des priorites validees et generation du rapport
              final pour la direction.
            </Typography>
            <Chip
              label={`Statut : ${reportStatus}`}
              color={reportStatusColor}
              size="small"
              sx={{ mt: 1.2, fontWeight: 800, borderRadius: '10px' }}
            />
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
            <Button
              variant="contained"
              startIcon={<AssessmentRoundedIcon />}
              onClick={handleGenerateReport}
              sx={{ borderRadius: '14px', textTransform: 'none', fontWeight: 800 }}
            >
              Generer le rapport
            </Button>
            <Button
              variant="outlined"
              startIcon={<ErrorOutlineRoundedIcon />}
              onClick={handleSimulateFailure}
              sx={{ borderRadius: '14px', textTransform: 'none', fontWeight: 700 }}
            >
              Simuler une panne
            </Button>
          </Stack>
        </Box>

        {feedback ? (
          <Alert severity={generationFailed ? 'warning' : 'success'} sx={{ borderRadius: '14px' }}>
            {feedback}
          </Alert>
        ) : null}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              xl: 'repeat(4, 1fr)',
            },
            gap: 1.6,
          }}
        >
          {summaryCards.map(({ title, value, subtitle, background, Icon }) => (
            <Paper key={title} elevation={0} sx={summaryCardSx(background)}>
              <Box
                sx={{
                  position: 'absolute',
                  top: 10,
                  right: 12,
                  color: 'rgba(255,255,255,0.20)',
                  '& svg': { fontSize: 32 },
                }}
              >
                <Icon />
              </Box>
              <Typography sx={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.92)', fontWeight: 700 }}>
                {title}
              </Typography>
              <Typography sx={{ fontSize: '2.1rem', fontWeight: 800, mt: 1.3, color: '#fff' }}>
                {value}
              </Typography>
              <Typography sx={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.95)', mt: 1, fontWeight: 700 }}>
                {subtitle}
              </Typography>
            </Paper>
          ))}
        </Box>

        {generationFailed ? (
          <Paper elevation={0} sx={surfaceSx}>
            <Stack spacing={1.4}>
              <Typography sx={{ fontWeight: 800, color: '#1b2740', fontSize: '1rem' }}>
                Generation indisponible
              </Typography>
              <Typography sx={{ fontSize: '0.9rem', color: '#6b778c' }}>
                Une panne empeche la generation automatique. La DDRH peut telecharger les fiches et
                les analyser hors ligne.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
                <Button
                  variant="outlined"
                  startIcon={<DownloadRoundedIcon />}
                  onClick={() => handleOfflineDownload('Les fiches source')}
                  sx={{ borderRadius: '14px', textTransform: 'none', fontWeight: 700 }}
                >
                  Telecharger les fiches
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<FileDownloadRoundedIcon />}
                  onClick={() => handleOfflineDownload('Les donnees brutes')}
                  sx={{ borderRadius: '14px', textTransform: 'none', fontWeight: 700 }}
                >
                  Exporter les donnees brutes
                </Button>
              </Stack>
            </Stack>
          </Paper>
        ) : null}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1.08fr 0.92fr' },
            gap: 2,
          }}
        >
          <Paper elevation={0} sx={surfaceSx}>
            <Stack spacing={1.8}>
              <Box>
                <Typography sx={{ fontWeight: 800, color: '#1b2740', fontSize: '1rem' }}>
                  Apercu analytique
                </Typography>
                <Typography sx={{ mt: 0.35, fontSize: '0.88rem', color: '#72809a' }}>
                  Resume des tendances consolidees avant export.
                </Typography>
              </Box>

              <Stack spacing={1.2}>
                {reportData.trends.map((trend) => (
                  <Paper
                    key={trend}
                    elevation={0}
                    sx={{
                      p: 1.35,
                      borderRadius: '12px',
                      border: '1px solid #e8edf5',
                      background: '#fbfcff',
                    }}
                  >
                    <Typography sx={{ fontSize: '0.9rem', color: '#445169', fontWeight: 700 }}>
                      {trend}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </Stack>
          </Paper>

          <Paper elevation={0} sx={surfaceSx}>
            <Stack spacing={1.8}>
              <Box>
                <Typography sx={{ fontWeight: 800, color: '#1b2740', fontSize: '1rem' }}>
                  Export et validation
                </Typography>
                <Typography sx={{ mt: 0.35, fontSize: '0.88rem', color: '#72809a' }}>
                  Apercu, finalisation, export PDF/Excel et preparation du rapport final.
                </Typography>
              </Box>

              {!reportReady && !generationFailed ? (
                <Alert severity="info" sx={{ borderRadius: '14px' }}>
                  Generez d abord le rapport pour activer les exports.
                </Alert>
              ) : null}

              {reportStatus === REPORT_STATUS.NEEDS_REVIEW ? (
                <Alert severity="warning" sx={{ borderRadius: '14px' }}>
                  Le rapport est en attente de correction. Corrigez les anomalies puis relancez la
                  generation ou finalisez une fois les controles termines.
                </Alert>
              ) : null}

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<TaskAltRoundedIcon />}
                  disabled={generationFailed || reportStatus === REPORT_STATUS.DRAFT}
                  onClick={handleFinalizeReport}
                  sx={{ borderRadius: '14px', textTransform: 'none', fontWeight: 800 }}
                >
                  Finaliser le rapport
                </Button>
                <Button
                  variant="contained"
                  startIcon={<PictureAsPdfRoundedIcon />}
                  disabled={!reportReady && reportStatus !== REPORT_STATUS.FINALIZED && reportStatus !== REPORT_STATUS.SENT}
                  onClick={() => handleExport('PDF')}
                  sx={{ borderRadius: '14px', textTransform: 'none', fontWeight: 800 }}
                >
                  Exporter PDF
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<FileDownloadRoundedIcon />}
                  disabled={!reportReady && reportStatus !== REPORT_STATUS.FINALIZED && reportStatus !== REPORT_STATUS.SENT}
                  onClick={() => handleExport('Excel')}
                  sx={{ borderRadius: '14px', textTransform: 'none', fontWeight: 700 }}
                >
                  Exporter Excel
                </Button>
              </Stack>

              <Button
                variant="contained"
                color="success"
                startIcon={<SendRoundedIcon />}
                disabled={reportStatus !== REPORT_STATUS.FINALIZED && reportStatus !== REPORT_STATUS.SENT}
                onClick={handleSendToDirection}
                sx={{ borderRadius: '14px', textTransform: 'none', fontWeight: 800 }}
              >
                Envoyer a la direction
              </Button>

              {reportSent ? (
                <Alert severity="success" sx={{ borderRadius: '14px' }}>
                  Le rapport finalise est pret pour validation par la direction.
                </Alert>
              ) : null}
            </Stack>
          </Paper>
        </Box>

        <Paper elevation={0} sx={surfaceSx}>
          <Stack spacing={1.6}>
            <Box>
              <Typography sx={{ fontWeight: 800, color: '#1b2740', fontSize: '1rem' }}>
                Tableau de controle du rapport
              </Typography>
              <Typography sx={{ mt: 0.35, fontSize: '0.88rem', color: '#72809a' }}>
                Controle des formations retenues, budget estime, priorite et anomalies a corriger.
              </Typography>
            </Box>

            <Box sx={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #e7edf5' }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8fafc' }}>
                    <TableCell>Formation</TableCell>
                    <TableCell>Structures</TableCell>
                    <TableCell>Demandes</TableCell>
                    <TableCell>Priorite</TableCell>
                    <TableCell>Budget</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Stack spacing={0.45}>
                          <Typography sx={{ fontWeight: 800, color: '#1b2740', fontSize: '0.9rem' }}>
                            {item.title}
                          </Typography>
                          {item.anomalies[0] ? (
                            <Typography sx={{ fontSize: '0.78rem', color: '#cc3558', maxWidth: 320 }}>
                              {item.anomalies[0].message}
                            </Typography>
                          ) : null}
                        </Stack>
                      </TableCell>
                      <TableCell>{item.structures.join(', ')}</TableCell>
                      <TableCell>{item.requestCount}</TableCell>
                      <TableCell>
                        <Chip label={item.priority} size="small" sx={chipSx(item.priority)} />
                      </TableCell>
                      <TableCell>{Math.round(item.budget / 1000)}k DZD</TableCell>
                      <TableCell>
                        <Chip label={item.status} size="small" sx={chipSx(item.status)} />
                      </TableCell>
                      <TableCell>
                        {item.anomalies[0] ? (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleResolveAnomaly(item.id, item.anomalies[0].trackingId)}
                            sx={{ textTransform: 'none', fontWeight: 700 }}
                          >
                            Corriger
                          </Button>
                        ) : (
                          <Typography sx={{ fontSize: '0.82rem', color: '#72809a', fontWeight: 700 }}>
                            Controle ok
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </MainLayout>
  )
}
