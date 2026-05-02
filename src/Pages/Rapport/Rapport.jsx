import AutoGraphRoundedIcon from '@mui/icons-material/AutoGraphRounded'
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded'
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded'
import PublishRoundedIcon from '@mui/icons-material/PublishRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded'
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
import { createElement, useMemo, useState } from 'react'
import MainLayout from '../../components/layout/mainLayout'
import StatCard from '../../components/ui/statcard'
import { employeesDirectory } from '../Fiches/data/data'
import { getStoredFormStates, getStoredTrackingRows } from '../Fiches/data/storage'
import {
  buildAnalyseRows,
  cleanText,
  getPriorityColor,
  getStoredAnalyseState,
} from '../Analyse/analyse.data'

const REPORT_STATUS_STORAGE_KEY = 'rapportStatus'

const statusConfig = {
  Brouillon: { color: '#64748B', bg: '#F1F5F9' },
  Genere: { color: '#2563EB', bg: '#EFF6FF' },
  'A corriger': { color: '#B45309', bg: '#FFF7ED' },
  Finalise: { color: '#15803D', bg: '#F0FDF4' },
  Envoye: { color: '#166534', bg: '#DCFCE7' },
  'Generation indisponible': { color: '#B91C1C', bg: '#FEF2F2' },
}

const sectionPaperSx = {
  p: 2.5,
  borderRadius: '22px',
  border: '1px solid #E5EBF3',
  background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFF 100%)',
  boxShadow: '0 16px 36px rgba(20,31,56,0.08)',
}

const chartBarColors = ['#16A34A', '#2563EB', '#F59E0B', '#7C3AED', '#DC2626']

