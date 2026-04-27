import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import ModeEditOutlineRoundedIcon from '@mui/icons-material/ModeEditOutlineRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import MainLayout from '../../components/layout/mainLayout'
import { CONNECTED_USER_EMAIL_KEY, CONNECTED_USER_ROLE_KEY } from '../Users/users.data'
import { structureRecipients } from './data/data'
import { getStoredFormStates, getStoredTrackingRows } from './data/storage'
import { sectionPaperSx } from './data/style'

function parseSentAt(value) {
  const [day, month, year] = String(value || '').split('/')
  if (!day || !month || !year) return new Date(0)
  return new Date(Number(year), Number(month) - 1, Number(day))
}

function getCampaignLabel(row) {
  const year = String(row?.sentAt || '').split('/')[2] || '2026'
  return `Campagne ${year}`
}

function getDisplayStatus(row) {
  if (row.locked) return 'Verrouillée'
  if (row.reopened) return 'Réouverte'
  if (row.formStatus === 'Brouillon') return 'Brouillon'
  if (row.formStatus === 'Soumise') return 'Soumise'
  return 'Disponible'
}

function getActionConfig(row) {
  if (row.locked) {
    return {
      label: 'Voir',
      icon: <LockRoundedIcon />,
      variant: 'outlined',
    }
  }

  if (row.formStatus === 'Soumise' && !row.reopened) {
    return {
      label: 'Voir',
      icon: <VisibilityRoundedIcon />,
      variant: 'outlined',
    }
  }

  if (row.reopened) {
    return {
      label: 'Modifier',
      icon: <ModeEditOutlineRoundedIcon />,
      variant: 'contained',
    }
  }

  if (row.formStatus === 'Brouillon') {
    return {
      label: 'Continuer brouillon',
      icon: <ModeEditOutlineRoundedIcon />,
      variant: 'contained',
    }
  }

  return {
    label: 'Commencer',
    icon: <ArrowOutwardRoundedIcon />,
    variant: 'contained',
  }
}

function getStatusChipSx(status) {
  const palette = {
    Brouillon: { bg: '#eaf2ff', color: '#2563eb' },
    Soumise: { bg: '#e8f7ee', color: '#168553' },
    'Réouverte': { bg: '#eef1ff', color: '#5b5bd6' },
    'Verrouillée': { bg: '#fff4df', color: '#b7791f' },
    Disponible: { bg: '#f3f4f6', color: '#475569' },
  }

  const style = palette[status] || palette.Disponible

  return {
    bgcolor: style.bg,
    color: style.color,
    fontWeight: 700,
    borderRadius: '999px',
    px: 0.4,
  }
}

function getActionButtonSx(variant) {
  if (variant === 'outlined') {
    return {
      minHeight: 38,
      height: 38,
      px: 2,
      minWidth: 0,
      borderRadius: '12px',
      textTransform: 'none',
      fontWeight: 800,
      borderColor: '#cfe0f4',
      color: '#2b5faa',
      background: '#fff',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#b8d1ef',
        background: '#f8fbff',
        boxShadow: 'none',
      },
    }
  }

  return {
    minHeight: 40,
    height: 40,
    px: 2.1,
    minWidth: 0,
    borderRadius: '12px',
    textTransform: 'none',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #1f7ae0 0%, #2f8df0 100%)',
    boxShadow: '0 10px 20px rgba(47, 141, 240, 0.20)',
    '&:hover': {
      background: 'linear-gradient(135deg, #1668c7 0%, #257fdb 100%)',
      boxShadow: '0 14px 24px rgba(47, 141, 240, 0.24)',
    },
  }
}

function buildRules() {
  return [
    'Brouillon : modification autorisée.',
    'Soumise : lecture seule.',
    'Réouverte : correction autorisée.',
    'Verrouillée : lecture seule.',
    "Une fiche peut contenir plusieurs formations et chaque formation plusieurs employés.",
  ]
}

