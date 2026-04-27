import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded'
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded'
import UndoRoundedIcon from '@mui/icons-material/UndoRounded'
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MainLayout from '../../components/layout/mainLayout'
import { CONNECTED_USER_ROLE_KEY } from '../Users/users.data'
import { employeesDirectory, ficheTemplates } from './data/data'
import {
  getStoredFormStates,
  getStoredTrackingRows,
  saveFormStates,
  saveTrackingRows,
} from './data/storage'
import { modernSelectSx, sectionPaperSx } from './data/style'

function createDefaultTrainingRequest() {
  return {
    employeeIds: [],
    intituleFormation: '',
    contexteFormation: '',
    objectif: '',
    kpi: '',
    echeance: '',
    ecartMetier: '',
    ecartOutils: '',
    ecartComportement: '',
    ecartProjet: '',
  }
}

function createDefaultForm() {
  return {
    trainingRequests: [createDefaultTrainingRequest()],
  }
}

function normalizeStoredForm(rawForm) {
  if (!rawForm) return createDefaultForm()

  if (Array.isArray(rawForm.trainingRequests) && rawForm.trainingRequests.length > 0) {
    return {
      trainingRequests: rawForm.trainingRequests.map((request) => {
        const normalizedRequest = {
          ...createDefaultTrainingRequest(),
          ...request,
        }

        normalizedRequest.employeeIds = Array.isArray(normalizedRequest.employeeIds)
          ? normalizedRequest.employeeIds.map((id) => String(id))
          : normalizedRequest.employeeId
            ? [String(normalizedRequest.employeeId)]
            : []

        delete normalizedRequest.employeeId
        return normalizedRequest
      }),
    }
  }

  const matchedEmployee = employeesDirectory.find(
    (employee) =>
      String(employee.idEmploye) === String(rawForm.employeMatricule || '') ||
      (
        employee.nom.toLowerCase() === String(rawForm.employeNom || '').toLowerCase() &&
        employee.prenom.toLowerCase() === String(rawForm.employePrenom || '').toLowerCase()
      )
  )

  return {
    trainingRequests: [
      {
        ...createDefaultTrainingRequest(),
        employeeIds: matchedEmployee ? [String(matchedEmployee.idEmploye)] : [],
        intituleFormation: rawForm.intituleFormation || '',
        contexteFormation: rawForm.contexteFormation || '',
        objectif: rawForm.objectif || '',
        kpi: rawForm.kpi || '',
        echeance: rawForm.echeance || '',
        ecartMetier: rawForm.ecartMetier || '',
        ecartOutils: rawForm.ecartOutils || '',
        ecartComportement: rawForm.ecartComportement || '',
        ecartProjet: rawForm.ecartProjet || '',
      },
    ],
  }
}

function getStatusLabel(row) {
  if (row.locked) return 'Verrouillée'
  if (row.reopened) return 'Réouverte'
  if (row.formStatus === 'Soumise') return 'Soumise'
  if (row.formStatus === 'Brouillon') return 'Brouillon'
  return 'Disponible'
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
  }
}