export default function Rapport() {
  const [reportStatus, setReportStatus] = useState(
    () => localStorage.getItem(REPORT_STATUS_STORAGE_KEY) || 'Brouillon'
  )
  const [generationError, setGenerationError] = useState(false)
  const [lastActionMessage, setLastActionMessage] = useState('')

  const trackingRows = useMemo(() => getStoredTrackingRows(), [])
  const formStates = useMemo(() => getStoredFormStates(), [])
  const analyseState = useMemo(() => getStoredAnalyseState(), [])

  const analyseRows = useMemo(
    () => buildAnalyseRows(trackingRows, formStates, employeesDirectory, analyseState),
    [trackingRows, formStates, analyseState]
  )

  const reportRows = useMemo(() => {
    return analyseRows
      .filter((row) => row.decision === 'AcceptÃ©e')
      .map((row) => ({
        key: row.key,
        formation: cleanText(row.formation),
        categorie: cleanText(row.categorie),
        structuresCount: row.structuresCount,
        employeesCount: row.employeesCount,
        priority: row.priorite,
        estimatedBudget: estimateBudget(row),
        status: row.decision === 'AcceptÃ©e' ? 'Pret' : 'A revoir',
      }))
      .sort((left, right) => right.estimatedBudget - left.estimatedBudget)
  }, [analyseRows])

  const totalBudget = reportRows.reduce((sum, row) => sum + row.estimatedBudget, 0)
  const acceptedRequests = reportRows.length
  const highPriorityCount = reportRows.filter((row) => row.priority === 'Haute').length

  const topFormations = useMemo(() => {
    return [...reportRows]
      .sort((left, right) => right.employeesCount - left.employeesCount)
      .slice(0, 5)
  }, [reportRows])

  const priorityBreakdown = useMemo(() => {
    return [
      {
        label: 'Haute',
        value: reportRows.filter((row) => row.priority === 'Haute').length,
      },
      {
        label: 'Moyenne',
        value: reportRows.filter((row) => row.priority === 'Moyenne').length,
      },
      {
        label: 'Basse',
        value: reportRows.filter((row) => row.priority === 'Basse').length,
      },
    ]
  }, [reportRows])

  const trendsSummary = useMemo(() => {
    if (reportRows.length === 0) {
      return 'Aucune tendance ne peut encore etre degagee tant que le rapport n integre pas de formations acceptees.'
    }

    const topFormation = topFormations[0]
    const dominantPriority =
      [...priorityBreakdown].sort((left, right) => right.value - left.value)[0]?.label || 'Basse'

    return `La formation la plus demandee est "${topFormation?.formation || 'N/A'}" avec ${topFormation?.employeesCount || 0} employe(s) concernes. La priorite dominante du rapport est "${dominantPriority}" et ${highPriorityCount} demande(s) restent a traiter en niveau haut.`
  }, [highPriorityCount, priorityBreakdown, reportRows.length, topFormations])

  const statusMeta = statusConfig[reportStatus] || statusConfig.Brouillon

  const stats = [
    {
      title: 'Fiches retenues',
      value: acceptedRequests,
      subtitle: 'Formations retenues apres arbitrage DDRH',
      background: 'linear-gradient(135deg, #16A34A, #4ADE80)',
      Icon: TaskAltRoundedIcon,
      borderColor: 'rgba(255,255,255,0.18)',
    },
    {
      title: 'Budget estime',
      value: formatCurrency(totalBudget),
      subtitle: 'Montant consolide du rapport courant',
      background: 'linear-gradient(135deg, #2563EB, #60A5FA)',
      Icon: AutoGraphRoundedIcon,
      borderColor: 'rgba(255,255,255,0.18)',
    },
    {
      title: 'Priorites hautes',
      value: highPriorityCount,
      subtitle: 'Demandes a traiter en premier',
      background: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
      Icon: InsightsRoundedIcon,
      borderColor: 'rgba(255,255,255,0.18)',
    },
    {
      title: 'Anomalies detectees',
      value: generationError ? 1 : 0,
      subtitle: 'Incidents de generation signales',
      background: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
      Icon: ErrorOutlineRoundedIcon,
      borderColor: 'rgba(255,255,255,0.18)',
    },
  ]

  const setPersistentStatus = (nextStatus) => {
    localStorage.setItem(REPORT_STATUS_STORAGE_KEY, nextStatus)
    setReportStatus(nextStatus)
  }

  const handleGenerateReport = () => {
    setGenerationError(false)
    setPersistentStatus('Genere')
    setLastActionMessage('Le rapport de synthese est genere et pret pour revue DDRH.')
  }

  const handleFinalizeReport = () => {
    if (generationError || reportRows.length === 0) {
      setPersistentStatus('A corriger')
      setLastActionMessage('La finalisation est bloquee tant que le rapport reste incomplet.')
      return
    }

    setPersistentStatus('Finalise')
    setLastActionMessage('Le rapport est finalise et pret pour envoi a la direction.')
  }

  const handleSendToDirection = () => {
    if (reportStatus !== 'Finalise') {
      setLastActionMessage('Finalisez le rapport avant de l envoyer a la direction.')
      return
    }

    setPersistentStatus('Envoye')
    setLastActionMessage('Le rapport finalise est marque comme envoye a la direction.')
  }

  const handleSimulateFailure = () => {
    setGenerationError(true)
    setPersistentStatus('Generation indisponible')
    setLastActionMessage('La generation automatique est indisponible. Passez en export hors ligne.')
  }

  const handleExportExcel = () => {
    downloadFile(buildCsv(reportRows), 'rapport-synthese.csv', 'text/csv;charset=utf-8;')
    setLastActionMessage('Le rapport a ete exporte en format tableur.')
  }

  const handleExportPdf = () => {
    const pdfLikeContent = buildPdfLikeContent(reportRows, totalBudget)
    downloadFile(pdfLikeContent, 'rapport-synthese.pdf', 'application/pdf')
    setLastActionMessage('Une version PDF de demonstration a ete exportee.')
  }

  const handleDownloadOfflineData = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      reportRows,
      trackingRows,
    }
    downloadFile(
      JSON.stringify(payload, null, 2),
      'rapport-donnees-brutes.json',
      'application/json;charset=utf-8;'
    )
    setLastActionMessage('Les donnees brutes ont ete telechargees pour analyse hors ligne.')
  }

  return (
    <MainLayout>
      <Box sx={{ display: 'grid', gap: 3 }}>
        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', lg: 'center' }}
          spacing={1.5}
        >
          <Box>
            <Typography sx={{ fontSize: '1.7rem', fontWeight: 900, color: '#172033' }}>
              Rapport de synthese
            </Typography>
            <Typography sx={{ mt: 0.5, color: '#72809A', fontSize: '0.95rem', maxWidth: 920 }}>
              La DDRH consolide ici les fiches analysees, applique les priorites validees,
              controle les anomalies puis prepare un rapport exportable pour la direction.
            </Typography>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ width: { xs: '100%', lg: 'auto' } }}>
            <Button
              variant="outlined"
              startIcon={<RefreshRoundedIcon />}
              onClick={handleGenerateReport}
              sx={actionButtonSx('neutral')}
            >
              Generer le rapport
            </Button>
            <Button
              variant="contained"
              startIcon={<PublishRoundedIcon />}
              onClick={handleSendToDirection}
              sx={actionButtonSx('primary')}
            >
              Envoyer a la direction
            </Button>
          </Stack>
        </Stack>

        <Paper elevation={0} sx={{ ...sectionPaperSx, p: 2 }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            justifyContent="space-between"
            spacing={1.5}
          >
            <Box>
              <Typography sx={{ fontWeight: 900, color: '#172033' }}>
                Statut du rapport
              </Typography>
              <Typography sx={{ mt: 0.35, color: '#72809A', fontSize: '0.9rem' }}>
                Le statut suit le cycle de vie du rapport depuis la generation jusqu a l envoi.
              </Typography>
            </Box>
            <Chip
              label={reportStatus}
              sx={{
                bgcolor: statusMeta.bg,
                color: statusMeta.color,
                fontWeight: 900,
                borderRadius: '12px',
              }}
            />
          </Stack>
        </Paper>

        {lastActionMessage ? (
          <Alert severity={reportStatus === 'Generation indisponible' ? 'error' : 'info'} sx={{ borderRadius: '16px' }}>
            {lastActionMessage}
          </Alert>
        ) : null}

        {generationError ? (
          <Alert severity="error" sx={{ borderRadius: '16px' }}>
            La generation automatique du rapport a echoue. La DDRH peut telecharger les fiches et
            poursuivre l analyse hors ligne.
          </Alert>
        ) : null}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 2,
          }}
        >
          {stats.map(({ title, value, subtitle, background, Icon, borderColor }) => (
            <StatCard
              key={title}
              title={title}
              value={value}
              subtitle={subtitle}
              icon={createElement(Icon)}
              background={background}
              borderColor={borderColor}
            />
          ))}
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', xl: '1.2fr 0.8fr' },
            gap: 2,
            minWidth: 0,
          }}
        >
          <Paper elevation={0} sx={sectionPaperSx}>
            <Typography sx={{ fontWeight: 900, color: '#172033', fontSize: '1.05rem' }}>
              Formations demandees
            </Typography>
            <Typography sx={{ mt: 0.35, color: '#72809A', fontSize: '0.9rem' }}>
              Classement des formations retenues les plus demandees dans le rapport de synthese.
            </Typography>

            <Box sx={{ mt: 2.2, display: 'grid', gap: 1.4 }}>
              {topFormations.length === 0 ? (
                <Typography sx={{ color: '#94A3B8' }}>
                  Aucune formation acceptee n est disponible pour le rapport.
                </Typography>
              ) : (
                topFormations.map((row, index) => (
                  <Box key={row.key} sx={{ display: 'grid', gap: 0.65 }}>
                    <Stack direction="row" justifyContent="space-between" spacing={1}>
                      <Typography sx={{ fontWeight: 800, color: '#172033' }}>
                        {row.formation}
                      </Typography>
                      <Typography sx={{ color: '#64748B', fontWeight: 700 }}>
                        {row.employeesCount} employes
                      </Typography>
                    </Stack>
                    <Box
                      sx={{
                        height: 10,
                        borderRadius: '999px',
                        bgcolor: '#EAF0F7',
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          width: `${Math.max(
                            12,
                            (row.employeesCount /
                              Math.max(1, topFormations[0]?.employeesCount || 1)) *
                              100
                          )}%`,
                          height: '100%',
                          borderRadius: '999px',
                          bgcolor: chartBarColors[index % chartBarColors.length],
                        }}
                      />
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          </Paper>

          <Paper elevation={0} sx={sectionPaperSx}>
            <Typography sx={{ fontWeight: 900, color: '#172033', fontSize: '1.05rem' }}>
              Resume des tendances
            </Typography>
            <Typography sx={{ mt: 0.35, color: '#72809A', fontSize: '0.9rem' }}>
              Lecture rapide des priorites dominantes et de la dynamique globale du rapport.
            </Typography>

            <Alert severity="info" sx={{ mt: 2, borderRadius: '14px' }}>
              {trendsSummary}
            </Alert>

            <Stack spacing={1.3} sx={{ mt: 2.2 }}>
              {priorityBreakdown.map((item) => {
                const color = getPriorityColor(item.label)
                const percentage =
                  reportRows.length === 0 ? 0 : Math.round((item.value / reportRows.length) * 100)

                return (
                  <Box key={item.label}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.55 }}>
                      <Typography sx={{ fontWeight: 800, color: '#172033' }}>{item.label}</Typography>
                      <Typography sx={{ color: '#64748B', fontWeight: 700 }}>
                        {item.value} demande(s)
                      </Typography>
                    </Stack>
                    <Box
                      sx={{
                        height: 11,
                        borderRadius: '999px',
                        bgcolor: '#EAF0F7',
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          width: `${percentage}%`,
                          height: '100%',
                          borderRadius: '999px',
                          bgcolor: color,
                        }}
                      />
                    </Box>
                  </Box>
                )
              })}
            </Stack>
          </Paper>
        </Box>

        <Paper elevation={0} sx={sectionPaperSx}>
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', lg: 'center' }}
            spacing={1.2}
          >
            <Box>
              <Typography sx={{ fontWeight: 900, color: '#172033', fontSize: '1.05rem' }}>
                Apercu du rapport
              </Typography>
              <Typography sx={{ mt: 0.35, color: '#72809A', fontSize: '0.9rem' }}>
                Formations retenues, structures touchees, budget estime et statut de consolidation.
              </Typography>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <Button
                variant="outlined"
                startIcon={<DownloadRoundedIcon />}
                onClick={handleExportPdf}
                sx={actionButtonSx('neutral')}
              >
                Exporter PDF
              </Button>
              <Button
                variant="outlined"
                startIcon={<FileDownloadRoundedIcon />}
                onClick={handleExportExcel}
                sx={actionButtonSx('neutral')}
              >
                Exporter Excel
              </Button>
              <Button
                variant="contained"
                startIcon={<TaskAltRoundedIcon />}
                onClick={handleFinalizeReport}
                sx={actionButtonSx('primary')}
              >
                Finaliser
              </Button>
            </Stack>
          </Stack>

          <Box sx={{ mt: 2, overflowX: 'auto' }}>
            <Table
              size="small"
              sx={{
                minWidth: 780,
                '& th': {
                  fontWeight: 900,
                  color: '#64748B',
                  textTransform: 'uppercase',
                  fontSize: '0.74rem',
                  borderBottom: '1px solid #E7EDF5',
                },
                '& td': {
                  borderBottom: '1px solid #EEF2F7',
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Formation</TableCell>
                  <TableCell>Categorie</TableCell>
                  <TableCell>Structures</TableCell>
                  <TableCell>Employes</TableCell>
                  <TableCell>Priorite</TableCell>
                  <TableCell>Budget estime</TableCell>
                  <TableCell>Statut</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ py: 3.5, textAlign: 'center', color: '#94A3B8' }}>
                      Aucune ligne acceptee n alimente encore le rapport.
                    </TableCell>
                  </TableRow>
                ) : (
                  reportRows.map((row) => (
                    <TableRow key={row.key} hover>
                      <TableCell sx={{ fontWeight: 800, color: '#172033' }}>{row.formation}</TableCell>
                      <TableCell>{row.categorie}</TableCell>
                      <TableCell>{row.structuresCount}</TableCell>
                      <TableCell>{row.employeesCount}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={row.priority}
                          sx={{
                            bgcolor: `${getPriorityColor(row.priority)}18`,
                            color: getPriorityColor(row.priority),
                            fontWeight: 800,
                            borderRadius: '10px',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>{formatCurrency(row.estimatedBudget)}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={row.status}
                          sx={{
                            bgcolor: '#EEF6FF',
                            color: '#2563EB',
                            fontWeight: 800,
                            borderRadius: '10px',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Box>
        </Paper>

        <Paper elevation={0} sx={sectionPaperSx}>
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            justifyContent="space-between"
            spacing={1.5}
          >
            <Box>
              <Typography sx={{ fontWeight: 900, color: '#172033', fontSize: '1.05rem' }}>
                Plan de secours
              </Typography>
              <Typography sx={{ mt: 0.35, color: '#72809A', fontSize: '0.9rem', maxWidth: 780 }}>
                En cas de panne de generation, la DDRH peut exporter les fiches et les donnees
                brutes pour reprendre l analyse hors ligne sans bloquer la campagne.
              </Typography>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <Button
                variant="outlined"
                startIcon={<ErrorOutlineRoundedIcon />}
                onClick={handleSimulateFailure}
                sx={actionButtonSx('error')}
              >
                Simuler une panne
              </Button>
              <Button
                variant="outlined"
                startIcon={<FileDownloadRoundedIcon />}
                onClick={handleDownloadOfflineData}
                sx={actionButtonSx('neutral')}
              >
                Telecharger les donnees brutes
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </MainLayout>
  )
}

function estimateBudget(row) {
  const baseByPriority = row.priorite === 'Haute' ? 180000 : row.priorite === 'Moyenne' ? 120000 : 80000
  const participantWeight = row.employeesCount * 15000
  const structureWeight = row.structuresCount * 10000
  return baseByPriority + participantWeight + structureWeight
}

function formatCurrency(value) {
  return new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency: 'DZD',
    maximumFractionDigits: 0,
  }).format(value || 0)
}

function buildCsv(rows) {
  const header = [
    'Formation',
    'Categorie',
    'Structures',
    'Employes',
    'Priorite',
    'Budget estime',
    'Statut',
  ]

  const lines = rows.map((row) => [
    row.formation,
    row.categorie,
    row.structuresCount,
    row.employeesCount,
    row.priority,
    row.estimatedBudget,
    row.status,
  ])

  return [header, ...lines]
    .map((line) => line.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
    .join('\n')
}

function buildPdfLikeContent(rows, totalBudget) {
  const lines = [
    'RAPPORT DE SYNTHESE DDRH',
    '',
    `Nombre de formations retenues : ${rows.length}`,
    `Budget estime total : ${formatCurrency(totalBudget)}`,
    '',
    'FORMATIONS',
    ...rows.map(
      (row, index) =>
        `${index + 1}. ${row.formation} | Priorite ${row.priority} | ${row.employeesCount} employes | ${formatCurrency(row.estimatedBudget)}`
    ),
  ]

  return lines.join('\n')
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function actionButtonSx(tone) {
  if (tone === 'primary') {
    return {
      minHeight: 40,
      textTransform: 'none',
      fontWeight: 800,
      borderRadius: '12px',
      boxShadow: 'none',
      background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
      '&:hover': {
        boxShadow: 'none',
        background: 'linear-gradient(135deg, #15803D 0%, #166534 100%)',
      },
    }
  }

  if (tone === 'warning') {
    return {
      minHeight: 38,
      textTransform: 'none',
      fontWeight: 800,
      borderRadius: '10px',
      color: '#B45309',
      borderColor: '#F5D0A4',
      '&:hover': {
        borderColor: '#F0B86B',
        bgcolor: '#FFF7ED',
      },
    }
  }

  if (tone === 'error') {
    return {
      minHeight: 38,
      textTransform: 'none',
      fontWeight: 800,
      borderRadius: '10px',
      color: '#B91C1C',
      borderColor: '#F4C7C7',
      '&:hover': {
        borderColor: '#E8A0A0',
        bgcolor: '#FEF2F2',
      },
    }
  }

  return {
    minHeight: 38,
    textTransform: 'none',
    fontWeight: 800,
    borderRadius: '10px',
    color: '#475569',
    borderColor: '#D8E2EE',
    '&:hover': {
      borderColor: '#BECFDE',
      bgcolor: '#F8FBFF',
    },
  }
}