export default function FichesEmp() {
  const navigate = useNavigate()
  const [connectedUserRole, setConnectedUserRole] = useState('Employeur')
  const [connectedUserEmail, setConnectedUserEmail] = useState('')
  const [trackingRows, setTrackingRows] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    try {
      setConnectedUserRole(localStorage.getItem(CONNECTED_USER_ROLE_KEY) || 'Employeur')
      setConnectedUserEmail(localStorage.getItem(CONNECTED_USER_EMAIL_KEY) || '')
      setTrackingRows(getStoredTrackingRows())
      setLoadError('')
    } catch (error) {
      setLoadError("Impossible de charger les fiches de l'employeur.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  if (connectedUserRole === 'DDRH') {
    return <Navigate to="/fiches/gestion" replace />
  }

  const myRecipientIds = useMemo(
    () =>
      structureRecipients
        .filter((recipient) => recipient.email === connectedUserEmail)
        .map((recipient) => recipient.id),
    [connectedUserEmail]
  )

  const formStates = useMemo(() => getStoredFormStates(), [])

  const myRows = useMemo(() => {
    return trackingRows
      .filter((row) => myRecipientIds.includes(row.recipientId))
      .sort((left, right) => parseSentAt(right.sentAt) - parseSentAt(left.sentAt))
  }, [trackingRows, myRecipientIds])

  const rules = useMemo(() => buildRules(), [])

  return (
    <MainLayout>
      <Box sx={{ display: 'grid', gap: 3 }}>
        <Box>
          <Typography sx={{ fontSize: '1.65rem', fontWeight: 800, color: '#1b2740' }}>
            Mes fiches
          </Typography>
          <Typography sx={{ mt: 0.55, color: '#72809a', fontSize: '0.94rem', maxWidth: 860 }}>
            Chaque campagne vous transmet une seule fiche. Cette fiche peut regrouper plusieurs
            formations, et chaque formation peut concerner un ou plusieurs employés.
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            ...sectionPaperSx,
            background:
              'linear-gradient(180deg, rgba(248,251,255,0.98) 0%, rgba(255,255,255,1) 100%)',
          }}
        >
          <Stack spacing={1.3}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '14px',
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: '#eaf4ed',
                  color: '#1b8a52',
                }}
              >
                <CampaignRoundedIcon />
              </Box>
              <Typography sx={{ fontWeight: 800, color: '#1b2740', fontSize: '1rem' }}>
                Règles côté interface
              </Typography>
            </Stack>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                gap: 1,
              }}
            >
              {rules.map((rule) => (
                <Paper
                  key={rule}
                  elevation={0}
                  sx={{
                    p: 1.2,
                    borderRadius: '14px',
                    border: '1px solid #e8edf5',
                    background: '#fff',
                  }}
                >
                  <Typography sx={{ color: '#55657d', fontSize: '0.9rem', fontWeight: 600 }}>
                    {rule}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Stack>
        </Paper>

        {loadError ? (
          <Alert severity="error" sx={{ borderRadius: '14px' }}>
            {loadError}
          </Alert>
        ) : null}

        {isLoading ? (
          <Paper elevation={0} sx={sectionPaperSx}>
            <Stack spacing={1.2} alignItems="center" justifyContent="center" sx={{ py: 5 }}>
              <CircularProgress size={28} />
              <Typography sx={{ color: '#72809a', fontSize: '0.92rem' }}>
                Chargement des fiches...
              </Typography>
            </Stack>
          </Paper>
        ) : myRows.length === 0 ? (
          <Alert severity="warning" sx={{ borderRadius: '14px' }}>
            Aucune fiche n’est actuellement rattachée à votre compte.
          </Alert>
        ) : (
          <Paper elevation={0} sx={sectionPaperSx}>
            <Stack spacing={1.6}>
              <Box>
                <Typography sx={{ fontWeight: 800, color: '#1b2740', fontSize: '1rem' }}>
                  Liste des fiches
                </Typography>
                <Typography sx={{ mt: 0.35, fontSize: '0.88rem', color: '#72809a' }}>
                  Une ligne par campagne reçue, avec le statut de la fiche et l’action disponible.
                </Typography>
              </Box>

              <Stack spacing={1.2}>
                {myRows.map((row) => {
                  const status = getDisplayStatus(row)
                  const action = getActionConfig(row)
                  const requests = Array.isArray(formStates[row.id]?.trainingRequests)
                    ? formStates[row.id].trainingRequests
                    : formStates[row.id]?.intituleFormation
                      ? [formStates[row.id]]
                      : []

                  const employeesCount = new Set(
                    requests.flatMap((request) => request.employeeIds || [])
                  ).size

                  return (
                    <Paper
                      key={row.id}
                      elevation={0}
                      sx={{
                        p: 1.6,
                        borderRadius: '16px',
                        border: '1px solid #e8edf5',
                        background: '#fff',
                        boxShadow: '0 8px 18px rgba(20, 31, 56, 0.04)',
                      }}
                    >
                      <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        justifyContent="space-between"
                        spacing={1.6}
                        alignItems={{ xs: 'stretch', md: 'center' }}
                      >
                        <Box
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                              xs: '1fr',
                              lg: '1fr 1.1fr 0.8fr 0.8fr',
                            },
                            gap: 1.2,
                            flex: 1,
                          }}
                        >
                          <InfoBlock label="Campagne" value={getCampaignLabel(row)} />
                          <InfoBlock label="Fiche" value={row.templateName} />
                          <InfoBlock label="Formations" value={requests.length} />
                          <InfoBlock label="Employés" value={employeesCount} />
                        </Box>

                        <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          spacing={1}
                          alignItems={{ xs: 'flex-start', sm: 'center' }}
                          justifyContent="center"
                          sx={{ flexShrink: 0 }}
                        >
                          <Chip label={status} size="small" sx={getStatusChipSx(status)} />
                          <Button
                            startIcon={action.icon}
                            variant={action.variant}
                            onClick={() => navigate(`/fiches/form/${row.id}`)}
                            sx={getActionButtonSx(action.variant)}
                          >
                            {action.label}
                          </Button>
                        </Stack>
                      </Stack>
                    </Paper>
                  )
                })}
              </Stack>
            </Stack>
          </Paper>
        )}
      </Box>
    </MainLayout>
  )
}

function InfoBlock({ label, value }) {
  return (
    <Stack spacing={0.35}>
      <Typography sx={{ fontSize: '0.76rem', color: '#8a97ad', fontWeight: 800 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: '0.92rem', color: '#1f2b42', fontWeight: 700 }}>
        {value}
      </Typography>
    </Stack>
  )
}
