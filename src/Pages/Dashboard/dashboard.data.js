import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded'
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'

const defaultAccent = 'rgba(255,255,255,0.16)'

export const stats = [
  {
    title: 'Fiches totales',
    value: '128',
    subtitle: 'Campagne en cours',
    background: 'linear-gradient(135deg, #ef4444 0%, #fb7185 100%)',
    Icon: DescriptionRoundedIcon,
    borderColor: defaultAccent,
  },
  {
    title: 'Fiches en attente',
    value: '34',
    subtitle: 'A relancer cette semaine',
    background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
    Icon: TrendingUpRoundedIcon,
    borderColor: defaultAccent,
  },
  {
    title: 'Fiches validees',
    value: '72',
    subtitle: 'Pretes pour consolidation',
    background: 'linear-gradient(135deg, #0f9d58 0%, #34d399 100%)',
    Icon: AssessmentRoundedIcon,
    borderColor: defaultAccent,
  },
  {
    title: 'Utilisateurs',
    value: '850',
    subtitle: 'Employeurs et DDRH',
    background: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)',
    Icon: PeopleAltRoundedIcon,
    borderColor: defaultAccent,
  },
]

export const yearlyTrainingData = [
  { year: '2021', employees: 86 },
  { year: '2022', employees: 112 },
  { year: '2023', employees: 104 },
  { year: '2024', employees: 126 },
  { year: '2025', employees: 149 },
]

export const statusData = [
  { name: 'Validees', value: 72, color: '#0f9d58' },
  { name: 'En attente', value: 34, color: '#f59e0b' },
  { name: 'Rejetees', value: 12, color: '#ef4444' },
  { name: 'Brouillons', value: 10, color: '#2563eb' },
]

export const departmentTrainingData = [
  { department: 'Commercial', employees: 34 },
  { department: 'Technique', employees: 28 },
  { department: 'Finance', employees: 19 },
  { department: 'RH', employees: 16 },
  { department: 'SI', employees: 31 },
]

export const campaignSteps = [
  {
    title: 'Envoi des fiches',
    subtitle: 'Diffusion de la fiche standard aux structures',
    progress: 100,
    chip: 'Termine',
    color: '#0f9d58',
  },
  {
    title: 'Collecte des reponses',
    subtitle: 'Reception des fiches completees par les employeurs',
    progress: 68,
    chip: 'En cours',
    color: '#2563eb',
  },
  {
    title: 'Consolidation DDRH',
    subtitle: 'Analyse et priorisation des besoins remontes',
    progress: 42,
    chip: 'A suivre',
    color: '#7c3aed',
  },
]

export const alerts = [
  {
    title: "12 fiches n'ont pas encore ete consultees par les structures concernees",
    type: 'warning',
  },
  {
    title: '3 comptes sensibles necessitent une verification de securite',
    type: 'danger',
  },
  {
    title: 'Le reporting mensuel est disponible a lexport',
    type: 'success',
  },
]

export const recentFiches = [
  {
    structure: 'Direction Commerciale',
    domain: 'Leadership',
    submittedAt: '12 avr. 2026',
    status: 'Validee',
    color: '#0f9d58',
  },
  {
    structure: 'Direction Technique',
    domain: 'Cybersecurite',
    submittedAt: '11 avr. 2026',
    status: 'En attente',
    color: '#f59e0b',
  },
  {
    structure: 'Direction RH',
    domain: 'Communication',
    submittedAt: '09 avr. 2026',
    status: 'Brouillon',
    color: '#2563eb',
  },
  {
    structure: 'Direction SI',
    domain: 'Gestion de projet',
    submittedAt: '08 avr. 2026',
    status: 'Validee',
    color: '#0f9d58',
  },
]

export const quickActions = [
  {
    title: 'Nouvelle fiche',
    subtitle: 'Lancer une nouvelle campagne de collecte',
    background: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)',
    Icon: DescriptionRoundedIcon,
  },
  {
    title: 'Utilisateurs',
    subtitle: 'Verifier les roles et permissions',
    background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
    Icon: PeopleAltRoundedIcon,
  },
  {
    title: 'Securite',
    subtitle: 'Suivre les acces et le 2FA',
    background: 'linear-gradient(135deg, #eab308 0%, #facc15 100%)',
    Icon: ShieldRoundedIcon,
  },
  {
    title: 'Reporting',
    subtitle: 'Consulter les exports et indicateurs',
    background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
    Icon: AssessmentRoundedIcon,
  },
]

export const exportActions = [
  {
    label: 'Export Excel',
    variant: 'light',
    Icon: FileDownloadRoundedIcon,
  },
  {
    label: 'Export HTML',
    variant: 'ghost',
    Icon: FileDownloadRoundedIcon,
  },
  {
    label: 'Voir le reporting',
    variant: 'ghost',
    Icon: AssessmentRoundedIcon,
  },
]
