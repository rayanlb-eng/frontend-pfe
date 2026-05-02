import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { createElement, useMemo, useState } from 'react'
import MainLayout from '../../components/layout/mainLayout'
import StatCard from '../../components/ui/statcard'
import { employeesDirectory, structureRecipients } from '../Fiches/data/data'
import {
  FICHE_FORMS_STORAGE_KEY,
  FICHE_NOTIFICATIONS_STORAGE_KEY,
  TRACKING_ROWS_STORAGE_KEY,
  getStoredNotifications,
  getStoredFormStates,
  getStoredTrackingRows,
  saveNotifications,
  saveTrackingRows,
} from '../Fiches/data/storage'
import {
  ANALYSE_DECISIONS_STORAGE_KEY,
  buildAnalyseRows,
  buildAnalyseStats,
  cleanText,
  getDecisionColor,
  getPriorityColor,
  getStoredAnalyseState,
  saveStoredAnalyseState,
} from './analyse.data'

const sectionPaperSx = {
  p: 2.5,
  borderRadius: '22px',
  border: '1px solid #E5EBF3',
  background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFF 100%)',
  boxShadow: '0 16px 36px rgba(20,31,56,0.08)',
}

const selectSx = {
  minWidth: 136,
  height: 38,
  borderRadius: '12px',
  bgcolor: '#fff',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#dbe5f0',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#b8c9dd',
  },
}

