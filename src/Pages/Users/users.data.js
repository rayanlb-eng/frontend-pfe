import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded'
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded'
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded'

export const CONNECTED_USER_ROLE_KEY = 'connectedUserRole'
export const CONNECTED_USER_EMAIL_KEY = 'connectedUserEmail'
export const USERS_STORAGE_KEY = 'usersManagementState'
export const TRUSTED_2FA_DEVICES_KEY = 'trustedTwoFactorDevices'

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
    title: 'Administratrice de la plateforme',
    accessRole: 'DDRH',
    department: 'DDRH',
    email: 'y.benaissa@mobilis.dz',
    phone: '+213 666 10 20 30',
    status: 'Actif',
    twoFactorRequired: true,
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
    twoFactorRequired: false,
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
    twoFactorRequired: false,
    badgeColor: '#e08b2f',
    avatar: 'N',
  },
  {
    name: 'Samir Touati',
    title: 'Consultant interne',
    accessRole: 'Employeur',
    department: 'Audit interne',
    email: 's.touati@mobilis.dz',
    phone: '+213 666 61 19 41',
    status: 'Inactif',
    twoFactorRequired: false,
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
    twoFactorRequired: true,
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
    twoFactorRequired: false,
    badgeColor: '#1e9b6d',
    avatar: 'M',
  },
]

export function getStoredUsers() {
  // Recharge les utilisateurs de demo depuis localStorage pour conserver les changements admin.
  const raw = localStorage.getItem(USERS_STORAGE_KEY)
  return raw ? JSON.parse(raw) : initialUsers
}

export function saveUsers(users) {
  // Persiste toute modification de comptes, roles ou options 2FA.
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

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

export const statsGridSx = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(2, 1fr)',
    lg: 'repeat(4, 1fr)',
  },
  gap: 1.6,
}

export const statCardSx = (background) => ({
  p: 2,
  minHeight: 124,
  borderRadius: '12px',
  position: 'relative',
  overflow: 'hidden',
  background,
  border: '1px solid rgba(255,255,255,0.16)',
  boxShadow: '0 10px 20px rgba(20, 31, 56, 0.10)',
  transition: 'all 0.22s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 14px 28px rgba(20, 31, 56, 0.08)',
  },
})

export const statIconWrapSx = {
  position: 'absolute',
  top: 10,
  right: 12,
  color: 'rgba(255,255,255,0.20)',
  '& svg': { fontSize: 32 },
}

export const statTitleSx = {
  fontSize: '0.95rem',
  color: 'rgba(255,255,255,0.92)',
  fontWeight: 700,
  lineHeight: 1.15,
  maxWidth: '85%',
}

export const statValueSx = {
  fontSize: '2.1rem',
  fontWeight: 800,
  lineHeight: 1,
  mt: 1.3,
  color: '#fff',
}

export const statSubtitleSx = {
  fontSize: '0.88rem',
  color: 'rgba(255,255,255,0.95)',
  mt: 1,
  fontWeight: 700,
  maxWidth: '90%',
}

export const contentPaperSx = {
  p: { xs: 2, md: 2.3 },
  borderRadius: '18px',
  background:
    'linear-gradient(180deg, rgba(255,255,255,0.99) 0%, rgba(248,250,255,0.98) 100%)',
  border: '1px solid #e5ebf3',
  boxShadow: '0 10px 24px rgba(20, 31, 56, 0.08)',
}

export const toolbarWrapSx = {
  spacing: 1.4,
}

export const toolbarTopRowSx = {
  direction: { xs: 'column', sm: 'row' },
  spacing: 1.2,
  alignItems: { xs: 'stretch', sm: 'center' },
}

export const searchBoxSx = {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  px: 1.5,
  minHeight: 44,
  borderRadius: '14px',
  backgroundColor: '#fff',
  border: '1px solid #dbe4f0',
  boxShadow: '0 8px 18px rgba(20, 31, 56, 0.04)',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 12px 24px rgba(20, 31, 56, 0.06)',
    borderColor: '#c9d7ea',
  },
}

export const actionButtonsSx = {
  flexShrink: 0,
  width: { xs: '100%', sm: 'auto' },
}

export const filtersRowSx = {
  direction: { xs: 'column', sm: 'row' },
  spacing: 1.2,
  sx: { flex: 1 },
}

export const controlSx = {
  '& .MuiOutlinedInput-root': {
    minHeight: 44,
    borderRadius: '14px',
    backgroundColor: '#fff',
    transition: 'all 0.2s ease',
    '& fieldset': {
      borderColor: '#dbe4f0',
    },
    '&:hover': {
      backgroundColor: '#ffffff',
      boxShadow: '0 10px 22px rgba(20, 31, 56, 0.05)',
      '& fieldset': {
        borderColor: '#c9d7ea',
      },
    },
    '&.Mui-focused': {
      boxShadow: '0 12px 24px rgba(59, 130, 246, 0.10)',
      '& fieldset': {
        borderColor: '#8fb5ff',
      },
    },
  },
}

export const secondaryButtonSx = {
  borderRadius: '14px',
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '0.85rem',
  minHeight: 44,
  height: 44,
  px: 1.8,
  borderColor: '#dbe4f0',
  color: '#42516b',
  backgroundColor: '#fff',
  boxShadow: '0 8px 18px rgba(20, 31, 56, 0.05)',
  '&:hover': {
    borderColor: '#c9d7ea',
    backgroundColor: '#ffffff',
    boxShadow: '0 12px 24px rgba(20, 31, 56, 0.08)',
  },
}

export const primaryButtonSx = {
  borderRadius: '14px',
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '0.85rem',
  minHeight: 44,
  height: 44,
  px: 1.9,
  background: 'linear-gradient(135deg, #1e9b6d 0%, #2fbf87 100%)',
  boxShadow: '0 12px 24px rgba(30,155,109,0.20)',
  '& .MuiButton-startIcon': {
    mr: 0.6,
    '& > *:nth-of-type(1)': {
      fontSize: 18,
    },
  },
  '&:hover': {
    background: 'linear-gradient(135deg, #178258 0%, #28a976 100%)',
    boxShadow: '0 16px 28px rgba(30,155,109,0.24)',
  },
}

export const usersGridSx = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    xl: 'repeat(2, 1fr)',
  },
  gap: 1.4,
}

export const userCardSx = {
  p: 1.6,
  borderRadius: '14px',
  border: '1px solid #e7edf5',
  background: '#fff',
  boxShadow: '0 8px 18px rgba(20, 31, 56, 0.04)',
  transition: 'all 0.22s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 14px 28px rgba(20, 31, 56, 0.08)',
  },
}

export const userAvatarSx = (badgeColor) => ({
  width: 52,
  height: 52,
  bgcolor: `${badgeColor}18`,
  color: badgeColor,
  fontWeight: 800,
  flexShrink: 0,
})

export const userStatusChipSx = (badgeColor) => ({
  bgcolor: `${badgeColor}18`,
  color: badgeColor,
  fontWeight: 700,
  flexShrink: 0,
})

export const userPrimaryActionSx = (badgeColor) => ({
  borderRadius: '10px',
  textTransform: 'none',
  fontWeight: 700,
  bgcolor: badgeColor,
  boxShadow: 'none',
  '&:hover': {
    bgcolor: badgeColor,
    boxShadow: 'none',
  },
})

export const userSecondaryActionSx = {
  borderRadius: '10px',
  textTransform: 'none',
  fontWeight: 700,
  borderColor: '#d7e1ef',
  color: '#48556c',
}
