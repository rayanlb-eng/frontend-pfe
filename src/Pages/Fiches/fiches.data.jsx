import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded'
import DraftsRoundedIcon from '@mui/icons-material/DraftsRounded'
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
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
import MenuItem from '@mui/material/MenuItem'

export const TRACKING_ROWS_STORAGE_KEY = 'fichesTrackingRows'
export const FICHE_FORMS_STORAGE_KEY = 'fichesFormStates'
export const FICHE_NOTIFICATIONS_STORAGE_KEY = 'fichesNotifications'

export const ficheTemplates = [
  {
    id: 'fiche-besoins-standard',
    name: "Fiche d'expression des besoins en formation",
    version: '2026',
    description: 'Modele standardise utilise par la DDRH pour le recensement des besoins.',
    sections: [
      {
        title: 'Selection des employes',
        fields: ['Employe concerne', 'Direction', 'Division', 'Poste', 'Competences'],
      },
      {
        title: 'Formation',
        fields: ['Intitule de la formation', 'Contexte de la formation'],
      },
      {
        title: 'Objectifs',
        fields: ['Objectif', 'KPI / Indicateurs de performance', 'Echeance'],
      },
      {
        title: 'Ecarts de competence',
        fields: ['Ecart metier', 'Ecart outils', 'Ecart comportement', 'Ecart projet'],
      },
      {
        title: 'Validation',
        fields: ['Echeance', 'Date de signature', 'Signature du responsable'],
      },
    ],
  },
]

export const employeesDirectory = [
  {
    idEmploye: 1001,
    nom: 'Sahnoune',
    prenom: 'Riad',
    direction: 'Direction Ouest',
    division: 'Distribution regionale',
    poste: 'Chef de secteur',
    dateEmbauche: '2018-09-12',
    email: 'r.sahnoune@mobilis.dz',
    telephone: '0550 11 22 33',
    competences: 'Pilotage terrain, reporting commercial, coordination equipe',
    formationsSuivies: 'Management de proximite, Excel avance',
  },
  {
    idEmploye: 1002,
    nom: 'Belaid',
    prenom: 'Sofiane',
    direction: 'Audit interne',
    division: 'Controle numerique',
    poste: 'Auditeur',
    dateEmbauche: '2020-03-08',
    email: 's.belaid@mobilis.dz',
    telephone: '0550 14 45 67',
    competences: 'Audit SI, conformite, analyse des risques',
    formationsSuivies: 'ISO 27001, Audit interne',
  },
  {
    idEmploye: 1003,
    nom: 'Benmansour',
    prenom: 'Nesrine',
    direction: 'Direction SI',
    division: 'Support applicatif',
    poste: 'Ingenieure support',
    dateEmbauche: '2021-01-17',
    email: 'n.benmansour@mobilis.dz',
    telephone: '0550 24 78 10',
    competences: 'Support applicatif, diagnostic incident, relation utilisateur',
    formationsSuivies: 'ITIL Foundation',
  },
  {
    idEmploye: 1004,
    nom: 'Kaci',
    prenom: 'Amel',
    direction: 'Direction Finance',
    division: 'Controle budgetaire',
    poste: 'Chargee budget',
    dateEmbauche: '2019-06-24',
    email: 'a.kaci@mobilis.dz',
    telephone: '0550 31 21 90',
    competences: 'Suivi budget, tableaux de bord, analyse ecarts',
    formationsSuivies: 'Power BI, Controle de gestion',
  },
  {
    idEmploye: 1005,
    nom: 'Messaoud',
    prenom: 'Yacine',
    direction: 'Direction Commerciale',
    division: 'Grand comptes',
    poste: 'Charge clientele entreprise',
    dateEmbauche: '2017-11-05',
    email: 'y.messaoud@mobilis.dz',
    telephone: '0550 44 18 52',
    competences: 'Negociation, relation client, suivi portefeuille',
    formationsSuivies: 'Communication efficace, Techniques de vente',
  },
  {
    idEmploye: 1006,
    nom: 'Hamdi',
    prenom: 'Lina',
    direction: 'Direction RH',
    division: 'Developpement RH',
    poste: 'Chargee formation',
    dateEmbauche: '2022-02-14',
    email: 'l.hamdi@mobilis.dz',
    telephone: '0550 09 65 43',
    competences: 'Ingenierie de formation, suivi RH, analyse besoins',
    formationsSuivies: 'Gestion de projet, Conduite du changement',
  },
]

