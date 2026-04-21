import {
  Alert,
  Box,
  Button,
  Chip,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import {
  notificationChipSx,
  sectionPaperSx,
  statusChipSx,
  trackingTableWrapSx,
} from './fiches.styles'

export function FichesStatsGrid({ stats }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        gap: 1.6,
      }}
    >
      {stats.map(({ title, value, subtitle, background, Icon }) => (
        <Paper
          key={title}
          elevation={0}
          sx={{
            p: 2,
            minHeight: 124,
            borderRadius: '14px',
            position: 'relative',
            overflow: 'hidden',
            background,
            border: '1px solid rgba(255,255,255,0.16)',
            boxShadow: '0 10px 20px rgba(20, 31, 56, 0.10)',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: 12,
              color: 'rgba(255,255,255,0.20)',
              '& svg': { fontSize: 32 },
            }}
          >
            <Icon />
          </Box>
          <Typography sx={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.92)', fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: '2.1rem', fontWeight: 800, mt: 1.3, color: '#fff' }}>
            {value}
          </Typography>
          <Typography sx={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.95)', mt: 1, fontWeight: 700 }}>
            {subtitle}
          </Typography>
        </Paper>
      ))}
    </Box>
  )
}

export function FicheSendForm({
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
  return (
    <Paper elevation={0} sx={sectionPaperSx}>
      <Stack spacing={2}>
        <Box>
          <Typography sx={{ fontWeight: 800, color: '#1b2740', fontSize: '1rem' }}>
            Envoi des fiches
          </Typography>
          <Typography sx={{ mt: 0.35, fontSize: '0.88rem', color: '#72809a' }}>
            Selectionnez une fiche standardisee et les responsables des structures concernes.
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

        <TextField
          select
          fullWidth
          label="Fiche standardisee"
          value={selectedTemplateId}
          onChange={(event) => onTemplateChange(event.target.value)}
        >
          {templates.map((template) => (
            <MenuItem key={template.id} value={template.id}>
              {template.name} - v{template.version}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          SelectProps={{ multiple: true }}
          label="Responsables des structures"
          value={selectedRecipientIds}
          onChange={(event) => onRecipientsChange(event.target.value)}
          helperText="Selection multiple autorisee"
        >
          {recipients.map((recipient) => (
            <MenuItem key={recipient.id} value={recipient.id}>
              {recipient.structure} - {recipient.manager}
            </MenuItem>
          ))}
        </TextField>

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
            Valider l'envoi
          </Button>

          <Button
            variant="outlined"
            onClick={onMassFailure}
            disabled={!selectedTemplateId || selectedRecipientIds.length === 0}
            sx={{
              borderRadius: '14px',
              textTransform: 'none',
              fontWeight: 700,
            }}
          >
            Simuler une panne d'envoi
          </Button>
        </Stack>
      </Stack>
    </Paper>
  )
}

export function FichePreviewCard({ template }) {
  return (
    <Paper elevation={0} sx={sectionPaperSx}>
      <Stack spacing={2}>
        <Box>
          <Typography sx={{ fontWeight: 800, color: '#1b2740', fontSize: '1rem' }}>
            Apercu de la fiche
          </Typography>
          <Typography sx={{ mt: 0.35, fontSize: '0.88rem', color: '#72809a' }}>
            Structure de la fiche standard selectionnee.
          </Typography>
        </Box>

        <Box
          sx={{
            p: 2,
            borderRadius: '16px',
            background: '#fbfcff',
            border: '1px solid #e7edf5',
          }}
        >
          <Typography sx={{ fontWeight: 800, color: '#1b2740' }}>{template.name}</Typography>
          <Typography sx={{ mt: 0.35, fontSize: '0.86rem', color: '#72809a' }}>
            {template.description}
          </Typography>

          <Stack spacing={1.6} sx={{ mt: 2 }}>
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
        </Box>
      </Stack>
    </Paper>
  )
}



export function FichesTrackingTable({
  rows,
  onManualResend,
  onReopen,
  onOpenForm,
  canManageStatuses = false,
  onStatusChange,
}) {
  return (
    <Paper elevation={0} sx={sectionPaperSx}>
      <Stack spacing={1.6}>
        <Box>
          <Typography sx={{ fontWeight: 800, color: '#1b2740', fontSize: '1rem' }}>
            Tableau de suivi
          </Typography>
          <Typography sx={{ mt: 0.35, fontSize: '0.88rem', color: '#72809a' }}>
            Le systeme suit les fiches envoyees et leur etat de traitement.
          </Typography>
        </Box>

        <Box sx={trackingTableWrapSx}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell>Fiche</TableCell>
                <TableCell>Structure</TableCell>
                <TableCell>Responsable</TableCell>
                <TableCell>Date d'envoi</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Fiche</TableCell>
                <TableCell>Notification</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.templateName}</TableCell>
                  <TableCell>{row.structure}</TableCell>
                  <TableCell>{row.manager}</TableCell>
                  <TableCell>{row.sentAt}</TableCell>
                  <TableCell>
                    <Chip label={row.status} size="small" sx={statusChipSx(row.status)} />
                  </TableCell>
                  <TableCell>
                    <Chip label={row.formStatus} size="small" sx={statusChipSx(row.formStatus === 'Soumise' ? 'Completee' : row.formStatus === 'Brouillon' ? 'En cours' : 'Envoyee')} />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.notificationStatus}
                      size="small"
                      sx={notificationChipSx(row.notificationStatus)}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => onOpenForm(row)}
                        sx={{ textTransform: 'none', fontWeight: 700 }}
                      >
                        Ouvrir
                      </Button>

                      {canManageStatuses && onStatusChange ? (
                        <TextField
                          select
                          size="small"
                          value={row.status}
                          onChange={(event) => onStatusChange(row, event.target.value)}
                          sx={{ minWidth: 130 }}
                        >
                          <MenuItem value="Envoyee">Envoyee</MenuItem>
                          <MenuItem value="Consultee">Consultee</MenuItem>
                          <MenuItem value="En cours">En cours</MenuItem>
                          <MenuItem value="Completee">Completee</MenuItem>
                        </TextField>
                      ) : null}

                      {row.notificationStatus === 'Non notifie' && onManualResend ? (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => onManualResend(row)}
                          sx={{ textTransform: 'none', fontWeight: 700 }}
                        >
                          Renvoyer
                        </Button>
                      ) : null}

                      {row.formStatus === 'Soumise' && onReopen ? (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => onReopen(row)}
                          sx={{ textTransform: 'none', fontWeight: 700 }}
                        >
                          Reouvrir
                        </Button>
                      ) : null}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Stack>
    </Paper>
  )
}