export default function AnalysePage() {
  const [analyseState, setAnalyseState] = useState(() => getStoredAnalyseState())
  const [storageVersion, setStorageVersion] = useState(0)
  const [detailsRowKey, setDetailsRowKey] = useState('')
  const [decisionDialog, setDecisionDialog] = useState({
    open: false,
    rowKey: '',
    decision: '',
    comment: '',
  })

  const trackingRows = useMemo(() => {
    if (storageVersion < 0) return []
    return getStoredTrackingRows()
  }, [storageVersion])
  const formStates = useMemo(() => {
    if (storageVersion < 0) return {}
    return getStoredFormStates()
  }, [storageVersion])

  const rows = useMemo(
    () => buildAnalyseRows(trackingRows, formStates, employeesDirectory, analyseState),
    [trackingRows, formStates, analyseState]
  )

  const stats = useMemo(() => buildAnalyseStats(rows), [rows])

  const detailsRow = useMemo(
    () => rows.find((row) => row.key === detailsRowKey) || null,
    [rows, detailsRowKey]
  )

  const decisionRow = useMemo(
    () => rows.find((row) => row.key === decisionDialog.rowKey) || null,
    [rows, decisionDialog.rowKey]
  )

  const allDecided = rows.length > 0 && rows.every((row) => row.decision !== 'À décider')

  const updateAnalyseRow = (rowKey, patch) => {
    setAnalyseState((current) => {
      const next = {
        ...current,
        [rowKey]: {
          ...(current[rowKey] || {}),
          ...patch,
        },
      }

      saveStoredAnalyseState(next)
      return next
    })
  }

  const propagateNonJustifiedDecision = (row, comment) => {
    const impactedTrackingIds = row.structures.map((structure) => structure.trackingId)
    const storedRows = getStoredTrackingRows()

    const nextTrackingRows = storedRows.map((trackingRow) => {
      if (!impactedTrackingIds.includes(trackingRow.id)) return trackingRow

      return {
        ...trackingRow,
        ddrhComment: `Formation "${row.formation}" : ${comment}`,
      }
    })

    saveTrackingRows(nextTrackingRows)
    setStorageVersion((current) => current + 1)

    const storedNotifications = getStoredNotifications()
    const timestamp = Date.now()

    const nextNotifications = row.structures.map((structure, index) => ({
      id: `notif-analyse-${row.key}-${structure.recipientId}-${timestamp}-${index}`,
      type: 'analyse-commentaire',
      recipientId: structure.recipientId,
      recipientEmail: '',
      title: 'Retour DDRH sur une formation demandée',
      message: `La formation "${row.formation}" a été jugée non justifiée. Commentaire DDRH : ${comment}`,
      trackingId: structure.trackingId,
      formationKey: row.key,
      read: false,
      createdAt: new Date().toLocaleDateString('fr-FR'),
    }))

    saveNotifications([...nextNotifications, ...storedNotifications])
  }

  const propagateDecisionNotification = (row, decision) => {
    const storedNotifications = getStoredNotifications()
    const timestamp = Date.now()
    const recipientsById = new Map(
      structureRecipients.map((recipient) => [recipient.id, recipient])
    )

    const notificationMeta = {
      'Acceptée': {
        title: 'Formation acceptee par la DDRH',
        message: `Votre demande pour la formation "${row.formation}" a ete acceptee par la DDRH.`,
      },
      'Refusée': {
        title: 'Formation refusee par la DDRH',
        message: `Votre demande pour la formation "${row.formation}" a ete refusee par la DDRH.`,
      },
      Reportee: {
        title: 'Formation reportee par la DDRH',
        message: `Votre demande pour la formation "${row.formation}" a ete reportee a une prochaine campagne.`,
      },
    }

    const nextNotifications = row.structures.map((structure, index) => ({
      id: `notif-analyse-decision-${row.key}-${structure.recipientId}-${decision}-${timestamp}-${index}`,
      type: 'analyse-decision',
      recipientId: structure.recipientId,
      recipientEmail: recipientsById.get(structure.recipientId)?.email || '',
      title: notificationMeta[decision]?.title || 'Decision DDRH sur une formation',
      message:
        notificationMeta[decision]?.message ||
        `La DDRH a pris une decision sur la formation "${row.formation}".`,
      trackingId: structure.trackingId,
      formationKey: row.key,
      read: false,
      createdAt: new Date().toLocaleDateString('fr-FR'),
    }))

    saveNotifications([...nextNotifications, ...storedNotifications])
  }

  const handleOpenDecisionDialog = (decision) => {
    if (!detailsRow) return

    setDecisionDialog({
      open: true,
      rowKey: detailsRow.key,
      decision,
      comment: decision === 'Non justifiée' ? detailsRow.comment || '' : '',
    })
  }

  const handleCloseDecisionDialog = () => {
    setDecisionDialog({
      open: false,
      rowKey: '',
      decision: '',
      comment: '',
    })
  }

  const handleConfirmDecision = () => {
    if (!decisionRow) return

    if (decisionDialog.decision === 'Non justifiée') {
      const trimmedComment = decisionDialog.comment.trim()
      if (!trimmedComment) return

      updateAnalyseRow(decisionRow.key, {
        decision: 'Non justifiée',
        comment: trimmedComment,
      })
      propagateNonJustifiedDecision(decisionRow, trimmedComment)
    } else if (decisionDialog.decision === 'Acceptée') {
      updateAnalyseRow(decisionRow.key, { decision: 'Acceptée' })
      propagateDecisionNotification(decisionRow, 'Acceptée')
    } else if (decisionDialog.decision === 'Refusée') {
      updateAnalyseRow(decisionRow.key, { decision: 'Refusée' })
      propagateDecisionNotification(decisionRow, 'Refusée')
    }

    handleCloseDecisionDialog()
  }

  const handleResetDemoData = () => {
    localStorage.removeItem(TRACKING_ROWS_STORAGE_KEY)
    localStorage.removeItem(FICHE_FORMS_STORAGE_KEY)
    localStorage.removeItem(FICHE_NOTIFICATIONS_STORAGE_KEY)
    localStorage.removeItem(ANALYSE_DECISIONS_STORAGE_KEY)
    setAnalyseState({})
    setDetailsRowKey('')
    handleCloseDecisionDialog()
    setStorageVersion((current) => current + 1)
  }

  return (
    <MainLayout>
      <Box sx={{ display: 'grid', gap: 3 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={1.5}
        >
          <Box>
            <Typography sx={{ fontSize: '1.7rem', fontWeight: 900, color: '#172033' }}>
              Analyse des besoins
            </Typography>
            <Typography sx={{ mt: 0.5, color: '#72809A', fontSize: '0.95rem', maxWidth: 900 }}>
              La DDRH regroupe ici les formations issues des fiches soumises, ajuste la priorité,
              identifie les demandes non justifiées et consulte le détail des structures et des
              employés concernés.
            </Typography>
          </Box>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            alignItems={{ xs: 'stretch', sm: 'center' }}
          >
            <Chip
              label="Campagne 2026"
              sx={{
                bgcolor: '#EAF6EF',
                color: '#167A49',
                fontWeight: 800,
                borderRadius: '12px',
                px: 1,
              }}
            />
            <Button
              variant="outlined"
              onClick={handleResetDemoData}
              sx={{
                minHeight: 38,
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 800,
                borderColor: '#D7E3F1',
                color: '#334155',
                '&:hover': {
                  borderColor: '#B7C9DD',
                  bgcolor: '#F8FBFF',
                },
              }}
            >
              Réinitialiser les données de démo
            </Button>
          </Stack>
        </Stack>

        <Alert severity="info" sx={{ borderRadius: '16px' }}>
          Le verrouillage reste géré dans la page des fiches DDRH. Ici, la DDRH consulte le
          regroupement par formation et décide après ouverture du détail.
        </Alert>

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

        <Paper elevation={0} sx={sectionPaperSx}>
          <Stack spacing={2}>
            <Box>
              <Typography sx={{ fontWeight: 900, color: '#172033', fontSize: '1.08rem' }}>
                Tableau de priorisation
              </Typography>
              <Typography sx={{ mt: 0.35, color: '#72809A', fontSize: '0.9rem' }}>
                Les lignes sont calculées automatiquement à partir des fiches soumises. Une même
                formation peut regrouper plusieurs structures et plusieurs employés.
              </Typography>
            </Box>

            {rows.length === 0 ? (
              <Alert severity="warning" sx={{ borderRadius: '14px' }}>
                Aucune fiche soumise n&apos;est disponible pour alimenter l&apos;analyse.
              </Alert>
            ) : null}

            {allDecided ? (
              <Alert severity="success" sx={{ borderRadius: '14px' }}>
                Toutes les formations regroupées ont reçu une décision DDRH.
              </Alert>
            ) : null}

            {rows.length > 0 ? (
              <Stack spacing={1.2}>
                <Box
                  sx={{
                    display: { xs: 'none', lg: 'grid' },
                    gridTemplateColumns: '1.4fr 0.9fr 0.7fr 0.7fr 0.9fr 0.6fr 0.9fr',
                    px: 1.5,
                    py: 0.7,
                    color: '#64748B',
                    fontWeight: 900,
                    fontSize: '0.76rem',
                    textTransform: 'uppercase',
                    gap: 1,
                  }}
                >
                  <Box>Formation</Box>
                  <Box>Catégorie</Box>
                  <Box>Structures</Box>
                  <Box>Employés</Box>
                  <Box>Priorité</Box>
                  <Box>Score</Box>
                  <Box>Décision</Box>
                </Box>

                {rows.map((row) => {
                  const priorityColor = getPriorityColor(row.priorite)
                  const decisionColor = getDecisionColor(row.decision)

                  return (
                    <Paper
                      key={row.key}
                      elevation={0}
                      sx={{
                        p: 1.5,
                        borderRadius: '18px',
                        border: '1px solid #EAF0F7',
                        boxShadow: '0 8px 20px rgba(20,31,56,0.04)',
                      }}
                    >
                      <Stack spacing={1.15}>
                        <Box
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                              xs: '1fr',
                              lg: '1.4fr 0.9fr 0.7fr 0.7fr 0.9fr 0.6fr 0.9fr',
                            },
                            gap: 1.2,
                            alignItems: 'center',
                          }}
                        >
                          <InfoColumn label="Formation" value={row.formation} strong />
                          <InfoColumn label="Catégorie" value={row.categorie} />
                          <InfoColumn label="Structures" value={row.structuresCount} />
                          <InfoColumn label="Employés" value={row.employeesCount} />

                          <Box>
                            <MobileLabel label="Priorité" />
                            <Select
                              size="small"
                              value={row.priorite}
                              onChange={(event) =>
                                updateAnalyseRow(row.key, { priorite: event.target.value })
                              }
                              sx={selectSx}
                            >
                              <MenuItem value="Haute">Haute</MenuItem>
                              <MenuItem value="Moyenne">Moyenne</MenuItem>
                              <MenuItem value="Basse">Basse</MenuItem>
                            </Select>
                          </Box>

                          <InfoColumn label="Score" value={row.score} score />

                          <Box>
                            <MobileLabel label="Décision" />
                            <Chip
                              label={row.decision}
                              size="small"
                              sx={{
                                bgcolor: `${decisionColor}18`,
                                color: decisionColor,
                                fontWeight: 800,
                                width: 'fit-content',
                                borderRadius: '10px',
                              }}
                            />
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            pt: 1.1,
                            borderTop: '1px solid #edf2f7',
                            display: 'flex',
                            alignItems: { xs: 'flex-start', lg: 'center' },
                            justifyContent: 'space-between',
                            flexDirection: { xs: 'column', lg: 'row' },
                            gap: 1,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Chip
                              label={row.priorite}
                              size="small"
                              sx={{
                                display: { xs: 'inline-flex', lg: 'none' },
                                bgcolor: `${priorityColor}18`,
                                color: priorityColor,
                                fontWeight: 800,
                              }}
                            />
                            {row.comment ? (
                              <Typography sx={{ color: '#64748B', fontSize: '0.84rem' }}>
                                <Box component="span" sx={{ fontWeight: 800, color: '#172033' }}>
                                  Commentaire DDRH :
                                </Box>{' '}
                                {row.comment}
                              </Typography>
                            ) : (
                              <Typography sx={{ color: '#94A3B8', fontSize: '0.84rem' }}>
                                Aucun commentaire DDRH pour le moment.
                              </Typography>
                            )}
                          </Box>

                          <Button
                            size="small"
                            startIcon={<VisibilityRoundedIcon />}
                            variant="outlined"
                            onClick={() => setDetailsRowKey(row.key)}
                            sx={actionButtonSx('neutral')}
                          >
                            Voir détail
                          </Button>
                        </Box>
                      </Stack>
                    </Paper>
                  )
                })}
              </Stack>
            ) : null}
          </Stack>
        </Paper>
      </Box>

      <Dialog open={Boolean(detailsRow)} onClose={() => setDetailsRowKey('')} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: 900 }}>Détail des structures et employés</DialogTitle>
        <DialogContent>
          {detailsRow ? (
          <Stack spacing={2} sx={{ pt: 0.6 }}>
            <Box>
              <Typography sx={{ fontWeight: 800, color: '#172033' }}>
                {detailsRow.formation}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 0.8, flexWrap: 'wrap' }}>
                <Chip
                  size="small"
                  label={detailsRow.decision || 'À décider'}
                  sx={{
                    bgcolor: `${getDecisionColor(detailsRow.decision)}18`,
                    color: getDecisionColor(detailsRow.decision),
                    fontWeight: 800,
                    borderRadius: '10px',
                  }}
                />
                <Chip
                  size="small"
                  label={`Priorité ${detailsRow.priorite || ''}`}
                  sx={{
                    bgcolor: `${getPriorityColor(detailsRow.priorite)}18`,
                    color: getPriorityColor(detailsRow.priorite),
                    fontWeight: 800,
                    borderRadius: '10px',
                  }}
                />
              </Stack>
              <Typography sx={{ mt: 0.8, color: '#64748B', fontSize: '0.9rem' }}>
                {detailsRow.structuresCount} structure(s) et {detailsRow.employeesCount} employé(s)
                {' '}concernés par cette formation.
              </Typography>
              {detailsRow.comment ? (
                <Alert severity="info" sx={{ mt: 1.2, borderRadius: '14px' }}>
                  <strong>Commentaire DDRH :</strong> {detailsRow.comment}
                </Alert>
              ) : null}
            </Box>

            {detailsRow.structures.map((structure) => {
              const structureEmployees = detailsRow.employees.filter(
                (employee) => employee.structure === structure.structure
              )

              return (
                <Paper
                  key={structure.recipientId}
                  elevation={0}
                  sx={{
                    p: 1.7,
                    borderRadius: '18px',
                    border: '1px solid #E7EDF5',
                    background: '#FAFCFF',
                  }}
                >
                  <Stack spacing={1.3}>
                    <Stack
                      direction={{ xs: 'column', md: 'row' }}
                      justifyContent="space-between"
                      spacing={1}
                    >
                      <Box>
                        <Typography sx={{ fontWeight: 800, color: '#172033' }}>
                          {structure.structure}
                        </Typography>
                        <Typography sx={{ color: '#64748B', fontSize: '0.88rem' }}>
                          Responsable : {structure.manager}
                        </Typography>
                      </Box>
                      <Chip
                        label={structure.ddrhDecision === 'Validee' ? 'Déjà validée' : 'Soumise'}
                        size="small"
                        sx={{
                          bgcolor: structure.ddrhDecision === 'Validee' ? '#EAF6EF' : '#EEF4FF',
                          color: structure.ddrhDecision === 'Validee' ? '#167A49' : '#2563EB',
                          fontWeight: 800,
                          borderRadius: '10px',
                          width: 'fit-content',
                        }}
                      />
                    </Stack>

                    <Stack spacing={1}>
                      {structureEmployees.map((employee) => (
                        <Box
                          key={`${structure.recipientId}-${employee.employeeId}`}
                          sx={{
                            p: 1.2,
                            borderRadius: '14px',
                            bgcolor: '#fff',
                            border: '1px solid #EAF0F7',
                          }}
                        >
                          <Typography sx={{ fontWeight: 800, color: '#172033' }}>
                            {employee.fullName}
                          </Typography>
                          <Typography sx={{ color: '#64748B', fontSize: '0.86rem' }}>
                            {employee.poste}
                            {employee.division ? ` · ${employee.division}` : ''}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Stack>
                </Paper>
              )
            })}
          </Stack>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
          <Button onClick={() => setDetailsRowKey('')} sx={{ textTransform: 'none' }}>
            Fermer
          </Button>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<CheckCircleRoundedIcon />}
              onClick={() => handleOpenDecisionDialog('Acceptée')}
              sx={actionButtonSx('success')}
            >
              Accepter
            </Button>
            <Button
              variant="outlined"
              startIcon={<CloseRoundedIcon />}
              onClick={() => handleOpenDecisionDialog('Refusée')}
              sx={actionButtonSx('warning')}
            >
              Refuser
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<ErrorOutlineRoundedIcon />}
              onClick={() => handleOpenDecisionDialog('Non justifiée')}
              sx={actionButtonSx('error')}
            >
              Non justifiée
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      <Dialog
        open={decisionDialog.open}
        onClose={handleCloseDecisionDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 900 }}>
          {decisionDialog.decision === 'Acceptée'
            ? 'Confirmer l’acceptation'
            : decisionDialog.decision === 'Refusée'
              ? 'Confirmer le refus'
              : 'Confirmer la décision non justifiée'}
        </DialogTitle>
        <DialogContent>
          {decisionRow ? (
          <Stack spacing={1.4} sx={{ pt: 0.6 }}>
            <Typography sx={{ color: '#64748B', fontSize: '0.92rem' }}>
              Formation concernée :{' '}
              <Box component="span" sx={{ fontWeight: 800, color: '#172033' }}>
                {decisionRow.formation}
              </Box>
            </Typography>

            {decisionDialog.decision === 'Acceptée' ? (
              <Alert severity="success" sx={{ borderRadius: '14px' }}>
                Cette formation sera marquée comme acceptée dans l’analyse DDRH.
              </Alert>
            ) : null}

            {decisionDialog.decision === 'Refusée' ? (
              <Alert severity="warning" sx={{ borderRadius: '14px' }}>
                Cette formation sera marquée comme refusée dans l’analyse DDRH.
              </Alert>
            ) : null}

            {decisionDialog.decision === 'Non justifiée' ? (
              <>
                <Alert severity="error" sx={{ borderRadius: '14px' }}>
                  Cette décision enverra un retour aux structures qui ont demandé cette formation.
                </Alert>
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  value={decisionDialog.comment}
                  onChange={(event) =>
                    setDecisionDialog((current) => ({
                      ...current,
                      comment: event.target.value,
                    }))
                  }
                  placeholder="Saisir le commentaire DDRH obligatoire..."
                />
              </>
            ) : null}
          </Stack>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={handleCloseDecisionDialog} sx={{ textTransform: 'none' }}>
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmDecision}
            disabled={
              decisionDialog.decision === 'Non justifiée' &&
              !decisionDialog.comment.trim()
            }
            sx={{
              textTransform: 'none',
              borderRadius: '12px',
              boxShadow: 'none',
            }}
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  )
}