export const structureRecipients = [
  { id: 'ddrh-est', structure: 'Direction Est', manager: 'Nadia Ferhat', email: 'n.ferhat@mobilis.dz' },
  { id: 'ddrh-ouest', structure: 'Direction Ouest', manager: 'Karim Ziani', email: 'k.ziani@mobilis.dz' },
  { id: 'audit-interne', structure: 'Audit interne', manager: 'Samir Touati', email: 's.touati@mobilis.dz' },
  { id: 'formation-centre', structure: 'Centre Formation', manager: 'Mourad Boussouf', email: 'm.boussouf@mobilis.dz' },
  { id: 'direction-commerciale', structure: 'Direction Commerciale', manager: 'Imane Rahal', email: 'i.rahal@mobilis.dz' },
  { id: 'direction-si', structure: 'Direction SI', manager: 'Yasmine Benaissa', email: 'y.benaissa@mobilis.dz' },
  { id: 'direction-finance', structure: 'Direction Finance', manager: 'Amine Kaci', email: 'a.kaci@mobilis.dz' },
  { id: 'direction-rh', structure: 'Direction RH', manager: 'Lina Hadef', email: 'l.hadef@mobilis.dz' },
]

export const trackingStats = [
  {
    title: 'Fiches envoyees',
    value: '18',
    subtitle: 'Campagne en cours',
    background: 'linear-gradient(135deg, #0ea55b 0%, #34d399 100%)',
    Icon: SendRoundedIcon,
  },
  {
    title: 'Notifications lues',
    value: '14',
    subtitle: 'Responsables informes',
    background: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)',
    Icon: DraftsRoundedIcon,
  },
  {
    title: 'Fiches en cours',
    value: '7',
    subtitle: 'Remplissage engage',
    background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
    Icon: FactCheckRoundedIcon,
  },
  {
    title: 'Fiches completees',
    value: '8',
    subtitle: 'Pretes pour validation',
    background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
    Icon: AssignmentTurnedInRoundedIcon,
  },
]

export const initialTrackingRows = [
  { id: 'trk-001', templateId: 'fiche-besoins-standard', templateName: "Fiche d'expression des besoins en formation", recipientId: 'ddrh-est', structure: 'Direction Est', manager: 'Nadia Ferhat', sentAt: '18/04/2026', status: 'Envoyee', notificationStatus: 'Non notifie', formStatus: 'Non ouverte', reopened: false },
  { id: 'trk-002', templateId: 'fiche-besoins-standard', templateName: "Fiche d'expression des besoins en formation", recipientId: 'ddrh-ouest', structure: 'Direction Ouest', manager: 'Karim Ziani', sentAt: '18/04/2026', status: 'Consultee', notificationStatus: 'Notifie', formStatus: 'Brouillon', reopened: false },
  { id: 'trk-003', templateId: 'fiche-besoins-standard', templateName: "Fiche d'expression des besoins en formation", recipientId: 'audit-interne', structure: 'Audit interne', manager: 'Samir Touati', sentAt: '17/04/2026', status: 'En cours', notificationStatus: 'Notifie', formStatus: 'Soumise', reopened: false },
  { id: 'trk-004', templateId: 'fiche-besoins-standard', templateName: "Fiche d'expression des besoins en formation", recipientId: 'formation-centre', structure: 'Centre Formation', manager: 'Mourad Boussouf', sentAt: '17/04/2026', status: 'Completee', notificationStatus: 'Notifie', formStatus: 'Soumise', reopened: false },
  { id: 'trk-005', templateId: 'fiche-besoins-standard', templateName: "Fiche d'expression des besoins en formation", recipientId: 'direction-commerciale', structure: 'Direction Commerciale', manager: 'Imane Rahal', sentAt: '16/04/2026', status: 'Completee', notificationStatus: 'Notifie', formStatus: 'Soumise', reopened: false },
  { id: 'trk-006', templateId: 'fiche-besoins-standard', templateName: "Fiche d'expression des besoins en formation", recipientId: 'direction-si', structure: 'Direction SI', manager: 'Yasmine Benaissa', sentAt: '16/04/2026', status: 'Completee', notificationStatus: 'Notifie', formStatus: 'Soumise', reopened: false },
  { id: 'trk-007', templateId: 'fiche-besoins-standard', templateName: "Fiche d'expression des besoins en formation", recipientId: 'direction-finance', structure: 'Direction Finance', manager: 'Amine Kaci', sentAt: '15/04/2026', status: 'Consultee', notificationStatus: 'Notifie', formStatus: 'Brouillon', reopened: false },
  { id: 'trk-008', templateId: 'fiche-besoins-standard', templateName: "Fiche d'expression des besoins en formation", recipientId: 'direction-rh', structure: 'Direction RH', manager: 'Lina Hadef', sentAt: '15/04/2026', status: 'En cours', notificationStatus: 'Notifie', formStatus: 'Brouillon', reopened: true },
  { id: 'trk-009', templateId: 'fiche-besoins-standard', templateName: "Fiche d'expression des besoins en formation", recipientId: 'ddrh-est', structure: 'Direction Est', manager: 'Nadia Ferhat', sentAt: '14/04/2026', status: 'Completee', notificationStatus: 'Notifie', formStatus: 'Soumise', reopened: false },
  { id: 'trk-010', templateId: 'fiche-besoins-standard', templateName: "Fiche d'expression des besoins en formation", recipientId: 'ddrh-ouest', structure: 'Direction Ouest', manager: 'Karim Ziani', sentAt: '14/04/2026', status: 'Completee', notificationStatus: 'Notifie', formStatus: 'Soumise', reopened: false },
  { id: 'trk-011', templateId: 'fiche-besoins-standard', templateName: "Fiche d'expression des besoins en formation", recipientId: 'audit-interne', structure: 'Audit interne', manager: 'Samir Touati', sentAt: '13/04/2026', status: 'Envoyee', notificationStatus: 'Replanifie', formStatus: 'Non ouverte', reopened: false },
  { id: 'trk-012', templateId: 'fiche-besoins-standard', templateName: "Fiche d'expression des besoins en formation", recipientId: 'direction-commerciale', structure: 'Direction Commerciale', manager: 'Imane Rahal', sentAt: '13/04/2026', status: 'Completee', notificationStatus: 'Notifie', formStatus: 'Soumise', reopened: false },
]

