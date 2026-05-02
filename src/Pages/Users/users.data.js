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
    subtitle: 'DDRH et administration',
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
    username: 'y.benaissa',
    email: 'y.benaissa@mobilis.dz',
    first_name: 'Yasmine',
    last_name: 'Benaissa',
    is_staff: true,
    is_active: true,
    is_superuser: true,
    last_login: '2026-05-01T09:15:00',
    date_joined: '2025-09-10T08:30:00',
    role: 'Admin',
    departement: 'Administration',
    telephone: '+213 666 10 20 30',
  },
  {
    username: 'k.ziani',
    email: 'k.ziani@mobilis.dz',
    first_name: 'Karim',
    last_name: 'Ziani',
    is_staff: false,
    is_active: true,
    is_superuser: false,
    last_login: '2026-04-30T15:40:00',
    date_joined: '2025-10-02T09:00:00',
    role: 'Directeur de structure',
    departement: 'Direction Ouest',
    telephone: '+213 666 44 28 17',
  },
  {
    username: 'n.ferhat',
    email: 'n.ferhat@mobilis.dz',
    first_name: 'Nadia',
    last_name: 'Ferhat',
    is_staff: false,
    is_active: true,
    is_superuser: false,
    last_login: '2026-04-28T11:20:00',
    date_joined: '2025-10-06T10:15:00',
    role: 'Directeur de structure',
    departement: 'Direction Est',
    telephone: '+213 666 23 44 80',
  },
  {
    username: 's.touati',
    email: 's.touati@mobilis.dz',
    first_name: 'Samir',
    last_name: 'Touati',
    is_staff: false,
    is_active: false,
    is_superuser: false,
    last_login: '2026-03-18T14:10:00',
    date_joined: '2025-09-28T08:45:00',
    role: 'Directeur de structure',
    departement: 'Audit interne',
    telephone: '+213 666 61 19 41',
  },
  {
    username: 'i.rahal',
    email: 'i.rahal@mobilis.dz',
    first_name: 'Imane',
    last_name: 'Rahal',
    is_staff: true,
    is_active: true,
    is_superuser: false,
    last_login: '2026-05-01T08:00:00',
    date_joined: '2025-09-12T08:00:00',
    role: 'DDRH',
    departement: 'DDRH',
    telephone: '+213 666 92 32 16',
  },
  {
    username: 'm.boussouf',
    email: 'm.boussouf@mobilis.dz',
    first_name: 'Mourad',
    last_name: 'Boussouf',
    is_staff: false,
    is_active: true,
    is_superuser: false,
    last_login: '2026-04-29T16:25:00',
    date_joined: '2025-10-15T09:30:00',
    role: 'Directeur de structure',
    departement: 'Direction Formation',
    telephone: '+213 666 35 73 26',
  },
]

export function getFullName(user) {
  return `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username
}

export function getUserStatusLabel(user) {
  return user.is_active ? 'Actif' : 'Inactif'
}

export function getRoleColor(role) {
  if (role === 'Admin') return '#1e9b6d'
  if (role === 'DDRH') return '#7c3aed'
  return '#2563eb'
}

export function getUserAvatar(user) {
  const first = (user.first_name || user.username || 'U').charAt(0).toUpperCase()
  const last = (user.last_name || '').charAt(0).toUpperCase()
  return `${first}${last}`.trim() || 'U'
}

export function mapRoleFlags(role) {
  if (role === 'Admin') {
    return { is_staff: true, is_superuser: true }
  }

  if (role === 'DDRH') {
    return { is_staff: true, is_superuser: false }
  }

  return { is_staff: false, is_superuser: false }
}

function normalizeUser(rawUser) {
  const email = rawUser.email || ''
  const fallbackUsername = email ? email.split('@')[0] : 'utilisateur'
  const fullName = String(rawUser.name || '').trim()
  const [firstNameFromName = '', ...lastNameParts] = fullName.split(' ')
  const role = rawUser.role || rawUser.accessRole || 'Directeur de structure'
  const flags = mapRoleFlags(role)

  return {
    username: String(rawUser.username || fallbackUsername).trim(),
    email: String(email).trim(),
    first_name: String(rawUser.first_name || firstNameFromName).trim(),
    last_name: String(rawUser.last_name || lastNameParts.join(' ')).trim(),
    is_staff:
      typeof rawUser.is_staff === 'boolean' ? rawUser.is_staff : flags.is_staff,
    is_active:
      typeof rawUser.is_active === 'boolean'
        ? rawUser.is_active
        : rawUser.status === 'Inactif' || rawUser.status === 'Acces revoque'
          ? false
          : true,
    is_superuser:
      typeof rawUser.is_superuser === 'boolean'
        ? rawUser.is_superuser
        : flags.is_superuser,
    last_login: rawUser.last_login || '',
    date_joined: rawUser.date_joined || '',
    role,
    departement: String(rawUser.departement || rawUser.department || '').trim(),
    telephone: String(rawUser.telephone || rawUser.phone || '').trim(),
  }
}

export function getStoredUsers() {
  const raw = localStorage.getItem(USERS_STORAGE_KEY)
  const users = raw ? JSON.parse(raw) : initialUsers
  return users.map(normalizeUser)
}

export function saveUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
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
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  gap: 1.2,
  alignItems: 'center',
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
  width: 'auto',
  alignItems: 'center',
  justifyContent: 'flex-end',
  whiteSpace: 'nowrap',
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
