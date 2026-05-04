import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded'
import HourglassTopRoundedIcon from '@mui/icons-material/HourglassTopRounded'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded'
import RuleFolderRoundedIcon from '@mui/icons-material/RuleFolderRounded'
import TableViewRoundedIcon from '@mui/icons-material/TableViewRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { createElement, useMemo, useState } from 'react'
import MainLayout from '../../components/layout/mainLayout'
import InfoBlock from '../../components/ui/infoBlock'
import StatCard from '../../components/ui/statcard'
import {
  buildAnalyseRows,
  cleanText,
  getStoredAnalyseState,
} from '../Analyse/analyse.data'
import { employeesDirectory } from '../Fiches/data/data'
import { getStoredFormStates, getStoredTrackingRows } from '../Fiches/data/storage'

const pageSectionSx = {
  p: { xs: 2, md: 2.6 },
  borderRadius: '24px',
  border: '1px solid #E5EDF6',
  background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FBFF 100%)',
  boxShadow: '0 18px 34px rgba(15, 23, 42, 0.06)',
}

const heroSurfaceSx = {
  p: { xs: 2, md: 2.3 },
  borderRadius: '18px',
  border: '1px solid #E5EBF3',
  background: 'linear-gradient(180deg, rgba(255,255,255,0.99) 0%, rgba(248,250,255,0.98) 100%)',
  boxShadow: '0 10px 24px rgba(20, 31, 56, 0.08)',
}

const rowCardSx = {
  p: 1.7,
  borderRadius: '20px',
  border: '1px solid #E7EEF6',
  background: '#FFFFFF',
  boxShadow: '0 12px 24px rgba(15, 23, 42, 0.05)',
}

const sectionTitleSx = {
  fontWeight: 900,
  color: '#172033',
  fontSize: '1.05rem',
}

const sectionSubtitleSx = {
  mt: 0.35,
  color: '#72809A',
  fontSize: '0.9rem',
}

function normalizeDecision(decision) {
  const normalized = cleanText(decision).toLowerCase()

  if (normalized.includes('accept')) return 'Validee'
  if (normalized.includes('refus')) return 'Refusee'
  if (normalized.includes('report')) return 'Reportee'
  if (normalized.includes('non justifi')) return 'Non justifiee'

  return ''
}

function buildReportRows() {
  const trackingRows = getStoredTrackingRows()
  const formStates = getStoredFormStates()
  const analyseState = getStoredAnalyseState()

  return buildAnalyseRows(trackingRows, formStates, employeesDirectory, analyseState)
    .map((row) => ({
      formation: cleanText(row.formation),
      categorie: cleanText(row.categorie),
      structures: row.structures.map((structure) => cleanText(structure.structure)),
      employes: row.employees.map((employee) => cleanText(employee.fullName)),
      priorite: cleanText(row.priorite),
      score: row.score,
      decision: normalizeDecision(row.decision),
      commentaireDdrh: cleanText(row.comment),
    }))
    .filter((row) => row.decision)
}

function getPriorityColor(priority) {
  if (priority === 'Haute') return '#DC2626'
  if (priority === 'Moyenne') return '#D97706'
  return '#15803D'
}

function getDecisionColor(decision) {
  if (decision === 'Validee') return '#15803D'
  if (decision === 'Reportee') return '#D97706'
  if (decision === 'Refusee') return '#B91C1C'
  if (decision === 'Non justifiee') return '#7C3AED'
  return '#64748B'
}

function buildExecutiveSummary(rows) {
  if (rows.length === 0) {
    return "La campagne 2026 ne contient pas encore de decisions consolidees. La DDRH doit finaliser l'analyse pour produire la synthese definitive des besoins."
  }

  const validRows = rows.filter((row) => row.decision === 'Validee')
  const groupedCategories = validRows.reduce((accumulator, row) => {
    accumulator[row.categorie] = (accumulator[row.categorie] || 0) + 1
    return accumulator
  }, {})

  const topCategory =
    Object.entries(groupedCategories).sort((left, right) => right[1] - left[1])[0]?.[0] ||
    'Technique'

  const highPriorityThemes = validRows
    .filter((row) => row.priorite === 'Haute' || row.priorite === 'Moyenne')
    .map((row) => row.formation)
    .slice(0, 3)
    .join(', ')

  return `La campagne 2026 a permis de consolider les besoins exprimes par les structures. Les formations ${topCategory.toLowerCase()}s representent la majorite des besoins valides. Les formations a forte priorite concernent principalement ${highPriorityThemes || 'les competences critiques metier'}.`
}