function MobileLabel({ label }) {
  return (
    <Typography
      sx={{
        display: { xs: 'block', lg: 'none' },
        fontSize: '0.76rem',
        color: '#8A97AD',
        fontWeight: 800,
        mb: 0.4,
      }}
    >
      {label}
    </Typography>
  )
}

function InfoColumn({ label, value, strong = false, score = false }) {
  return (
    <Box>
      <MobileLabel label={label} />
      <Typography
        sx={{
          color: score ? '#15803D' : strong ? '#172033' : '#334155',
          fontWeight: score ? 900 : strong ? 800 : 700,
        }}
      >
        {cleanText(value)}
      </Typography>
    </Box>
  )
}

function actionButtonSx(tone) {
  if (tone === 'success') {
    return {
      minHeight: 36,
      textTransform: 'none',
      fontWeight: 800,
      borderRadius: '10px',
      boxShadow: 'none',
      color: '#167A49',
      borderColor: '#B7E1C8',
      '&:hover': {
        borderColor: '#8FD0AB',
        bgcolor: '#F2FCF6',
        boxShadow: 'none',
      },
    }
  }

  if (tone === 'warning') {
    return {
      minHeight: 36,
      textTransform: 'none',
      fontWeight: 800,
      borderRadius: '10px',
      boxShadow: 'none',
      color: '#B45309',
      borderColor: '#F5D0A4',
      '&:hover': {
        borderColor: '#F0B86B',
        bgcolor: '#FFF7ED',
        boxShadow: 'none',
      },
    }
  }

  if (tone === 'error') {
    return {
      minHeight: 36,
      textTransform: 'none',
      fontWeight: 800,
      borderRadius: '10px',
      boxShadow: 'none',
    }
  }

  return {
    minHeight: 36,
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
