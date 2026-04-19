import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Alert, Box, Button, Chip, Paper, Stack, TextField, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MainLayout from '../../components/layout/mainLayout'
import {
  ficheTemplates,
  getStoredFormStates,
  getStoredTrackingRows,
  saveFormStates,
  saveTrackingRows,
} from './fiches.data'
import { sectionPaperSx } from './fiches.styles'

function createDefaultForm() {
  return {
    responsableNom: '',
    responsablePrenom: '',
    responsableFonction: '',
    responsableDirection: '',
    employeMatricule: '',
    employeNom: '',
    employePrenom: '',
    employeFonction: '',
    employeDirection: '',
    intituleFormation: '',
    contexteFormation: '',
    objectif: '',
    kpi: '',
    echeance: '',
    ecartMetier: '',
    ecartOutils: '',
    ecartComportement: '',
    ecartProjet: '',
    dateSignature: '',
    signatureResponsable: '',
  }
}

const requiredFields = [
  'responsableNom',
  'responsablePrenom',
  'responsableFonction',
  'responsableDirection',
  'employeMatricule',
  'employeNom',
  'employePrenom',
  'employeFonction',
  'employeDirection',
  'intituleFormation',
  'contexteFormation',
  'objectif',
  'kpi',
  'echeance',
  'dateSignature',
  'signatureResponsable',
]

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

  const [form, setForm] = useState({
    ...createDefaultForm(),
    ...(allForms[trackingId] || {}),
  })
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

  const persistFormState = (nextForm) => {
    saveFormStates({
      ...allForms,
      [trackingId]: nextForm,
    })
  }

  const updateTrackingRow = (updater) => {
    const nextRows = trackingRows.map((item) =>
      item.id === trackingId ? updater(item) : item
    )
    saveTrackingRows(nextRows)
  }

  const handleChange = (field, value) => {
    const nextForm = { ...form, [field]: value }
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

  const handleSubmit = () => {
    const hasMissingRequiredFields = requiredFields.some((field) => !String(form[field]).trim())

    if (hasMissingRequiredFields) {
      setError('Veuillez completer les champs obligatoires avant de soumettre la fiche.')
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

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', xl: '1.05fr 0.95fr' },
            gap: 2,
          }}
        >
          <Paper elevation={0} sx={sectionPaperSx}>
            <Stack spacing={2.2}>
              <Typography sx={{ fontWeight: 800, color: '#1b2740', fontSize: '1rem' }}>
                Remplissage de la fiche
              </Typography>

              <FormSection title="Responsable">
                <FormGrid>
                  <TextField
                    label="Nom *"
                    value={form.responsableNom}
                    onChange={(event) => handleChange('responsableNom', event.target.value)}
                    disabled={isSubmitted || isLocked}
                    fullWidth
                  />
                  <TextField
                    label="Prenom *"
                    value={form.responsablePrenom}
                    onChange={(event) => handleChange('responsablePrenom', event.target.value)}
                    disabled={isSubmitted || isLocked}
                    fullWidth
                  />
                  <TextField
                    label="Fonction *"
                    value={form.responsableFonction}
                    onChange={(event) => handleChange('responsableFonction', event.target.value)}
                    disabled={isSubmitted || isLocked}
                    fullWidth
                  />
                  <TextField
                    label="Direction *"
                    value={form.responsableDirection}
                    onChange={(event) => handleChange('responsableDirection', event.target.value)}
                    disabled={isSubmitted || isLocked}
                    fullWidth
                  />
                </FormGrid>
              </FormSection>

              <FormSection title="Employe">
                <FormGrid>
                  <TextField
                    label="Matricule *"
                    value={form.employeMatricule}
                    onChange={(event) => handleChange('employeMatricule', event.target.value)}
                    disabled={isSubmitted || isLocked}
                    fullWidth
                  />
                  <TextField
                    label="Nom *"
                    value={form.employeNom}
                    onChange={(event) => handleChange('employeNom', event.target.value)}
                    disabled={isSubmitted || isLocked}
                    fullWidth
                  />
                  <TextField
                    label="Prenom *"
                    value={form.employePrenom}
                    onChange={(event) => handleChange('employePrenom', event.target.value)}
                    disabled={isSubmitted || isLocked}
                    fullWidth
                  />
                  <TextField
                    label="Fonction *"
                    value={form.employeFonction}
                    onChange={(event) => handleChange('employeFonction', event.target.value)}
                    disabled={isSubmitted || isLocked}
                    fullWidth
                  />
                  <TextField
                    label="Direction *"
                    value={form.employeDirection}
                    onChange={(event) => handleChange('employeDirection', event.target.value)}
                    disabled={isSubmitted || isLocked}
                    fullWidth
                  />
                </FormGrid>
              </FormSection>

              <FormSection title="Formation">
                <Stack spacing={1.4}>
                  <TextField
                    label="Intitule de la formation *"
                    value={form.intituleFormation}
                    onChange={(event) => handleChange('intituleFormation', event.target.value)}
                    disabled={isSubmitted || isLocked}
                    fullWidth
                  />
                  <TextField
                    label="Contexte de la formation *"
                    value={form.contexteFormation}
                    onChange={(event) => handleChange('contexteFormation', event.target.value)}
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
                    value={form.objectif}
                    onChange={(event) => handleChange('objectif', event.target.value)}
                    disabled={isSubmitted || isLocked}
                    fullWidth
                    multiline
                    minRows={3}
                  />
                  <TextField
                    label="KPI *"
                    value={form.kpi}
                    onChange={(event) => handleChange('kpi', event.target.value)}
                    disabled={isSubmitted || isLocked}
                    fullWidth
                    multiline
                    minRows={3}
                  />
                  <TextField
                    label="Echeance *"
                    type="date"
                    value={form.echeance}
                    onChange={(event) => handleChange('echeance', event.target.value)}
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
                    value={form.ecartMetier}
                    onChange={(event) => handleChange('ecartMetier', event.target.value)}
                    disabled={isSubmitted || isLocked}
                    fullWidth
                    multiline
                    minRows={2}
                  />
                  <TextField
                    label="Ecart outils"
                    value={form.ecartOutils}
                    onChange={(event) => handleChange('ecartOutils', event.target.value)}
                    disabled={isSubmitted || isLocked}
                    fullWidth
                    multiline
                    minRows={2}
                  />
                  <TextField
                    label="Ecart comportement"
                    value={form.ecartComportement}
                    onChange={(event) => handleChange('ecartComportement', event.target.value)}
                    disabled={isSubmitted || isLocked}
                    fullWidth
                    multiline
                    minRows={2}
                  />
                  <TextField
                    label="Ecart projet"
                    value={form.ecartProjet}
                    onChange={(event) => handleChange('ecartProjet', event.target.value)}
                    disabled={isSubmitted || isLocked}
                    fullWidth
                    multiline
                    minRows={2}
                  />
                </FormGrid>
              </FormSection>

              <FormSection title="Validation">
                <FormGrid>
                  <TextField
                    label="Date de signature *"
                    type="date"
                    value={form.dateSignature}
                    onChange={(event) => handleChange('dateSignature', event.target.value)}
                    disabled={isSubmitted}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Signature du responsable *"
                    value={form.signatureResponsable}
                    onChange={(event) => handleChange('signatureResponsable', event.target.value)}
                    disabled={isSubmitted}
                    fullWidth
                  />
                </FormGrid>
              </FormSection>

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

          <Paper elevation={0} sx={sectionPaperSx}>
            <Stack spacing={2}>
              <Typography sx={{ fontWeight: 800, color: '#1b2740', fontSize: '1rem' }}>
                Apercu de la fiche
              </Typography>

              <Typography sx={{ fontWeight: 700, color: '#334155' }}>{template.name}</Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                <Chip label={`Structure : ${row.structure}`} />
                <Chip label={`Responsable : ${row.manager}`} />
                <Chip label={`Etat : ${row.formStatus}`} />
              </Box>

              <Stack spacing={1.4}>
                {template.sections.map((section) => (
                  <Box key={section.title}>
                    <Typography sx={{ fontWeight: 800, color: '#334155', fontSize: '0.9rem' }}>
                      {section.title}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mt: 1 }}>
                      {section.fields.map((field) => (
                        <Chip
                          key={field}
                          label={field}
                          size="small"
                          sx={{
                            bgcolor: '#eef2f7',
                            color: '#475569',
                            fontWeight: 600,
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Stack>
          </Paper>
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