function headerActionSx(tone) {
  if (tone === 'solid') {
    return {
      minHeight: 44,
      textTransform: 'none',
      fontWeight: 700,
      fontSize: '0.85rem',
      px: 1.9,
      borderRadius: '14px',
      background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
      boxShadow: '0 12px 24px rgba(30,155,109,0.20)',
      '& .MuiButton-startIcon > *:first-of-type': {
        fontSize: 18,
      },
      '& .MuiButton-startIcon': {
        mr: 0.6,
      },
      '&:hover': {
        background: 'linear-gradient(135deg, #15803D 0%, #166534 100%)',
        boxShadow: '0 16px 28px rgba(30,155,109,0.24)',
      },
    }
  }

  return {
    minHeight: 44,
    textTransform: 'none',
    fontWeight: 700,
    fontSize: '0.85rem',
    px: 1.8,
    borderRadius: '14px',
    color: '#475569',
    borderColor: '#D8E2EE',
    backgroundColor: '#fff',
    boxShadow: '0 8px 18px rgba(20, 31, 56, 0.05)',
    '& .MuiButton-startIcon > *:first-of-type': {
      fontSize: 18,
    },
    '& .MuiButton-startIcon': {
      mr: 0.6,
    },
    '&:hover': {
      borderColor: '#BECFDE',
      backgroundColor: '#ffffff',
      boxShadow: '0 12px 24px rgba(20, 31, 56, 0.08)',
    },
  }
}

function RapportHeader({ onExportPdf, onExportExcel }) {
  return (
    <Paper elevation={0} sx={heroSurfaceSx}>
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', lg: 'center' }}
        spacing={1.6}
      >
        <Box sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.9, flexWrap: 'wrap' }}>
            <Chip
              label="Campagne 2026"
              sx={{
                bgcolor: '#E9F7EF',
                color: '#167A49',
                fontWeight: 900,
                borderRadius: '999px',
              }}
            />
          </Stack>

          <Typography
            sx={{
              fontSize: { xs: '1.45rem', md: '1.75rem' },
              fontWeight: 900,
              color: '#172033',
              letterSpacing: '-0.02em',
            }}
          >
            Rapport de synthese
          </Typography>

          <Typography
            sx={{
              mt: 0.45,
              color: '#72809A',
              fontSize: '0.92rem',
              maxWidth: 700,
              lineHeight: 1.65,
            }}
          >
            Synthese finale des besoins en formation valides pour la campagne 2026.
            Cette vue consolide les arbitrages DDRH avant transmission a la direction.
          </Typography>
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ width: { xs: '100%', lg: 'auto' } }}>
          <Button
            variant="outlined"
            startIcon={<PictureAsPdfRoundedIcon />}
            onClick={onExportPdf}
            sx={headerActionSx('outline')}
          >
            Exporter PDF
          </Button>
          <Button
            variant="contained"
            startIcon={<TableViewRoundedIcon />}
            onClick={onExportExcel}
            sx={headerActionSx('solid')}
          >
            Exporter Excel
          </Button>
        </Stack>
      </Stack>
    </Paper>
  )
}