export const initialFormStates = {
  'trk-002': {
    responsableNom: 'Ziani', responsablePrenom: 'Karim', responsableFonction: 'Responsable formation', responsableDirection: 'Direction Ouest',
    employeMatricule: 'M-2451', employeNom: 'Sahnoune', employePrenom: 'Riad', employeFonction: 'Chef de secteur', employeDirection: 'Direction Ouest',
    intituleFormation: 'Leadership', contexteFormation: "Montee en responsabilite de plusieurs chefs d'equipe terrain.", objectif: 'Renforcer le pilotage des equipes et la prise de decision.',
    kpi: 'Amelioration du taux de pilotage des activites regionales.', echeance: '2026-06-15', ecartMetier: 'Pilotage des equipes distribuees.', ecartOutils: 'Suivi des reportings regionaux.',
    ecartComportement: 'Communication manageriale.', ecartProjet: '', dateSignature: '2026-04-18', signatureResponsable: 'Karim Ziani',
  },
  'trk-003': {
    responsableNom: 'Touati', responsablePrenom: 'Samir', responsableFonction: 'Responsable audit', responsableDirection: 'Audit interne',
    employeMatricule: 'A-1184', employeNom: 'Belaid', employePrenom: 'Sofiane', employeFonction: 'Auditeur', employeDirection: 'Audit interne',
    intituleFormation: 'Cybersecurite', contexteFormation: 'Renforcement des controles numeriques et des audits sur les acces sensibles.', objective: 'Mieux identifier les risques cyber et les incidents critiques.',
    objectif: 'Mieux identifier les risques cyber et les incidents critiques.', kpi: 'Reduction des ecarts de conformite de securite.', echeance: '2026-05-20', ecartMetier: 'Analyse des vulnerabilites.', ecartOutils: 'Utilisation des tableaux de supervision.',
    ecartComportement: 'Culture du signalement.', ecartProjet: 'Projet de controle interne 2026.', dateSignature: '2026-04-17', signatureResponsable: 'Samir Touati',
  },
}

export function getStoredTrackingRows() {
  const raw = localStorage.getItem(TRACKING_ROWS_STORAGE_KEY)
  if (!raw) return initialTrackingRows
  const storedRows = JSON.parse(raw)
  const storedIds = new Set(storedRows.map((row) => row.id))
  const missingSeedRows = initialTrackingRows.filter((row) => !storedIds.has(row.id))
  return [...storedRows, ...missingSeedRows]
}

