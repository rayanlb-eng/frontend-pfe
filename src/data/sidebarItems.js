import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
import SchemaRoundedIcon from '@mui/icons-material/SchemaRounded'
import SummarizeRoundedIcon from '@mui/icons-material/SummarizeRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import GroupRoundedIcon from '@mui/icons-material/GroupRounded'

export const sidebarMainItems = [
  {
    label: 'Dashboard',
    icon: DashboardRoundedIcon,
    path: '/dashboard',
  },
  {
    label: 'Fiches',
    icon: DescriptionRoundedIcon,
    path: '/fiches',
  },
  {
    label: 'Analyse',
    icon: SchemaRoundedIcon,
    path: '/analyse',
  },
  {
    label: 'Rapport',
    icon: SummarizeRoundedIcon,
    path: '/rapport',
  },
]

export const sidebarSecondaryItems = [
  {
    label: 'Paramètres',
    icon: SettingsRoundedIcon,
    path: '/parametres',
  },
  {
    label: 'Utilisateurs',
    icon: GroupRoundedIcon,
    path: '/users',
  },
]