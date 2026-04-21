import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../components/layout/mainLayout'
import { CONNECTED_USER_EMAIL_KEY, CONNECTED_USER_ROLE_KEY } from '../Users/users.data'
import {
  ficheTemplates,
  getStoredTrackingRows,
  getStoredNotifications,
  saveNotifications,
  saveTrackingRows,
  structureRecipients,
  trackingStats,
} from './fiches.data'
import {
  FichePreviewCard,
  FicheSendForm,
  FichesStatsGrid,
  FichesTrackingTable,
} from './fiches.sections'
import { topGridSx } from './fiches.styles'

function getCurrentDateLabel() {
  const now = new Date()
  return now.toLocaleDateString('fr-FR')
}

export default function FichesPage() {
  const navigate = useNavigate()
  const [connectedUserRole, setConnectedUserRole] = useState('DDRH')
  const [connectedUserEmail, setConnectedUserEmail] = useState('')
  const [selectedTemplateId, setSelectedTemplateId] = useState(ficheTemplates[0].id)
  const [selectedRecipientIds, setSelectedRecipientIds] = useState([])
  const [trackingRows, setTrackingRows] = useState(getStoredTrackingRows())
  const [feedback, setFeedback] = useState('')
  const [massFailureAlert, setMassFailureAlert] = useState('')
  const [errorReportOpen, setErrorReportOpen] = useState(false)
  const [scheduledRetry, setScheduledRetry] = useState('')

  useEffect(() => {
    saveTrackingRows(trackingRows)
  }, [trackingRows])

  useEffect(() => {
    setConnectedUserRole(localStorage.getItem(CONNECTED_USER_ROLE_KEY) || 'DDRH')
    setConnectedUserEmail(localStorage.getItem(CONNECTED_USER_EMAIL_KEY) || '')
  }, [])

  const canManageAllFiches = connectedUserRole === 'DDRH'

  const selectedTemplate = useMemo(
    () => ficheTemplates.find((template) => template.id === selectedTemplateId) || ficheTemplates[0],
    [selectedTemplateId]
  )

  const visibleTrackingRows = useMemo(() => {
    if (canManageAllFiches) {
      return trackingRows
    }

    const recipientIds = structureRecipients
      .filter((recipient) => recipient.email === connectedUserEmail)
      .map((recipient) => recipient.id)

    return trackingRows.filter((row) => recipientIds.includes(row.recipientId))
  }, [canManageAllFiches, connectedUserEmail, trackingRows])

  const pushNotifications = (rows) => {
    const currentNotifications = getStoredNotifications()
    const nextNotifications = rows.map((row) => ({
      id: `notif-${row.id}-${Date.now()}`,
      type: 'fiche',
      recipientId: row.recipientId,
      recipientEmail:
        structureRecipients.find((item) => item.id === row.recipientId)?.email || '',
      title: "Nouvelle fiche d'expression des besoins",
      message: `${row.manager} a recu une nouvelle fiche pour ${row.structure}.`,
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
      }
    })

    setTrackingRows((currentRows) => [...nextRows, ...currentRows])
    pushNotifications(nextRows)
    setFeedback(
      `${nextRows.length} fiche(s) ont ete envoyees et le tableau de suivi a ete mis a jour.`
    )
    setSelectedRecipientIds([])
  }

  const handleMassFailure = () => {
    setFeedback('')
    setMassFailureAlert(
      "Echec d'envoi massif detecte. Le systeme propose une replanification et la generation d'un rapport d'erreur."
    )
    setTrackingRows((currentRows) =>
      currentRows.map((row) =>
        selectedRecipientIds.some((recipientId) => {
          const recipient = structureRecipients.find((item) => item.id === recipientId)
          return recipient?.structure === row.structure
        })
          ? { ...row, notificationStatus: 'Replanifie' }
          : row
      )
    )
  }

  const handleManualResend = (rowToUpdate) => {
    setTrackingRows((currentRows) =>
      currentRows.map((row) =>
        row.id === rowToUpdate.id ? { ...row, notificationStatus: 'Notifie' } : row
      )
    )
    pushNotifications([{ ...rowToUpdate, notificationStatus: 'Notifie' }])
    setFeedback(
      `La DDRH a verifie le contact et renvoye manuellement la notification a ${rowToUpdate.manager}.`
    )
  }

  const handleScheduleRetry = () => {
    const dateLabel = `${getCurrentDateLabel()} a 15:30`
    setScheduledRetry(dateLabel)
    setFeedback(`L'envoi a ete replanifie pour le ${dateLabel}.`)
    setMassFailureAlert('')
  }

  const handleOpenForm = (row) => {
    navigate(`/fiches/form/${row.id}`)
  }

  const handleStatusChange = (rowToUpdate, nextStatus) => {
    if (!canManageAllFiches) return

    setTrackingRows((currentRows) =>
      currentRows.map((row) =>
        row.id === rowToUpdate.id
          ? {
              ...row,
              status: nextStatus,
            }
          : row
      )
    )
    setFeedback(`Le statut de la fiche de ${rowToUpdate.manager} a ete mis a jour.`)
  }

  const handleReopenForm = (rowToUpdate) => {
    setTrackingRows((currentRows) =>
      currentRows.map((row) =>
        row.id === rowToUpdate.id
          ? {
              ...row,
              status: 'En cours',
              formStatus: 'Brouillon',
              reopened: true,
            }
          : row
      )
    )
    setFeedback(`La DDRH a reouvert la fiche de ${rowToUpdate.manager} pour correction.`)
  }

  return (
    <MainLayout>
      <Box sx={{ display: 'grid', gap: 3 }}>
        <Box>
          <Typography sx={{ fontSize: '1.6rem', fontWeight: 800, color: '#1b2740' }}>
            Fiches de formation
          </Typography>
          <Typography sx={{ mt: 0.55, fontSize: '0.92rem', color: '#72809a', maxWidth: 760 }}>
            {canManageAllFiches
              ? "Module DDRH pour l'envoi des fiches d'expression des besoins en formation et le suivi des structures destinataires."
              : 'Espace employeur : vous ne voyez que vos propres fiches de formation.'}
          </Typography>
        </Box>

        {massFailureAlert ? (
          <Alert
            severity="error"
            action={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button color="inherit" size="small" onClick={handleScheduleRetry}>
                  Replanifier
                </Button>
                <Button color="inherit" size="small" onClick={() => setErrorReportOpen(true)}>
                  Rapport d'erreur
                </Button>
              </Box>
            }
            sx={{ borderRadius: '14px' }}
          >
            {massFailureAlert}
          </Alert>
        ) : null}

        {scheduledRetry ? (
          <Alert severity="info" sx={{ borderRadius: '14px' }}>
            Nouvel envoi planifie pour le {scheduledRetry}.
          </Alert>
        ) : null}

        <FichesStatsGrid stats={trackingStats} />

        {canManageAllFiches ? (
          <Box sx={topGridSx}>
            <FicheSendForm
              templates={ficheTemplates}
              recipients={structureRecipients}
              selectedTemplateId={selectedTemplateId}
              selectedRecipientIds={selectedRecipientIds}
              onTemplateChange={setSelectedTemplateId}
              onRecipientsChange={setSelectedRecipientIds}
              onSubmit={handleSendFiches}
              onMassFailure={handleMassFailure}
              feedback={feedback}
              massFailureAlert={massFailureAlert}
            />
          </Box>
        ) : null}

        <FichesTrackingTable
          rows={visibleTrackingRows}
          onManualResend={canManageAllFiches ? handleManualResend : undefined}
          onReopen={canManageAllFiches ? handleReopenForm : undefined}
          onOpenForm={handleOpenForm}
          canManageStatuses={canManageAllFiches}
          onStatusChange={handleStatusChange}
        />
      </Box>

      <Dialog open={errorReportOpen} onClose={() => setErrorReportOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 800 }}>Rapport d'erreur d'envoi</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 1.2, mt: 0.5 }}>
            <Typography sx={{ color: '#475569', fontSize: '0.92rem' }}>
              Incident : panne technique sur l&apos;envoi des notifications.
            </Typography>
            <Typography sx={{ color: '#475569', fontSize: '0.92rem' }}>
              Impact : certains responsables n&apos;ont pas recu leur notification.
            </Typography>
            <Typography sx={{ color: '#475569', fontSize: '0.92rem' }}>
              Action recommandee : replanifier l'envoi et relancer manuellement les structures non
              notifiees.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setErrorReportOpen(false)} sx={{ textTransform: 'none', fontWeight: 700 }}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  )
}