export function saveTrackingRows(rows) {
  localStorage.setItem(TRACKING_ROWS_STORAGE_KEY, JSON.stringify(rows))
}

export function getStoredFormStates() {
  const raw = localStorage.getItem(FICHE_FORMS_STORAGE_KEY)
  if (!raw) return initialFormStates
  const storedForms = JSON.parse(raw)
  return { ...initialFormStates, ...storedForms }
}

export function saveFormStates(forms) {
  localStorage.setItem(FICHE_FORMS_STORAGE_KEY, JSON.stringify(forms))
}

export function getStoredNotifications() {
  const raw = localStorage.getItem(FICHE_NOTIFICATIONS_STORAGE_KEY)
  return raw ? JSON.parse(raw) : []
}

export function saveNotifications(notifications) {
  localStorage.setItem(FICHE_NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications))
}

export const sectionPaperSx = {
  p: { xs: 2.1, md: 2.5 },
  borderRadius: '22px',
  background:
    'linear-gradient(180deg, rgba(255,255,255,0.995) 0%, rgba(248,250,255,0.985) 100%)',
  border: '1px solid #e5ebf3',
  boxShadow: '0 16px 36px rgba(20, 31, 56, 0.08)',
  minWidth: 0,
  maxWidth: '100%',
}

export const modernSelectSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '14px',
    background: '#ffffff',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)',
    '& fieldset': {
      borderColor: '#d8e1ec',
    },
    '&:hover fieldset': {
      borderColor: '#8fb8a3',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1b8a52',
      borderWidth: '1px',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#1b8a52',
  },
}

export const topGridSx = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    xl: '1.05fr 0.95fr',
  },
  gap: 2,
  minWidth: 0,
  maxWidth: '100%',
}

export const trackingTableWrapSx = {
  borderRadius: '18px',
  overflowX: 'auto',
  overflowY: 'hidden',
  border: '1px solid #e7edf5',
  background: '#ffffff',
  maxWidth: '100%',
}

export const statusChipSx = (status) => {
  const map = {
    Envoyee: { bg: '#e8f7ee', color: '#168553' },
    Consultee: { bg: '#eaf2ff', color: '#2563eb' },
    'En cours': { bg: '#fff4df', color: '#c77817' },
    Completee: { bg: '#efe7ff', color: '#7c3aed' },
  }
  const style = map[status] || { bg: '#eef2f7', color: '#64748b' }
  return { bgcolor: style.bg, color: style.color, fontWeight: 700, borderRadius: '10px' }
}

