import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { modernSelectSx, sectionPaperSx } from '../data/style'

export default function FicheSendForm({
  templates,
  recipients,
  selectedTemplateId,
  selectedRecipientIds,
  onTemplateChange,
  onRecipientsChange,
  onSubmit,
  onMassFailure,
  feedback,
  massFailureAlert,
}) {
  const handleSelectAll = () => {
    onRecipientsChange(recipients.map((recipient) => recipient.id))
  }

  const handleClearSelection = () => {
    onRecipientsChange([])
  }

  const selectedTemplate =
    templates.find((template) => template.id === selectedTemplateId) || null
  const selectedRecipients = recipients.filter((recipient) =>
    selectedRecipientIds.includes(recipient.id)
  )

  return (
    <Paper elevation={0} sx={sectionPaperSx}>
      <Stack spacing={2}>
        <Box>
          <Typography sx={{ fontWeight: 800, color: '#1b2740', fontSize: '1rem' }}>
            Envoi des fiches
          </Typography>
          <Typography sx={{ mt: 0.35, fontSize: '0.88rem', color: '#72809a' }}>
            Sélectionnez une fiche standardisée puis choisissez un ou plusieurs directeurs
            de structure.
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

        <Box
          sx={{
            p: 1.5,
            borderRadius: '18px',
            background: 'linear-gradient(180deg, #f8fbff 0%, #f2f7fb 100%)',
            border: '1px solid #e5edf6',
          }}
        >
          <Stack spacing={1.3}>
            <Typography sx={{ fontWeight: 800, color: '#1b2740', fontSize: '0.92rem' }}>
              Paramètres de diffusion
            </Typography>

            <Autocomplete
              options={templates}
              value={selectedTemplate}
              onChange={(_, value) => onTemplateChange(value ? value.id : '')}
              getOptionLabel={(option) => `${option.name} - v${option.version}`}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              sx={modernSelectSx}
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="Fiche standardisée" />
              )}
            />

            <Autocomplete
              fullWidth
              multiple
              options={recipients}
              value={selectedRecipients}
              onChange={(_, value) => onRecipientsChange(value.map((recipient) => recipient.id))}
              getOptionLabel={(option) => `${option.structure} - ${option.manager}`}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              limitTags={2}
              sx={modernSelectSx}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Directeurs de structure"
                  helperText="Sélection multiple autorisée"
                />
              )}
            />
          </Stack>
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={0.8}>
          <Button
            variant="text"
            onClick={handleSelectAll}
            sx={{ textTransform: 'none', fontWeight: 700, alignSelf: 'flex-start' }}
          >
            Tout sélectionner
          </Button>
          <Button
            variant="text"
            onClick={handleClearSelection}
            disabled={selectedRecipientIds.length === 0}
            sx={{ textTransform: 'none', fontWeight: 700, alignSelf: 'flex-start' }}
          >
            Vider la sélection
          </Button>
        </Stack>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {selectedRecipientIds.map((recipientId) => {
            const recipient = recipients.find((item) => item.id === recipientId)
            return recipient ? (
              <Chip
                key={recipient.id}
                label={`${recipient.structure} - ${recipient.manager}`}
                sx={{
                  bgcolor: '#eaf6ef',
                  color: '#167a49',
                  fontWeight: 700,
                  borderRadius: '10px',
                  border: '1px solid #cfead7',
                }}
              />
            ) : null
          })}
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
          <Button
            variant="contained"
            onClick={onSubmit}
            disabled={!selectedTemplateId || selectedRecipientIds.length === 0}
            sx={{
              width: { xs: '100%', sm: '60%' },
              borderRadius: '14px',
              textTransform: 'none',
              fontWeight: 800,
            }}
          >
            Envoyer les fiches
          </Button>

          <Button
            variant="outlined"
            onClick={onMassFailure}
            disabled={!selectedTemplateId || selectedRecipientIds.length === 0}
            sx={{ borderRadius: '14px', textTransform: 'none', fontWeight: 700 }}
          >
            Simuler une panne d&apos;envoi
          </Button>
        </Stack>
      </Stack>
    </Paper>
  )
}
