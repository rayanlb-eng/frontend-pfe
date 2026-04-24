import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded'
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MainLayout from '../../components/layout/mainLayout'
import {
  employeesDirectory,
  ficheTemplates,
  getStoredFormStates,
  getStoredTrackingRows,
  modernSelectSx,
  saveFormStates,
  saveTrackingRows,
  sectionPaperSx,
} from './fiches.data'

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
  if (!rawForm) {
    return createDefaultForm()
  }

  if (Array.isArray(rawForm.trainingRequests) && rawForm.trainingRequests.length > 0) {
    return {
      trainingRequests: rawForm.trainingRequests.map((request) => {
        const normalizedRequest = {
          ...createDefaultTrainingRequest(),
          ...request,
        }

        if (!Array.isArray(normalizedRequest.employeeIds)) {
          normalizedRequest.employeeIds = normalizedRequest.employeeId
            ? [String(normalizedRequest.employeeId)]
            : []
        } else {
          normalizedRequest.employeeIds = normalizedRequest.employeeIds.map((id) => String(id))
        }

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

export default function FicheFormPage() {
  const { trackingId } = useParams()
  const navigate = useNavigate()
  const trackingRows = getStoredTrackingRows()
  const allForms = getStoredFormStates()
  const row = trackingRows.find((item) => item.id === trackingId)

  const template = useMemo(
    () => ficheTemplates.find((item) => item.id === row?.templateId) || ficheTemplates[0],
    [row]
  )

  const [form, setForm] = useState(() => normalizeStoredForm(allForms[trackingId]))
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')

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

  // Conserve le brouillon multi-formations sous la meme cle de fiche.
  const persistFormState = (nextForm) => {
    saveFormStates({
      ...allForms,
      [trackingId]: nextForm,
    })
  }

  // Met a jour le suivi DDRH sans casser le workflow existant de brouillon/soumission.
  const updateTrackingRow = (updater) => {
    const nextRows = trackingRows.map((item) =>
      item.id === trackingId ? updater(item) : item
    )
    saveTrackingRows(nextRows)
  }

  // Met a jour un bloc de formation cible pour gerer plusieurs employes dans une seule fiche.
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

  // Ajoute une nouvelle demande de formation pour un autre employe ou un autre besoin.
  const handleAddTrainingRequest = () => {
    const nextForm = {
      ...form,
      trainingRequests: [...form.trainingRequests, createDefaultTrainingRequest()],
    }
    setForm(nextForm)
    persistFormState(nextForm)
  }

  // Supprime un bloc supplementaire en gardant au moins une demande dans la fiche.
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
    setFeedback('Le brouillon a ete enregistre. Vous pouvez le modifier avant soumission.')
    setError('')
  }

  // La soumission exige que chaque bloc ait un employe et les champs de pilotage de la formation.
  const handleSubmit = () => {
    const hasInvalidTrainingRequest = form.trainingRequests.some((request) => {
      const requiredValues = [
        request.intituleFormation,
        request.contexteFormation,
        request.objectif,
        request.kpi,
        request.echeance,
      ]

      return request.employeeIds.length === 0 || requiredValues.some((value) => !String(value).trim())
    })

    if (hasInvalidTrainingRequest) {
      setError(
        'Veuillez completer les champs obligatoires de chaque formation avant de soumettre la fiche.'
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
    setFeedback("La fiche a ete soumise avec succes. La DDRH la verra dans son tableau de suivi.")
    setError('')
  }

  return (
    <MainLayout>
      <Box sx={{ display: 'grid', gap: 3 }}>
        <Box>
          <Typography sx={{ fontSize: '1.6rem', fontWeight: 800, color: '#1b2740' }}>
            Remplissage de la fiche
          </Typography>
          <Typography sx={{ mt: 0.55, fontSize: '0.92rem', color: '#72809a', maxWidth: 760 }}>
            {row.manager} - {row.structure}
          </Typography>
          <Typography sx={{ mt: 0.4, fontSize: '0.88rem', color: '#8b97ab' }}>
            {template.name}
          </Typography>
        </Box>

        {isLocked ? (
          <Alert
            severity="warning"
            icon={<InfoOutlinedIcon fontSize="inherit" />}
            sx={{ borderRadius: '14px' }}
          >
            Cette fiche a ete verrouillee par la DDRH apres priorisation. Elle ne peut plus etre
            modifiee.
          </Alert>
        ) : null}

        {isSubmitted ? (
          <Alert
            severity="info"
            icon={<InfoOutlinedIcon fontSize="inherit" />}
            sx={{ borderRadius: '14px' }}
          >
            Cette fiche a deja ete soumise. Si une correction est necessaire, contactez la DDRH
            pour demander une reouverture.
          </Alert>
        ) : null}

        {error ? (
          <Alert severity="error" sx={{ borderRadius: '14px' }}>
            {error}
          </Alert>
        ) : null}

        {feedback ? (
          <Alert
            severity="success"
            icon={<CheckCircleRoundedIcon fontSize="inherit" />}
            sx={{ borderRadius: '14px' }}
          >
            {feedback}
          </Alert>
        ) : null}

        <Paper elevation={0} sx={sectionPaperSx}>
          <Stack spacing={2.2}>
            <Typography sx={{ fontWeight: 800, color: '#1b2740', fontSize: '1rem' }}>
              Besoins en formation
            </Typography>

            <Alert severity="info" sx={{ borderRadius: '14px' }}>
              Les informations du responsable ne sont plus affichees ici. Le directeur de structure
              est deja connu via son authentification.
            </Alert>

            {form.trainingRequests.map((request, requestIndex) => {
              const selectedEmployees = employeesDirectory.filter((employee) =>
                request.employeeIds.includes(String(employee.idEmploye))
              )

              return (
                <Stack
                  key={`training-request-${requestIndex}`}
                  spacing={2}
                  sx={{
                    p: 2,
                    borderRadius: '18px',
                    border: '1px solid #e5ebf3',
                    background: '#fbfcff',
                  }}
                >
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={1.2}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                  >
                    <Box>
                      <Typography
                        sx={{ fontWeight: 800, color: '#1b2740', fontSize: '0.98rem' }}
                      >
                        Formation {requestIndex + 1}
                      </Typography>
                      <Typography sx={{ mt: 0.35, fontSize: '0.86rem', color: '#72809a' }}>
                        Selectionnez l&apos;employe concerne puis decrivez le besoin de formation.
                      </Typography>
                    </Box>

                    {form.trainingRequests.length > 1 ? (
                      <Button
                        variant="text"
                        color="error"
                        startIcon={<RemoveCircleOutlineRoundedIcon />}
                        onClick={() => handleRemoveTrainingRequest(requestIndex)}
                        disabled={isSubmitted || isLocked}
                        sx={{ textTransform: 'none', fontWeight: 700 }}
                      >
                        Retirer
                      </Button>
                    ) : null}
                  </Stack>

                  <FormSection title="Employe concerne">
                    <Stack spacing={1.4}>
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
                        getOptionLabel={(option) =>
                          `${option.prenom} ${option.nom} - ${option.poste}`
                        }
                        isOptionEqualToValue={(option, value) =>
                          option.idEmploye === value.idEmploye
                        }
                        limitTags={2}
                        disabled={isSubmitted || isLocked}
                        sx={modernSelectSx}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Selectionner un ou plusieurs employes *"
                            helperText="Vous pouvez associer plusieurs employes a la meme formation."
                          />
                        )}
                      />
                    </Stack>
                  </FormSection>

                  <Divider flexItem />

                  <FormSection title="Formation">
                    <Stack spacing={1.4}>
                      <TextField
                        label="Intitule de la formation *"
                        value={request.intituleFormation}
                        onChange={(event) =>
                          handleRequestChange(requestIndex, 'intituleFormation', event.target.value)
                        }
                        disabled={isSubmitted || isLocked}
                        fullWidth
                      />
                      <TextField
                        label="Contexte de la formation *"
                        value={request.contexteFormation}
                        onChange={(event) =>
                          handleRequestChange(requestIndex, 'contexteFormation', event.target.value)
                        }
                        disabled={isSubmitted || isLocked}
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
                        disabled={isSubmitted || isLocked}
                        fullWidth
                        multiline
                        minRows={3}
                      />
                      <TextField
                        label="KPI *"
                        value={request.kpi}
                        onChange={(event) =>
                          handleRequestChange(requestIndex, 'kpi', event.target.value)
                        }
                        disabled={isSubmitted || isLocked}
                        fullWidth
                        multiline
                        minRows={3}
                      />
                      <TextField
                        label="Echeance *"
                        type="date"
                        value={request.echeance}
                        onChange={(event) =>
                          handleRequestChange(requestIndex, 'echeance', event.target.value)
                        }
                        disabled={isSubmitted || isLocked}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </FormGrid>
                  </FormSection>

                  <FormSection title="Ecarts de competence">
                    <FormGrid>
                      <TextField
                        label="Ecart metier"
                        value={request.ecartMetier}
                        onChange={(event) =>
                          handleRequestChange(requestIndex, 'ecartMetier', event.target.value)
                        }
                        disabled={isSubmitted || isLocked}
                        fullWidth
                        multiline
                        minRows={2}
                      />
                      <TextField
                        label="Ecart outils"
                        value={request.ecartOutils}
                        onChange={(event) =>
                          handleRequestChange(requestIndex, 'ecartOutils', event.target.value)
                        }
                        disabled={isSubmitted || isLocked}
                        fullWidth
                        multiline
                        minRows={2}
                      />
                      <TextField
                        label="Ecart comportement"
                        value={request.ecartComportement}
                        onChange={(event) =>
                          handleRequestChange(requestIndex, 'ecartComportement', event.target.value)
                        }
                        disabled={isSubmitted || isLocked}
                        fullWidth
                        multiline
                        minRows={2}
                      />
                      <TextField
                        label="Ecart projet"
                        value={request.ecartProjet}
                        onChange={(event) =>
                          handleRequestChange(requestIndex, 'ecartProjet', event.target.value)
                        }
                        disabled={isSubmitted || isLocked}
                        fullWidth
                        multiline
                        minRows={2}
                      />
                    </FormGrid>
                  </FormSection>
                </Stack>
              )
            })}

            <Button
              variant="outlined"
              startIcon={<AddRoundedIcon />}
              onClick={handleAddTrainingRequest}
              disabled={isSubmitted || isLocked}
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
                disabled={isSubmitted || isLocked}
                sx={{ borderRadius: '14px', textTransform: 'none', fontWeight: 700 }}
              >
                Enregistrer le brouillon
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={isSubmitted || isLocked}
                sx={{ borderRadius: '14px', textTransform: 'none', fontWeight: 800 }}
              >
                Soumettre la fiche
              </Button>
              <Button
                variant="text"
                onClick={() => navigate('/fiches')}
                sx={{ textTransform: 'none', fontWeight: 700 }}
              >
                Retour
              </Button>
            </Stack>
          </Stack>
        </Paper>
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
