import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded'
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded'
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded'

export const CONNECTED_USER_ROLE_KEY = 'connectedUserRole'
export const CONNECTED_USER_EMAIL_KEY = 'connectedUserEmail'

export const stats = [
  {
    title: 'Utilisateurs actifs',
    value: '28',
    subtitle: 'Comptes operationnels',
    background: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)',
    Icon: VerifiedUserRoundedIcon,
  },
  {
    title: 'Profils DDRH',
    value: '4',
    subtitle: 'Acces administrateur',
    background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
    Icon: AdminPanelSettingsRoundedIcon,
  },
  {
    title: 'Nouveaux comptes',
    value: '6',
    subtitle: 'Ajoutes ce mois',
    background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
    Icon: PersonAddAlt1RoundedIcon,
  },
  {
    title: 'Acces a revoir',
    value: '3',
    subtitle: 'Permissions a verifier',
    background: 'linear-gradient(135deg, #eab308 0%, #facc15 100%)',
    Icon: ManageAccountsRoundedIcon,
  },
]

export const initialUsers = [
  {
    name: 'Yasmine Benaissa',
    title: 'Administratrice plateforme',
    accessRole: 'DDRH',
    department: 'DDRH',
    email: 'y.benaissa@mobilis.dz',
    phone: '+213 666 10 20 30',
    status: 'Actif',
    twoFactorEnabled: true,
    badgeColor: '#1e9b6d',
    avatar: 'Y',
  },
  {
    name: 'Karim Ziani',
    title: 'Responsable formation',
    accessRole: 'Employeur',
    department: 'Formation',
    email: 'k.ziani@mobilis.dz',
    phone: '+213 666 44 28 17',
    status: 'Actif',
    twoFactorEnabled: true,
    badgeColor: '#2563eb',
    avatar: 'K',
  },
  {
    name: 'Nadia Ferhat',
    title: 'Gestionnaire RH',
    accessRole: 'Employeur',
    department: 'Ressources humaines',
    email: 'n.ferhat@mobilis.dz',
    phone: '+213 666 23 44 80',
    status: 'En attente',
    twoFactorEnabled: false,
    badgeColor: '#e08b2f',
    avatar: 'N',
  },
  {
    name: 'Samir Touati',
    title: 'Consultation',
    accessRole: 'Employeur',
    department: 'Audit interne',
    email: 's.touati@mobilis.dz',
    phone: '+213 666 61 19 41',
    status: 'Inactif',
    twoFactorEnabled: false,
    badgeColor: '#db5c74',
    avatar: 'S',
  },
  {
    name: 'Imane Rahal',
    title: 'Responsable validation',
    accessRole: 'DDRH',
    department: 'Direction',
    email: 'i.rahal@mobilis.dz',
    phone: '+213 666 92 32 16',
    status: 'Actif',
    twoFactorEnabled: true,
    badgeColor: '#7c3aed',
    avatar: 'I',
  },
  {
    name: 'Mourad Boussouf',
    title: 'Gestionnaire catalogue',
    accessRole: 'Employeur',
    department: 'Formation',
    email: 'm.boussouf@mobilis.dz',
    phone: '+213 666 35 73 26',
    status: 'Actif',
    twoFactorEnabled: false,
    badgeColor: '#1e9b6d',
    avatar: 'M',
  },
]

export const filters = {
  roles: ['Tous les roles', 'DDRH', 'Employeur'],
  status: ['Tous les statuts', 'Actif', 'En attente', 'Inactif', 'Acces revoque'],
  department: [
    'Tous les services',
    'DDRH',
    'Formation',
    'Ressources humaines',
    'Direction',
    'Audit interne',
  ],
}
