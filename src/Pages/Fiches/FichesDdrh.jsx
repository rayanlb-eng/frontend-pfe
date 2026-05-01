import {
  Alert,
  Box,
  Button,
  Chip,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import MainLayout from '../../components/layout/mainLayout'
import { CONNECTED_USER_ROLE_KEY } from '../Users/users.data'
import FicheSendForm from './component/FicheSendForm'
import { ficheTemplates, structureRecipients } from './data/data'
import {
  getStoredFormStates,
  getStoredNotifications,
  getStoredTrackingRows,
  saveNotifications,
  saveTrackingRows,
} from './data/storage'
import { sectionPaperSx } from './data/style'

function getCurrentDateLabel() {
  return new Date().toLocaleDateString('fr-FR')
}

function getEffectiveStatus(row) {
  if (row.locked) return 'Verrouillée'
  if (row.ddrhDecision === 'Validee') return 'Validée'
  if (row.ddrhDecision === 'Rejetee') return 'Rejetée'
  if (row.reopened) return 'Réouverte'
  if (row.formStatus === 'Soumise') return 'À valider'
  if (row.formStatus === 'Brouillon') return 'Brouillon'
  return 'Non ouverte'
}

function getStatusChipSx(status) {
  const palette = {
    'À valider': { bg: '#fff4df', color: '#b7791f' },
    Validée: { bg: '#e8f7ee', color: '#168553' },
    Rejetée: { bg: '#ffe8ed', color: '#c24157' },
    Réouverte: { bg: '#eef1ff', color: '#5b5bd6' },
    Verrouillée: { bg: '#edf2f7', color: '#475569' },
    Brouillon: { bg: '#eaf2ff', color: '#2563eb' },
    'Non ouverte': { bg: '#f8fafc', color: '#64748b' },
  }

  const style = palette[status] || palette['Non ouverte']

  return {
    bgcolor: style.bg,
    color: style.color,
    fontWeight: 700,
    borderRadius: '999px',
  }
}

export default function FichesDdrh() {
  const navigate = useNavigate()
  const [connectedUserRole] = useState(
    () => localStorage.getItem(CONNECTED_USER_ROLE_KEY) || 'DDRH'
  )
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    ficheTemplates[0].id || ''
  )
  const [selectedRecipientIds, setSelectedRecipientIds] = useState([])
  const [trackingRows, setTrackingRows] = useState(() => getStoredTrackingRows())
  const [statusFilter, setStatusFilter] = useState('Tous')
  const [structureFilter, setStructureFilter] = useState('Toutes')
  const [feedback, setFeedback] = useState('')
  const [massFailureAlert, setMassFailureAlert] = useState('')

  const formStates = useMemo(() => getStoredFormStates(), [])

  useEffect(() => {
    saveTrackingRows(trackingRows)
  }, [trackingRows])

  const selectedTemplate = useMemo(
    () =>
      ficheTemplates.find((template) => template.id === selectedTemplateId) ||
      ficheTemplates[0],
    [selectedTemplateId]
  )

  const rowsWithCounts = useMemo(() => {
    return trackingRows.map((row) => {
      const form = formStates[row.id] || {}
      const requests = Array.isArray(form.trainingRequests)
        ? form.trainingRequests
        : form.intituleFormation
          ? [form]
          : []

      const employeeIds = new Set(
        requests.flatMap((request) => request.employeeIds || [])
      )

      return {
        ...row,
        effectiveStatus: getEffectiveStatus(row),
        formationsCount: requests.length,
        employeesCount: employeeIds.size,
      }
    })
  }, [formStates, trackingRows])

  const filteredRows = useMemo(() => {
    return rowsWithCounts.filter((row) => {
      const statusOk = statusFilter === 'Tous' || row.effectiveStatus === statusFilter
      const structureOk =
        structureFilter === 'Toutes' || row.structure === structureFilter
      return statusOk && structureOk
    })
  }, [rowsWithCounts, statusFilter, structureFilter])

  if (connectedUserRole !== 'DDRH') {
    return <Navigate to="/fiches/mes" replace />
  }

  const pushNotifications = (rows, type = 'fiche') => {
    const currentNotifications = getStoredNotifications()

    const nextNotifications = rows.map((row) => ({
      id: `notif-${row.id}-${Date.now()}`,
      type,
      recipientId: row.recipientId,
      recipientEmail:
        structureRecipients.find((item) => item.id === row.recipientId)?.email || '',
      title:
        type === 'relance'
          ? 'Relance de soumission de fiche'
          : "Nouvelle fiche d'expression des besoins",
      message:
        type === 'relance'
          ? `${row.manager} doit encore soumettre sa fiche pour ${row.structure}.`
          : `${row.manager} a reçu une nouvelle fiche pour ${row.structure}.`,
      trackingId: row.id,
      read: false,
      createdAt: getCurrentDateLabel(),
    }))

    saveNotifications([...nextNotifications, ...currentNotifications])
  }

  const handleSendFiches = () => {
    setMassFailureAlert('')

    const nextRows = selectedRecipientIds.map((recipientId, index) => {
      const recipient = structureRecipients.find((item) => item.id === recipientId)

      return {
        id: `trk-new-${Date.now()}-${index}`,
        templateId: selectedTemplate.id,
        templateName: selectedTemplate.name,
        recipientId: recipient.id,
        structure: recipient.structure,
        manager: recipient.manager,
        sentAt: getCurrentDateLabel(),
        status: 'Envoyee',
        notificationStatus: 'Notifie',
        formStatus: 'Non ouverte',
        reopened: false,
        locked: false,
        ddrhDecision: '',
        ddrhComment: '',
      }
    })

    setTrackingRows((currentRows) => [...nextRows, ...currentRows])
    pushNotifications(nextRows)
    setFeedback(`${nextRows.length} fiche(s) envoyée(s) aux responsables sélectionnés.`)
    setSelectedRecipientIds([])
  }

  const handleMassFailure = () => {
    setFeedback('')
    setMassFailureAlert(
      "Échec d'envoi massif détecté. Veuillez relancer l'envoi après vérification."
    )
  }

  return (
    <MainLayout>
      <Box sx={{ display: 'grid', gap: 3 }}>
        <Box>
          <Typography sx={{ fontSize: '1.65rem', fontWeight: 800, color: '#1b2740' }}>
            Fiches DDRH
          </Typography>
          <Typography
            sx={{ mt: 0.55, color: '#72809a', fontSize: '0.94rem', maxWidth: 860 }}
          >
            Envoyez les fiches, filtrez les retours des structures et ouvrez directement une
            fiche pour la lire puis la valider, la rejeter, la verrouiller ou la réouvrir.
          </Typography>
        </Box>

        {feedback ? (
          <Alert severity="success" sx={{ borderRadius: '14px' }}>
            {feedback}
          </Alert>
        ) : null}

        {massFailureAlert ? (
          <Alert severity="error" sx={{ borderRadius: '14px' }}>
            {massFailureAlert}
          </Alert>
        ) : null}

        <Box>
          <FicheSendForm
            templates={ficheTemplates}
            recipients={structureRecipients}
            selectedTemplateId={selectedTemplateId}
            selectedRecipientIds={selectedRecipientIds}
            onTemplateChange={setSelectedTemplateId}
            onRecipientsChange={setSelectedRecipientIds}
            onSubmit={handleSendFiches}
            onMassFailure={handleMassFailure}
            feedback=""
            massFailureAlert=""
          />
        </Box>

        <Paper elevation={0} sx={sectionPaperSx}>
          <Stack spacing={1.6}>
            <Box>
              <Typography sx={{ fontWeight: 800, color: '#1b2740', fontSize: '1rem' }}>
                Gestion des fiches
              </Typography>
              <Typography sx={{ mt: 0.35, fontSize: '0.88rem', color: '#72809a' }}>
                Tableau de suivi orienté action, sans redondance avec le dashboard.
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '220px 260px auto' },
                gap: 1.2,
                alignItems: 'center',
              }}
            >
              <TextField
                select
                label="Statut"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                {[
                  'Tous',
                  'À valider',
                  'Validée',
                  'Rejetée',
                  'Réouverte',
                  'Verrouillée',
                  'Brouillon',
                  'Non ouverte',
                ].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Structure"
                value={structureFilter}
                onChange={(event) => setStructureFilter(event.target.value)}
              >
                <MenuItem value="Toutes">Toutes</MenuItem>
                {structureRecipients.map((recipient) => (
                  <MenuItem key={recipient.id} value={recipient.structure}>
                    {recipient.structure}
                  </MenuItem>
                ))}
              </TextField>

              <Typography sx={{ color: '#72809a', fontSize: '0.9rem' }}>
                {filteredRows.length} fiche(s) affichée(s)
              </Typography>
            </Box>

            <Stack spacing={1.1}>
              {filteredRows.map((row) => (
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
                    direction={{ xs: 'column', lg: 'row' }}
                    justifyContent="space-between"
                    spacing={1.4}
                    alignItems={{ xs: 'stretch', lg: 'center' }}
                  >
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                          xs: '1fr',
                          lg: '1.2fr 1fr 0.9fr 0.9fr 0.9fr',
                        },
                        gap: 1.2,
                        flex: 1,
                      }}
                    >
                      <InfoBlock label="Structure" value={row.structure} />
                      <InfoBlock label="Responsable" value={row.manager} />
                      <InfoBlock
                        label="Statut"
                        value={
                          <Chip
                            size="small"
                            label={row.effectiveStatus}
                            sx={getStatusChipSx(row.effectiveStatus)}
                          />
                        }
                      />
                      <InfoBlock label="Nb formations" value={row.formationsCount} />
                      <InfoBlock label="Nb employés" value={row.employeesCount} />
                    </Box>

                    <Button
                      variant="outlined"
                      onClick={() => navigate(`/fiches/form/${row.id}`)}
                      sx={{
                        minHeight: 40,
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 700,
                        borderColor: '#cfe0f4',
                        color: '#2b5faa',
                        background: '#fff',
                        '&:hover': {
                          borderColor: '#b8d1ef',
                          background: '#f8fbff',
                        },
                      }}
                    >
                      Voir fiche
                    </Button>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Stack>
        </Paper>
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
      {typeof value === 'string' || typeof value === 'number' ? (
        <Typography sx={{ fontSize: '0.92rem', color: '#1f2b42', fontWeight: 700 }}>
          {value}
        </Typography>
      ) : (
        value
      )}
    </Stack>
  )
}