export const notificationChipSx = (status) => {
  const map = {
    Notifie: { bg: '#e8f7ee', color: '#168553' },
    'Non notifie': { bg: '#ffe9ec', color: '#c24157' },
    Replanifie: { bg: '#fff4df', color: '#c77817' },
    'Relance planifiee': { bg: '#eaf2ff', color: '#2563eb' },
  }
  const style = map[status] || { bg: '#eef2f7', color: '#64748b' }
  return { bgcolor: style.bg, color: style.color, fontWeight: 700, borderRadius: '10px' }
}

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
            p: 2.1,
            minHeight: 132,
            borderRadius: '18px',
            position: 'relative',
            overflow: 'hidden',
            background,
            border: '1px solid rgba(255,255,255,0.16)',
            boxShadow: '0 18px 30px rgba(20, 31, 56, 0.12)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 24px 38px rgba(20, 31, 56, 0.16)',
            },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at top right, rgba(255,255,255,0.18), transparent 32%)',
              pointerEvents: 'none',
            }}
          />
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
  const handleSelectAll = () => {
    onRecipientsChange(recipients.map((recipient) => recipient.id))
  }

  const handleClearSelection = () => {
    onRecipientsChange([])
  }

  const selectedTemplate = templates.find((template) => template.id === selectedTemplateId) || null
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
            Selectionnez une fiche standardisee puis choisissez un ou plusieurs directeurs de structure.
          </Typography>
        </Box>

        {feedback ? <Alert severity="success" sx={{ borderRadius: '14px' }}>{feedback}</Alert> : null}
        {massFailureAlert ? <Alert severity="error" sx={{ borderRadius: '14px' }}>{massFailureAlert}</Alert> : null}

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
              Parametres de diffusion
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
                <TextField {...params} label="Fiche standardisee" />
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
                  helperText="Selection multiple autorisee"
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
            Tout selectionner
          </Button>
          <Button
            variant="text"
            onClick={handleClearSelection}
            disabled={selectedRecipientIds.length === 0}
            sx={{ textTransform: 'none', fontWeight: 700, alignSelf: 'flex-start' }}
          >
            Vider la selection
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
            sx={{ width: { xs: '100%', sm: '60%' }, borderRadius: '14px', textTransform: 'none', fontWeight: 800 }}
          >
            Envoyer les fiches
          </Button>

          <Button
            variant="outlined"
            onClick={onMassFailure}
            disabled={!selectedTemplateId || selectedRecipientIds.length === 0}
            sx={{ borderRadius: '14px', textTransform: 'none', fontWeight: 700 }}
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
            borderRadius: '18px',
            background:
              'linear-gradient(180deg, rgba(247,250,255,0.98) 0%, rgba(239,246,255,0.96) 100%)',
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
                        bgcolor: '#ffffff',
                        color: '#425066',
                        fontWeight: 700,
                        borderRadius: '10px',
                        border: '1px solid #dfe8f2',
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
  showOpenAction = true,
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
          <Table
            size="small"
            sx={{
              minWidth: 0,
              width: '100%',
              tableLayout: 'fixed',
            }}
          >
            <TableHead>
              <TableRow sx={{ bgcolor: '#f7fafc' }}>
                <TableCell sx={tableHeadCellSx}>Fiche</TableCell>
                <TableCell sx={tableHeadCellSx}>Structure</TableCell>
                <TableCell sx={tableHeadCellSx}>Responsable</TableCell>
                <TableCell sx={tableHeadCellSx}>Date d'envoi</TableCell>
                <TableCell sx={tableHeadCellSx}>Statut</TableCell>
                <TableCell sx={tableHeadCellSx}>Fiche</TableCell>
                <TableCell sx={tableHeadCellSx}>Notification</TableCell>
                <TableCell sx={tableHeadCellSx}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{
                    '&:nth-of-type(even)': {
                      background: '#fbfdff',
                    },
                    '&:hover': {
                      background: '#f3f8fd',
                    },
                  }}
                >
                  <TableCell sx={tableBodyCellSx}>
                    <Typography sx={{ fontWeight: 700, color: '#1f2b42', fontSize: '0.88rem' }}>
                      {row.templateName}
                    </Typography>
                  </TableCell>
                  <TableCell sx={tableBodyCellSx}>{row.structure}</TableCell>
                  <TableCell sx={tableBodyCellSx}>{row.manager}</TableCell>
                  <TableCell sx={tableBodyCellSx}>{row.sentAt}</TableCell>
                  <TableCell sx={tableBodyCellSx}>
                    <Chip label={row.status} size="small" sx={statusChipSx(row.status)} />
                  </TableCell>
                  <TableCell sx={tableBodyCellSx}>
                    <Chip
                      label={row.formStatus}
                      size="small"
                      sx={statusChipSx(
                        row.formStatus === 'Soumise'
                          ? 'Completee'
                          : row.formStatus === 'Brouillon'
                            ? 'En cours'
                            : 'Envoyee'
                      )}
                    />
                  </TableCell>
                  <TableCell sx={tableBodyCellSx}>
                    <Chip label={row.notificationStatus} size="small" sx={notificationChipSx(row.notificationStatus)} />
                  </TableCell>
                  <TableCell sx={tableBodyCellSx}>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {showOpenAction && onOpenForm ? (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => onOpenForm(row)}
                          sx={tableActionButtonSx}
                        >
                          Ouvrir
                        </Button>
                      ) : null}

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
                          sx={tableActionButtonSx}
                        >
                          Renvoyer
                        </Button>
                      ) : null}

                      {row.formStatus === 'Soumise' && onReopen ? (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => onReopen(row)}
                          sx={tableActionButtonSx}
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

const tableHeadCellSx = {
  fontWeight: 800,
  color: '#475569',
  fontSize: '0.78rem',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
}

const tableBodyCellSx = {
  color: '#334155',
  fontSize: '0.88rem',
  borderColor: '#eef3f8',
  wordBreak: 'break-word',
  overflowWrap: 'anywhere',
  verticalAlign: 'top',
}

const tableActionButtonSx = {
  textTransform: 'none',
  fontWeight: 700,
  borderRadius: '10px',
  borderColor: '#d7e2ee',
  color: '#41526b',
  background: '#ffffff',
  '&:hover': {
    borderColor: '#bfd0e1',
    background: '#ffffff',
  },
}