function StatsSection({ stats }) {
  return (
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
      {stats.map(({ title, value, subtitle, background, borderColor, Icon }) => (
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
  )
}

function ExecutiveSummarySection({ summary }) {
  return (
    <Paper elevation={0} sx={pageSectionSx}>
      <Stack spacing={1.4}>
        <Stack direction="row" spacing={1} alignItems="center">
          <TrendingUpRoundedIcon sx={{ color: '#2563EB' }} />
          <Typography sx={sectionTitleSx}>Resume executif</Typography>
        </Stack>

        <Typography sx={{ color: '#516078', lineHeight: 1.75, fontSize: '0.96rem' }}>
          {summary}
        </Typography>
      </Stack>
    </Paper>
  )
}

function ValidatedFormationsSection({ rows }) {
  return (
    <Paper elevation={0} sx={pageSectionSx}>
      <Stack spacing={2}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={1}
        >
          <Box>
            <Typography sx={sectionTitleSx}>Formations validees</Typography>
            <Typography sx={sectionSubtitleSx}>
              Consultation des besoins retenus pour integration au plan de formation.
            </Typography>
          </Box>
          <Chip
            label={`${rows.length} formation(s) retenue(s)`}
            sx={{
              bgcolor: '#ECFDF3',
              color: '#168553',
              fontWeight: 800,
              borderRadius: '999px',
            }}
          />
        </Stack>

        {rows.length === 0 ? (
          <Alert severity="info" sx={{ borderRadius: '16px' }}>
            Aucune formation validee n est encore disponible dans l analyse consolidee.
          </Alert>
        ) : (
          <Stack spacing={1.2}>
            {rows.map((row) => (
              <Paper key={row.formation} elevation={0} sx={rowCardSx}>
                <Stack spacing={1.25}>
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    justifyContent="space-between"
                    spacing={1}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 900, color: '#172033', fontSize: '1rem' }}>
                        {row.formation}
                      </Typography>
                      <Typography sx={{ mt: 0.3, color: '#72809A', fontSize: '0.88rem' }}>
                        Categorie : {row.categorie}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                      <Chip
                        size="small"
                        label={row.priorite}
                        sx={{
                          bgcolor: `${getPriorityColor(row.priorite)}16`,
                          color: getPriorityColor(row.priorite),
                          fontWeight: 800,
                        }}
                      />
                      <Chip
                        size="small"
                        label={`Score ${row.score}`}
                        sx={{
                          bgcolor: '#EEF4FF',
                          color: '#2563EB',
                          fontWeight: 800,
                        }}
                      />
                    </Stack>
                  </Stack>

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', lg: '1.15fr 1fr 0.7fr 0.7fr' },
                      gap: 1.2,
                    }}
                  >
                    <InfoBlock label="Structures" value={row.structures.join(', ')} variant="paper" />
                    <InfoBlock label="Employes" value={row.employes.join(', ')} variant="paper" />
                    <InfoBlock label="Priorite" value={row.priorite} variant="paper" />
                    <InfoBlock label="Score" value={String(row.score)} variant="paper" />
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  )
}

function DecisionRowsSection({ rows }) {
  return (
    <Paper elevation={0} sx={pageSectionSx}>
      <Stack spacing={2}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={1}
        >
          <Box>
            <Typography sx={sectionTitleSx}>Formations reportees ou rejetees</Typography>
            <Typography sx={sectionSubtitleSx}>
              Historique des besoins non retenus dans le rapport final courant.
            </Typography>
          </Box>
          <Chip
            label={`${rows.length} decision(s) hors plan`}
            sx={{
              bgcolor: '#FFF7E8',
              color: '#B96D12',
              fontWeight: 800,
              borderRadius: '999px',
            }}
          />
        </Stack>

        {rows.length === 0 ? (
          <Alert severity="info" sx={{ borderRadius: '16px' }}>
            Aucune formation reportee, refusee ou non justifiee n est disponible pour cette campagne.
          </Alert>
        ) : (
          <Stack spacing={1.2}>
            {rows.map((row) => (
              <Paper key={`${row.formation}-${row.decision}`} elevation={0} sx={rowCardSx}>
                <Stack spacing={1}>
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    justifyContent="space-between"
                    spacing={1}
                  >
                    <Typography sx={{ fontWeight: 900, color: '#172033' }}>
                      {row.formation}
                    </Typography>

                    <Chip
                      size="small"
                      label={row.decision}
                      sx={{
                        bgcolor: `${getDecisionColor(row.decision)}16`,
                        color: getDecisionColor(row.decision),
                        fontWeight: 800,
                      }}
                    />
                  </Stack>

                  <Typography sx={{ color: '#516078', fontSize: '0.9rem' }}>
                    <Box component="span" sx={{ fontWeight: 800, color: '#172033' }}>
                      Commentaire DDRH :
                    </Box>{' '}
                    {row.commentaireDdrh || 'Aucun commentaire fourni.'}
                  </Typography>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  )
}

function CategoryDistributionSection({ rows }) {
  const categoryItems = useMemo(() => {
    const base = {
      Technique: 0,
      Obligatoire: 0,
      Transversale: 0,
      Outils: 0,
    }

    rows.forEach((row) => {
      if (base[row.categorie] !== undefined) {
        base[row.categorie] += 1
      }
    })

    const maxValue = Math.max(...Object.values(base), 1)

    return Object.entries(base).map(([label, value]) => ({
      label,
      value,
      percentage: Math.round((value / maxValue) * 100),
      color:
        label === 'Technique'
          ? '#2563EB'
          : label === 'Obligatoire'
            ? '#DC2626'
            : label === 'Transversale'
              ? '#16A34A'
              : '#D97706',
    }))
  }, [rows])

  return (
    <Paper elevation={0} sx={pageSectionSx}>
      <Stack spacing={2}>
        <Box>
          <Typography sx={sectionTitleSx}>Repartition par categorie</Typography>
          <Typography sx={sectionSubtitleSx}>
            Repartition des besoins consolides par nature de formation.
          </Typography>
        </Box>

        <Stack spacing={1.5}>
          {categoryItems.map((item) => (
            <Box key={item.label}>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.55 }}>
                <Typography sx={{ fontWeight: 800, color: '#172033' }}>{item.label}</Typography>
                <Typography sx={{ color: '#64748B', fontWeight: 700 }}>
                  {item.value} formation(s)
                </Typography>
              </Stack>

              <Box
                sx={{
                  height: 12,
                  borderRadius: '999px',
                  bgcolor: '#EAF0F7',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: `${item.percentage}%`,
                    height: '100%',
                    borderRadius: '999px',
                    bgcolor: item.color,
                  }}
                />
              </Box>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Paper>
  )
}

function ReportInfoSection({ status }) {
  const generatedAt = new Date().toLocaleDateString('fr-FR')

  return (
    <Paper elevation={0} sx={pageSectionSx}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <InfoOutlinedIcon sx={{ color: '#2563EB' }} />
          <Typography sx={sectionTitleSx}>Informations du rapport</Typography>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: 1.2,
          }}
        >
          <InfoBlock label="Campagne" value="2026" variant="paper" />
          <InfoBlock label="Prepare par" value="DDRH" variant="paper" />
          <InfoBlock label="Date de generation" value={generatedAt} variant="paper" />
          <InfoBlock label="Statut" value={status} variant="paper" />
          <InfoBlock label="Destination" value="Direction" variant="paper" />
        </Box>
      </Stack>
    </Paper>
  )
}

export default function Rapport() {
  const [feedback, setFeedback] = useState('')

  const reportRows = useMemo(() => buildReportRows(), [])

  const validRows = useMemo(
    () => reportRows.filter((row) => row.decision === 'Validee'),
    [reportRows]
  )

  const rejectedRows = useMemo(
    () =>
      reportRows.filter((row) =>
        ['Reportee', 'Refusee', 'Non justifiee'].includes(row.decision)
      ),
    [reportRows]
  )

  const stats = useMemo(() => {
    const employeesCount = new Set(reportRows.flatMap((row) => row.employes)).size

    return [
      {
        title: 'Formations validees',
        value: String(validRows.length),
        subtitle: 'Besoins retenus pour le plan de formation',
        background: 'linear-gradient(135deg, #16A34A, #4ADE80)',
        Icon: CheckCircleRoundedIcon,
        borderColor: 'rgba(255,255,255,0.18)',
      },
      {
        title: 'Formations reportees',
        value: String(reportRows.filter((row) => row.decision === 'Reportee').length),
        subtitle: 'Besoins a reprogrammer sur une autre campagne',
        background: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
        Icon: HourglassTopRoundedIcon,
        borderColor: 'rgba(255,255,255,0.18)',
      },
      {
        title: 'Demandes non justifiees',
        value: String(reportRows.filter((row) => row.decision === 'Non justifiee').length),
        subtitle: 'Demandes ecartees apres analyse DDRH',
        background: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
        Icon: RuleFolderRoundedIcon,
        borderColor: 'rgba(255,255,255,0.18)',
      },
      {
        title: 'Employes concernes',
        value: String(employeesCount),
        subtitle: 'Salaries couverts par les besoins consolides',
        background: 'linear-gradient(135deg, #2563EB, #60A5FA)',
        Icon: Groups2RoundedIcon,
        borderColor: 'rgba(255,255,255,0.18)',
      },
    ]
  }, [reportRows, validRows.length])

  const summary = useMemo(() => buildExecutiveSummary(reportRows), [reportRows])

  const reportStatus = useMemo(() => {
    return reportRows.length > 0 ? 'Rapport provisoire' : 'En attente de consolidation'
  }, [reportRows.length])

  const handleExportPdf = () => {
    console.log('Export PDF simule')
    setFeedback('Export PDF simule avec succes.')
  }

  const handleExportExcel = () => {
    console.log('Export Excel simule')
    setFeedback('Export Excel simule avec succes.')
  }

  return (
    <MainLayout>
      <Box sx={{ display: 'grid', gap: 3 }}>
        <RapportHeader onExportPdf={handleExportPdf} onExportExcel={handleExportExcel} />

        {feedback ? (
          <Alert severity="success" sx={{ borderRadius: '16px' }}>
            {feedback}
          </Alert>
        ) : null}

        <StatsSection stats={stats} />

        <ExecutiveSummarySection summary={summary} />

        <ValidatedFormationsSection rows={validRows} />

        <DecisionRowsSection rows={rejectedRows} />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', xl: '1.05fr 0.95fr' },
            gap: 2,
            minWidth: 0,
          }}
        >
          <CategoryDistributionSection rows={reportRows} />
          <ReportInfoSection status={reportStatus} />
        </Box>
      </Box>
    </MainLayout>
  )
}
