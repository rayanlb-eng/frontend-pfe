import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
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
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  CONNECTED_USER_EMAIL_KEY,
  CONNECTED_USER_ROLE_KEY,
} from '../../Pages/Users/users.data'
import {
  getStoredNotifications,
  saveNotifications,
} from '../../Pages/Fiches/fiches.data'

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
  const [connectedUserRole, setConnectedUserRole] = useState('DDRH')
  const [connectedUserEmail, setConnectedUserEmail] = useState('k.ziani@mobilis.dz')
  const [notifications, setNotifications] = useState([])
  const currentPage =
    location.pathname.startsWith('/fiches')
      ? pageMeta['/fiches']
      : pageMeta[location.pathname] || pageMeta['/dashboard']

  useEffect(() => {
    setConnectedUserRole(localStorage.getItem(CONNECTED_USER_ROLE_KEY) || 'DDRH')
    setConnectedUserEmail(localStorage.getItem(CONNECTED_USER_EMAIL_KEY) || 'k.ziani@mobilis.dz')
    setNotifications(getStoredNotifications())
  }, [location.pathname])

  const visibleNotifications = useMemo(() => {
    if (connectedUserRole === 'DDRH') {
      return notifications.slice(0, 8)
    }

    return notifications
      .filter((item) => item.recipientEmail === connectedUserEmail)
      .slice(0, 8)
  }, [connectedUserEmail, connectedUserRole, notifications])

  const unreadCount = visibleNotifications.filter((item) => !item.read).length

  const handleOpenNotifications = (event) => {
    setNotificationsAnchor(event.currentTarget)
  }

  const handleCloseNotifications = () => {
    setNotificationsAnchor(null)
  }

  const handleOpenNotification = (notification) => {
    const updatedNotifications = notifications.map((item) =>
      item.id === notification.id ? { ...item, read: true } : item
    )
    setNotifications(updatedNotifications)
    saveNotifications(updatedNotifications)
    setNotificationsAnchor(null)

    if (notification.trackingId) {
      navigate(`/fiches/form/${notification.trackingId}`)
    }
  }

  const handleMarkAllRead = () => {
    const updatedNotifications = notifications.map((item) =>
      connectedUserRole === 'DDRH' || item.recipientEmail === connectedUserEmail
        ? { ...item, read: true }
        : item
    )
    setNotifications(updatedNotifications)
    saveNotifications(updatedNotifications)
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
        background: '#f6f8fb',
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
              icon={<Icon />}
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
            color: '#1b2740',
            lineHeight: 1.08,
          }}
        >
          {currentPage.title}
        </Typography>

        <Typography
          sx={{
            mt: 0.55,
            fontSize: '0.88rem',
            color: '#72809a',
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
            border: '1px solid #e3eaf3',
            boxShadow: '0 8px 18px rgba(20, 31, 56, 0.04)',
          }}
        >
          <SearchRoundedIcon sx={{ color: '#8a97ad', fontSize: 20 }} />
          <InputBase
            placeholder="Rechercher une fiche, un utilisateur..."
            sx={{
              flex: 1,
              fontSize: '0.92rem',
              color: '#445169',
            }}
          />
        </Box>

        <IconButton
          onClick={handleOpenNotifications}
          sx={{
            width: 44,
            height: 44,
            background: '#ffffff',
            border: '1px solid #e3eaf3',
            boxShadow: '0 8px 18px rgba(20, 31, 56, 0.04)',
            '&:hover': {
              background: '#ffffff',
            },
          }}
        >
          <Badge color="error" badgeContent={unreadCount} max={9}>
            <NotificationsNoneRoundedIcon sx={{ color: '#61718b' }} />
          </Badge>
        </IconButton>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 1.05,
            py: 0.62,
            borderRadius: '14px',
            background: '#ffffff',
            border: '1px solid #e3eaf3',
            boxShadow: '0 8px 18px rgba(20, 31, 56, 0.04)',
          }}
        >
          <Avatar
            sx={{
              width: 38,
              height: 38,
              bgcolor: '#eaf2ff',
              color: '#3657d6',
              fontWeight: 800,
            }}
          >
            R
          </Avatar>

          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography
              sx={{
                fontSize: '0.86rem',
                fontWeight: 700,
                color: '#22314a',
                lineHeight: 1.1,
              }}
            >
              {connectedUserRole === 'DDRH' ? 'Responsable' : 'Employeur'}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.76rem',
                color: '#7a879d',
                mt: 0.15,
              }}
            >
              {connectedUserRole}
            </Typography>
          </Box>

          <KeyboardArrowDownRoundedIcon sx={{ color: '#8b98ab' }} />
        </Box>
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
    </Box>
  )
}
