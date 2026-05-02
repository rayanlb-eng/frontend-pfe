import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import MarkEmailReadRoundedIcon from '@mui/icons-material/MarkEmailReadRounded'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import {
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { createElement, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  CONNECTED_USER_EMAIL_KEY,
  CONNECTED_USER_ROLE_KEY,
} from '../../Pages/Users/users.data'
import {
  syncDeadlineReminderNotifications,
  getStoredNotifications,
  saveNotifications,
} from '../../Pages/Fiches/data/storage'

const pageMeta = {
  '/dashboard': {
    title: 'Dashboard principal',
    subtitle: 'Suivi global des formations, campagnes et consolidations',
  },
  '/parametres': {
    title: 'Parametres',
    subtitle: 'Configuration de la plateforme et gestion des options',
  },
  '/fiches': {
    title: 'Fiches de formation',
    subtitle: "Envoi des fiches d'expression des besoins et suivi des structures",
  },
  '/fiches/mes': {
    title: 'Mes fiches',
    subtitle: 'Suivi de vos fiches recues, brouillons et soumissions a la DDRH',
  },
  '/fiches/gestion': {
    title: 'Fiches de formation',
    subtitle: "Envoi des fiches d'expression des besoins et suivi des structures",
  },
  '/analyse': {
    title: 'Analyse et priorisation',
    subtitle: 'Consolidation DDRH, regroupement des demandes et arbitrage budgetaire',
  },
  '/rapport': {
    title: 'Rapport de synthese',
    subtitle: 'Compilation des besoins valides, budgets estimes et exports direction',
  },
  '/users': {
    title: 'Utilisateurs',
    subtitle: 'Gestion des comptes, roles et acces applicatifs',
  },
}

const chips = [
  {
    label: 'Campagne 2026',
    Icon: BoltRoundedIcon,
    background: '#eef4ff',
    color: '#3f5fe0',
  },
  {
    label: 'Session active',
    Icon: CalendarMonthRoundedIcon,
    background: '#fff4e7',
    color: '#c77817',
  },
]

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const [notificationsAnchor, setNotificationsAnchor] = useState(null)
  const [profileAnchor, setProfileAnchor] = useState(null)
  const [notificationsVersion, setNotificationsVersion] = useState(0)
  const connectedUserRole = localStorage.getItem(CONNECTED_USER_ROLE_KEY) || 'DDRH'
  const connectedUserEmail =
    localStorage.getItem(CONNECTED_USER_EMAIL_KEY) || 'k.ziani@mobilis.dz'
  const notifications = useMemo(
    () => {
      void location.pathname
      void notificationsVersion
      syncDeadlineReminderNotifications()
      return getStoredNotifications()
    },
    [location.pathname, notificationsVersion]
  )

  const currentPage =
    location.pathname === '/dashboard'
      ? connectedUserRole === 'DDRH'
        ? {
            title: 'Dashboard DDRH',
            subtitle: 'Pilotage de la collecte, des analyses et des consolidations DDRH',
          }
        : {
            title: 'Dashboard employeur',
            subtitle: 'Suivi de vos fiches, brouillons, soumissions et relances DDRH',
          }
      : location.pathname.startsWith('/fiches/mes')
      ? pageMeta['/fiches/mes']
      : location.pathname.startsWith('/fiches')
      ? pageMeta['/fiches']
      : pageMeta[location.pathname] || pageMeta['/dashboard']

  // Ne garde que les notifications utiles au profil courant.
  const visibleNotifications = useMemo(() => {
    if (connectedUserRole === 'DDRH') {
      return notifications.slice(0, 8)
    }

    return notifications
      .filter((item) => item.recipientEmail === connectedUserEmail)
      .slice(0, 8)
  }, [connectedUserEmail, connectedUserRole, notifications])

  const unreadCount = visibleNotifications.filter((item) => !item.read).length
  const userInitial = (connectedUserEmail.charAt(0) || 'R').toUpperCase()

  // Ouvre le menu ancre sur l'icone de notifications.
  const handleOpenNotifications = (event) => {
    setNotificationsAnchor(event.currentTarget)
  }

  const handleCloseNotifications = () => {
    setNotificationsAnchor(null)
  }

  const handleOpenProfile = (event) => {
    setProfileAnchor(event.currentTarget)
  }

  const handleCloseProfile = () => {
    setProfileAnchor(null)
  }

  // Marque une notification comme lue puis ouvre la fiche cible si elle existe.
  const handleOpenNotification = (notification) => {
    const updatedNotifications = notifications.map((item) =>
      item.id === notification.id ? { ...item, read: true } : item
    )
    saveNotifications(updatedNotifications)
    setNotificationsVersion((value) => value + 1)
    setNotificationsAnchor(null)

    if (notification.trackingId) {
      navigate(`/fiches/form/${notification.trackingId}`)
    }
  }

  // Marque comme lues uniquement les notifications visibles par l'utilisateur courant.
  const handleMarkAllRead = () => {
    const updatedNotifications = notifications.map((item) =>
      connectedUserRole === 'DDRH' || item.recipientEmail === connectedUserEmail
        ? { ...item, read: true }
        : item
    )
    saveNotifications(updatedNotifications)
    setNotificationsVersion((value) => value + 1)
  }

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem(CONNECTED_USER_ROLE_KEY)
    localStorage.removeItem(CONNECTED_USER_EMAIL_KEY)
    sessionStorage.removeItem('pending2FA')
    setProfileAnchor(null)
    navigate('/login', { replace: true })
  }

  return (
    <Box
      sx={{
        px: { xs: 2, md: 3.2 },
        py: { xs: 1.8, md: 2.1 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        borderBottom: '1px solid #e7edf5',
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,250,252,0.98) 100%)',
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          sx={{ mb: 1 }}
        >
          {chips.map(({ label, Icon, background, color }) => (
            <Chip
              key={label}
              icon={createElement(Icon)}
              label={label}
              size="small"
              sx={{
                bgcolor: background,
                color,
                fontWeight: 700,
                borderRadius: '10px',
                '& .MuiChip-icon': { color },
              }}
            />
          ))}
        </Stack>

        <Typography
          sx={{
            fontSize: { xs: '1.28rem', md: '1.65rem' },
            fontWeight: 800,
            color: '#17324d',
            lineHeight: 1.08,
          }}
        >
          {currentPage.title}
        </Typography>

        <Typography
          sx={{
            mt: 0.55,
            fontSize: '0.88rem',
            color: '#5f8a72',
            maxWidth: 640,
          }}
        >
          {currentPage.subtitle}
        </Typography>
      </Box>

      <Stack
        direction="row"
        spacing={1.2}
        alignItems="center"
        sx={{ flexShrink: 0 }}
      >
        <Box
          sx={{
            display: { xs: 'none', lg: 'flex' },
            alignItems: 'center',
            gap: 1,
            px: 1.5,
            py: 0.85,
            minWidth: 270,
            borderRadius: '14px',
            background: '#ffffff',
            border: '1px solid #cfe3d7',
            boxShadow: '0 8px 18px rgba(15, 107, 59, 0.08)',
          }}
        >
          <SearchRoundedIcon sx={{ color: '#0f6b3b', fontSize: 20 }} />
          <InputBase
            placeholder="Rechercher une fiche, un utilisateur..."
            sx={{
              flex: 1,
              fontSize: '0.92rem',
              color: '#1f5138',
              '& input::placeholder': {
                color: '#78a08b',
                opacity: 1,
              },
            }}
          />
        </Box>

        <IconButton
          onClick={handleOpenNotifications}
          sx={{
            width: 44,
            height: 44,
            background: '#ffffff',
            border: '1px solid #cfe3d7',
            boxShadow: '0 8px 18px rgba(15, 107, 59, 0.08)',
            '&:hover': {
              background: '#f4fbf7',
            },
          }}
        >
          <Badge color="error" badgeContent={unreadCount} max={9}>
            <NotificationsNoneRoundedIcon sx={{ color: '#0f6b3b' }} />
          </Badge>
        </IconButton>

        <Tooltip title="Profil" arrow>
        <Box
          onClick={handleOpenProfile}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 1.05,
            py: 0.62,
            borderRadius: '14px',
            background: '#ffffff',
            border: '1px solid #cfe3d7',
            boxShadow: '0 8px 18px rgba(15, 107, 59, 0.08)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              background: '#f4fbf7',
              borderColor: '#b9d9c8',
            },
          }}
        >
          <Avatar
            sx={{
              width: 38,
              height: 38,
              bgcolor: '#e9f7ef',
              color: '#0f6b3b',
              fontWeight: 800,
            }}
          >
            {userInitial}
          </Avatar>

          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography
              sx={{
                fontSize: '0.86rem',
                fontWeight: 700,
                color: '#1f5138',
                lineHeight: 1.1,
              }}
            >
              {connectedUserRole === 'DDRH' ? 'Responsable' : 'Employeur'}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.76rem',
                color: '#78a08b',
                mt: 0.15,
              }}
            >
              {connectedUserRole}
            </Typography>
          </Box>

          <KeyboardArrowDownRoundedIcon sx={{ color: '#0f6b3b' }} />
        </Box>
        </Tooltip>
      </Stack>

      <Menu
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={handleCloseNotifications}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            width: 360,
            borderRadius: '18px',
            p: 1,
            mt: 1,
          },
        }}
      >
        <Box sx={{ px: 1.2, py: 0.8 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography sx={{ fontWeight: 800, color: '#1b2740' }}>
              Notifications
            </Typography>
            <Button
              size="small"
              startIcon={<MarkEmailReadRoundedIcon />}
              onClick={handleMarkAllRead}
              sx={{ textTransform: 'none', fontWeight: 700 }}
            >
              Tout lire
            </Button>
          </Stack>
        </Box>

        {visibleNotifications.length === 0 ? (
          <MenuItem disabled sx={{ opacity: 1 }}>
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#475569' }}>
                Aucune notification
              </Typography>
              <Typography sx={{ fontSize: '0.82rem', color: '#94a3b8', mt: 0.2 }}>
                Les notifications d'envoi de fiche apparaitront ici.
              </Typography>
            </Box>
          </MenuItem>
        ) : (
          visibleNotifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={() => handleOpenNotification(notification)}
              sx={{
                alignItems: 'flex-start',
                borderRadius: '12px',
                mb: 0.6,
                background: notification.read ? 'transparent' : '#eef6ff',
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 700, color: '#1f2937', whiteSpace: 'normal' }}>
                  {notification.title}
                </Typography>
                <Typography
                  sx={{
                    mt: 0.25,
                    fontSize: '0.82rem',
                    color: '#64748b',
                    whiteSpace: 'normal',
                  }}
                >
                  {connectedUserRole === 'DDRH'
                    ? `${notification.message}`
                    : "Cliquez pour ouvrir votre fiche de besoins en formation."}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>

      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={handleCloseProfile}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            minWidth: 220,
            borderRadius: '16px',
            mt: 1,
            p: 0.6,
          },
        }}
      >
        <Box sx={{ px: 1.2, py: 0.8 }}>
          <Typography sx={{ fontWeight: 800, color: '#1f5138', fontSize: '0.92rem' }}>
            {connectedUserRole === 'DDRH' ? 'Responsable' : 'Employeur'}
          </Typography>
          <Typography sx={{ color: '#78a08b', fontSize: '0.78rem', mt: 0.2 }}>
            {connectedUserEmail}
          </Typography>
        </Box>
        <MenuItem
          onClick={handleLogout}
          sx={{
            borderRadius: '12px',
            fontWeight: 700,
            color: '#b42318',
            gap: 1,
          }}
        >
          <LogoutRoundedIcon sx={{ fontSize: 18 }} />
          Déconnecter
        </MenuItem>
      </Menu>
    </Box>
  )
}