export default function FicheFormPage() {
  const { trackingId } = useParams()
  const navigate = useNavigate()
  const connectedRole = localStorage.getItem(CONNECTED_USER_ROLE_KEY) || 'Employeur'
  const isDdrh = connectedRole === 'DDRH'

  const [trackingRows, setTrackingRows] = useState(() => getStoredTrackingRows())
  const [formStates, setFormStates] = useState(() => getStoredFormStates())
  const row = trackingRows.find((item) => item.id === trackingId)

  const template = useMemo(
    () => ficheTemplates.find((item) => item.id === row?.templateId) || ficheTemplates[0],
    [row]
  )

  const [form, setForm] = useState(() => normalizeStoredForm(formStates[trackingId]))
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')
  const [ddrhComment, setDdrhComment] = useState(row?.ddrhComment || '')

  if (!row) {
    return (
      <MainLayout>
        <Alert severity="error" sx={{ borderRadius: '14px' }}>
          Fiche introuvable.
        </Alert>
      </MainLayout>
    )
  }

  const isSubmitted = row.formStatus === 'Soumise' && !row.reopened
  const isLocked = Boolean(row.locked)
  const canEditForm = !isDdrh && !isSubmitted && !isLocked
  const statusLabel = getStatusLabel(row)

  const persistRows = (nextRows) => {
    setTrackingRows(nextRows)
    saveTrackingRows(nextRows)
  }

  const persistFormState = (nextForm) => {
    const nextForms = {
      ...formStates,
      [trackingId]: nextForm,
    }
    setFormStates(nextForms)
    saveFormStates(nextForms)
  }

  const updateTrackingRow = (updater) => {
    const nextRows = trackingRows.map((item) =>
      item.id === trackingId ? updater(item) : item
    )
    persistRows(nextRows)
  }

  const handleRequestChange = (requestIndex, field, value) => {
    const nextForm = {
      ...form,
      trainingRequests: form.trainingRequests.map((request, index) =>
        index === requestIndex ? { ...request, [field]: value } : request
      ),
    }
    setForm(nextForm)
    persistFormState(nextForm)
  }

  const handleAddTrainingRequest = () => {
    const nextForm = {
      ...form,
      trainingRequests: [...form.trainingRequests, createDefaultTrainingRequest()],
    }
    setForm(nextForm)
    persistFormState(nextForm)
  }

  const handleRemoveTrainingRequest = (requestIndex) => {
    const nextForm = {
      ...form,
      trainingRequests: form.trainingRequests.filter((_, index) => index !== requestIndex),
    }
    setForm(nextForm)
    persistFormState(nextForm)
  }

  const handleSaveDraft = () => {
    persistFormState(form)
    updateTrackingRow((item) => ({
      ...item,
      status: 'En cours',
      formStatus: 'Brouillon',
      notificationStatus: 'Notifie',
    }))
    setFeedback('Le brouillon a été enregistré. Vous pouvez le modifier avant soumission.')
    setError('')
  }

  const handleSubmit = () => {
    if (!Array.isArray(form.trainingRequests) || form.trainingRequests.length === 0) {
      setError('La soumission est bloquée : ajoutez au moins une formation.')
      setFeedback('')
      return
    }

    const hasInvalidTrainingRequest = form.trainingRequests.some(
      (request) =>
        request.employeeIds.length === 0 ||
        !String(request.intituleFormation || '').trim() ||
        !String(request.objectif || '').trim()
    )

    if (hasInvalidTrainingRequest) {
      setError(
        'La soumission est bloquée : chaque formation doit avoir un intitulé, un objectif et au moins un employé.'
      )
      setFeedback('')
      return
    }

    persistFormState(form)
    updateTrackingRow((item) => ({
      ...item,
      status: 'Completee',
      formStatus: 'Soumise',
      reopened: false,
      notificationStatus: 'Notifie',
    }))
    setFeedback('La fiche a été soumise avec succès.')
    setError('')
  }

  const updateDdrhDecision = (updater, successMessage) => {
    updateTrackingRow(updater)
    setFeedback(successMessage)
    setError('')
  }

  const handleSaveDdrhComment = () => {
    updateDdrhDecision(
      (item) => ({
        ...item,
        ddrhComment: ddrhComment.trim(),
      }),
      'Le commentaire DDRH a été enregistré.'
    )
  }

  const handleValidateByDdrh = () => {
    updateDdrhDecision(
      (item) => ({
        ...item,
        ddrhDecision: 'Validee',
        reopened: false,
        locked: false,
        status: 'Completee',
        ddrhComment: ddrhComment.trim(),
      }),
      'La fiche a été validée.'
    )
  }

  const handleRejectByDdrh = () => {
    updateDdrhDecision(
      (item) => ({
        ...item,
        ddrhDecision: 'Rejetee',
        reopened: false,
        locked: false,
        ddrhComment: ddrhComment.trim(),
      }),
      'La fiche a été rejetée.'
    )
  }

  const handleLockByDdrh = () => {
    updateDdrhDecision(
      (item) => ({
        ...item,
        locked: true,
        reopened: false,
        ddrhComment: ddrhComment.trim(),
      }),
      'La fiche a été verrouillée.'
    )
  }

  const handleReopenByDdrh = () => {
    updateDdrhDecision(
      (item) => ({
        ...item,
        reopened: true,
        locked: false,
        ddrhDecision: '',
        formStatus: 'Brouillon',
        status: 'En cours',
        ddrhComment: ddrhComment.trim(),
      }),
      'La fiche a été réouverte pour correction.'
    )
  }

  return (
    <MainLayout>
      <Box sx={{ display: 'grid', gap: 3 }}>
        <Paper
          elevation={0}
          sx={{
            ...sectionPaperSx,
            background:
              'linear-gradient(180deg, rgba(248,251,255,0.98) 0%, rgba(255,255,255,1) 100%)',
          }}
        >
          <Stack spacing={1.25}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              spacing={1.5}
              alignItems={{ xs: 'flex-start', md: 'center' }}
            >
              <Box>
                <Typography sx={{ fontSize: '1.65rem', fontWeight: 800, color: '#1b2740' }}>
                  {isDdrh ? 'Consultation de la fiche' : 'Remplissage de la fiche'}
                </Typography>
                <Typography sx={{ mt: 0.45, fontSize: '0.93rem', color: '#72809a' }}>
                  {row.manager} • {row.structure}
                </Typography>
                <Typography sx={{ mt: 0.25, fontSize: '0.87rem', color: '#8b97ab' }}>
                  {template.name}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} alignItems="center">
                {isDdrh ? (
                  <Chip
                    label="Lecture DDRH"
                    size="small"
                    sx={{ bgcolor: '#eef4ff', color: '#3156d3', fontWeight: 700 }}
                  />
                ) : null}
                <Chip label={statusLabel} size="small" sx={getStatusChipSx(statusLabel)} />
              </Stack>
            </Stack>

            <Typography sx={{ color: '#5f6f86', fontSize: '0.92rem', maxWidth: 860 }}>
              Une fiche peut contenir plusieurs formations, et chaque formation peut concerner un
              ou plusieurs employés.
            </Typography>
          </Stack>
        </Paper>

        {isLocked ? (
          <Alert severity="warning" icon={<LockRoundedIcon fontSize="inherit" />} sx={{ borderRadius: '14px' }}>
            Cette fiche a été verrouillée par la DDRH. Elle n’est plus modifiable.
          </Alert>
        ) : null}

        {isSubmitted ? (
          <Alert severity="info" icon={<InfoOutlinedIcon fontSize="inherit" />} sx={{ borderRadius: '14px' }}>
            Cette fiche a déjà été soumise. Elle reste en lecture seule tant qu’elle n’est pas
            réouverte par la DDRH.
          </Alert>
        ) : null}

        {error ? (
          <Alert severity="error" sx={{ borderRadius: '14px' }}>
            {error}
          </Alert>
        ) : null}

        {feedback ? (
          <Alert severity="success" icon={<CheckCircleRoundedIcon fontSize="inherit" />} sx={{ borderRadius: '14px' }}>
            {feedback}
          </Alert>
        ) : null}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', xl: isDdrh ? '1.35fr 0.95fr' : '1fr' },
            gap: 2,
          }}
        >
          <Paper elevation={0} sx={sectionPaperSx}>
            <Stack spacing={2.2}>
              <Typography sx={{ fontWeight: 800, color: '#1b2740', fontSize: '1rem' }}>
                Besoins en formation
              </Typography>

              <Alert severity="info" sx={{ borderRadius: '14px' }}>
                Le directeur de structure est déjà connu via son authentification. La fiche reste
                modifiable uniquement selon son statut.
              </Alert>

              {form.trainingRequests.map((request, requestIndex) => {
                const selectedEmployees = employeesDirectory.filter((employee) =>
                  request.employeeIds.includes(String(employee.idEmploye))
                )

                return (
                  <Paper
                    key={`training-request-${requestIndex}`}
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: '18px',
                      border: '1px solid #e5ebf3',
                      background: '#fbfcff',
                    }}
                  >
                    <Stack spacing={2}>
                      <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={1.2}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', md: 'center' }}
                      >
                        <Box>
                          <Typography sx={{ fontWeight: 800, color: '#1b2740', fontSize: '0.98rem' }}>
                            Formation {requestIndex + 1}
                          </Typography>
                          <Typography sx={{ mt: 0.35, fontSize: '0.86rem', color: '#72809a' }}>
                            Sélectionnez les employés concernés puis décrivez le besoin de formation.
                          </Typography>
                        </Box>

                        {form.trainingRequests.length > 1 ? (
                          <Button
                            variant="text"
                            color="error"
                            startIcon={<RemoveCircleOutlineRoundedIcon />}
                            onClick={() => handleRemoveTrainingRequest(requestIndex)}
                            disabled={!canEditForm}
                            sx={{ textTransform: 'none', fontWeight: 700 }}
                          >
                            Retirer
                          </Button>
                        ) : null}
                      </Stack>

                      <FormSection title="Employés concernés">
                        <Autocomplete
                          multiple
                          options={employeesDirectory}
                          value={selectedEmployees}
                          onChange={(_, value) =>
                            handleRequestChange(
                              requestIndex,
                              'employeeIds',
                              value.map((employee) => String(employee.idEmploye))
                            )
                          }
                          getOptionLabel={(option) => `${option.prenom} ${option.nom} - ${option.poste}`}
                          isOptionEqualToValue={(option, value) => option.idEmploye === value.idEmploye}
                          limitTags={2}
                          disabled={!canEditForm}
                          sx={modernSelectSx}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Sélectionner un ou plusieurs employés *"
                              helperText="Vous pouvez associer plusieurs employés à la même formation."
                            />
                          )}
                        />
                      </FormSection>

                      <Divider flexItem />

                      <FormSection title="Formation">
                        <Stack spacing={1.4}>
                          <TextField
                            label="Intitulé de la formation *"
                            value={request.intituleFormation}
                            onChange={(event) =>
                              handleRequestChange(requestIndex, 'intituleFormation', event.target.value)
                            }
                            disabled={!canEditForm}
                            fullWidth
                          />
                          <TextField
                            label="Contexte de la formation"
                            value={request.contexteFormation}
                            onChange={(event) =>
                              handleRequestChange(requestIndex, 'contexteFormation', event.target.value)
                            }
                            disabled={!canEditForm}
                            fullWidth
                            multiline
                            minRows={3}
                          />
                        </Stack>
                      </FormSection>

                      <FormSection title="Objectifs">
                        <FormGrid>
                          <TextField
                            label="Objectif *"
                            value={request.objectif}
                            onChange={(event) =>
                              handleRequestChange(requestIndex, 'objectif', event.target.value)
                            }
                            disabled={!canEditForm}
                            fullWidth
                            multiline
                            minRows={3}
                          />
                          <TextField
                            label="KPI"
                            value={request.kpi}
                            onChange={(event) =>
                              handleRequestChange(requestIndex, 'kpi', event.target.value)
                            }
                            disabled={!canEditForm}
                            fullWidth
                            multiline
                            minRows={3}
                          />
                          <TextField
                            label="Échéance"
                            type="date"
                            value={request.echeance}
                            onChange={(event) =>
                              handleRequestChange(requestIndex, 'echeance', event.target.value)
                            }
                            disabled={!canEditForm}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                          />
                        </FormGrid>
                      </FormSection>

                      <FormSection title="Écarts de compétence">
                        <FormGrid>
                          <TextField
                            label="Écart métier"
                            value={request.ecartMetier}
                            onChange={(event) =>
                              handleRequestChange(requestIndex, 'ecartMetier', event.target.value)
                            }
                            disabled={!canEditForm}
                            fullWidth
                            multiline
                            minRows={2}
                          />
                          <TextField
                            label="Écart outils"
                            value={request.ecartOutils}
                            onChange={(event) =>
                              handleRequestChange(requestIndex, 'ecartOutils', event.target.value)
                            }
                            disabled={!canEditForm}
                            fullWidth
                            multiline
                            minRows={2}
                          />
                          <TextField
                            label="Écart comportement"
                            value={request.ecartComportement}
                            onChange={(event) =>
                              handleRequestChange(requestIndex, 'ecartComportement', event.target.value)
                            }
                            disabled={!canEditForm}
                            fullWidth
                            multiline
                            minRows={2}
                          />
                          <TextField
                            label="Écart projet"
                            value={request.ecartProjet}
                            onChange={(event) =>
                              handleRequestChange(requestIndex, 'ecartProjet', event.target.value)
                            }
                            disabled={!canEditForm}
                            fullWidth
                            multiline
                            minRows={2}
                          />
                        </FormGrid>
                      </FormSection>
                    </Stack>
                  </Paper>
                )
              })}

              <Button
                variant="outlined"
                startIcon={<AddRoundedIcon />}
                onClick={handleAddTrainingRequest}
                disabled={!canEditForm}
                sx={{
                  alignSelf: 'flex-start',
                  borderRadius: '14px',
                  textTransform: 'none',
                  fontWeight: 700,
                }}
              >
                Ajouter une formation
              </Button>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
                <Button
                  variant="outlined"
                  onClick={handleSaveDraft}
                  disabled={!canEditForm}
                  sx={{ borderRadius: '14px', textTransform: 'none', fontWeight: 700 }}
                >
                  Enregistrer le brouillon
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={!canEditForm}
                  sx={{ borderRadius: '14px', textTransform: 'none', fontWeight: 800 }}
                >
                  Soumettre la fiche
                </Button>
                <Button
                  variant="text"
                  onClick={() => navigate(isDdrh ? '/fiches/gestion' : '/fiches/mes')}
                  sx={{ textTransform: 'none', fontWeight: 700 }}
                >
                  Retour
                </Button>
              </Stack>
            </Stack>
          </Paper>

          {isDdrh ? (
            <Paper elevation={0} sx={sectionPaperSx}>
              <Stack spacing={1.6}>
                <Box>
                  <Typography sx={{ fontWeight: 800, color: '#1b2740', fontSize: '1rem' }}>
                    Actions DDRH
                  </Typography>
                  <Typography sx={{ mt: 0.35, fontSize: '0.88rem', color: '#72809a' }}>
                    Après lecture de la fiche, vous pouvez valider, rejeter, verrouiller ou
                    réouvrir la demande.
                  </Typography>
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <Button
                    variant="contained"
                    startIcon={<TaskAltRoundedIcon />}
                    onClick={handleValidateByDdrh}
                    disabled={isLocked}
                    sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 800 }}
                  >
                    Valider
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleRejectByDdrh}
                    disabled={isLocked}
                    sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}
                  >
                    Rejeter
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<UndoRoundedIcon />}
                    onClick={handleReopenByDdrh}
                    disabled={isLocked || row.formStatus !== 'Soumise'}
                    sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}
                  >
                    Réouvrir
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<LockRoundedIcon />}
                    onClick={handleLockByDdrh}
                    sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}
                  >
                    Verrouiller
                  </Button>
                </Stack>

                <TextField
                  label="Commentaire DDRH"
                  value={ddrhComment}
                  onChange={(event) => setDdrhComment(event.target.value)}
                  multiline
                  minRows={5}
                  placeholder="Commentaire visible côté employeur."
                />

                <Button
                  variant="contained"
                  onClick={handleSaveDdrhComment}
                  sx={{
                    alignSelf: 'flex-start',
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 800,
                  }}
                >
                  Enregistrer le commentaire
                </Button>
              </Stack>
            </Paper>
          ) : null}
        </Box>
      </Box>
    </MainLayout>
  )
}

function FormSection({ title, children }) {
  return (
    <Stack spacing={1.4}>
      <Typography sx={{ fontWeight: 700, color: '#334155', fontSize: '0.95rem' }}>
        {title}
      </Typography>
      {children}
    </Stack>
  )
}

function FormGrid({ children }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
        gap: 1.4,
      }}
    >
      {children}
    </Box>
  )
}
