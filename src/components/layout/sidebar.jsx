import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
import GroupIcon from '@mui/icons-material/Group'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import SchemaRoundedIcon from '@mui/icons-material/SchemaRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import { Avatar, Box, Button, ButtonBase, Chip, Stack, Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { CONNECTED_USER_ROLE_KEY } from '../../Pages/Users/users.data'
import mobilisLogo from '../../assets/mobilis-logo-blanc.png'

const items = [
  {
    label: 'Dashboard',
    description: 'Vue globale et indicateurs',
    icon: <DashboardRoundedIcon sx={{ fontSize: 21 }} />,
    path: '/dashboard',
  },
  {
    label: 'Fiches',
    description: 'Envoi et suivi des fiches',
    icon: <DescriptionRoundedIcon sx={{ fontSize: 21 }} />,
    path: '/fiches',
  },
  {
    label: 'Analyse',
    description: 'Priorisation et arbitrage DDRH',
    icon: <SchemaRoundedIcon sx={{ fontSize: 21 }} />,
    path: '/analyse',
  },
  {
    label: 'Parametres',
    description: 'Reglages de la plateforme',
    icon: <SettingsRoundedIcon sx={{ fontSize: 21 }} />,
    path: '/parametres',
  },
  {
    label: 'Utilisateurs',
    description: 'Gestion des comptes',
    icon: <GroupIcon sx={{ fontSize: 21 }} />,
    path: '/users',
  },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const connectedUserRole = localStorage.getItem(CONNECTED_USER_ROLE_KEY) || 'DDRH'

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    navigate('/login', { replace: true })
  }

  return (
    <Box
      sx={{
        width: 284,
        minHeight: '100vh',
        px: 2,
        py: 2.2,
        background: 'linear-gradient(180deg, #147b47 0%, #0d5c32 100%)',
        color: '#fff',
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '12px 0 30px rgba(7, 52, 30, 0.10)',
        position: 'sticky',
        top: 0,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.3,
          mb: 2.4,
          px: 0.5,
        }}
      >
        <Box
          sx={{
            width: 62,
            height: 62,
            borderRadius: '18px',
            bgcolor: 'rgba(255,255,255,0.14)',
            border: '1px solid rgba(255,255,255,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          <Box
            component="img"
            src={mobilisLogo}
            alt="Mobilis"
            sx={{
              display: 'block',
              width: 38,
              height: 38,
              objectFit: 'contain',
            }}
          />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: '1.08rem',
              fontWeight: 800,
              lineHeight: 1.1,
              color: '#fff',
            }}
          >
            Mobilis
          </Typography>
          <Typography
            sx={{
              mt: 0.35,
              fontSize: '0.8rem',
              color: 'rgba(255,255,255,0.72)',
              lineHeight: 1.35,
            }}
          >
            Plateforme formation
          </Typography>
        </Box>
      </Box>

      <Typography
        sx={{
          px: 0.8,
          mb: 1,
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.62)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontWeight: 700,
        }}
      >
        Navigation
      </Typography>

      <Stack spacing={1}>
        {items.map((item) => {
          const isActive =
            item.path === '/fiches'
              ? location.pathname.startsWith('/fiches')
              : item.path === '/analyse'
                ? location.pathname.startsWith('/analyse')
              : location.pathname === item.path

          return (
            <ButtonBase
              key={item.label}
              onClick={() => navigate(item.path)}
              sx={{
                justifyContent: 'flex-start',
                width: '100%',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.1,
                  px: 1.35,
                  py: 1.12,
                  borderRadius: 3.2,
                  color: isActive ? '#0f6c3c' : '#ffffff',
                  background: isActive
                    ? 'linear-gradient(135deg, #f7fff9 0%, #dff5e8 100%)'
                    : 'transparent',
                  border: isActive
                    ? '1px solid rgba(255,255,255,0.26)'
                    : '1px solid transparent',
                  boxShadow: isActive
                    ? '0 12px 22px rgba(7, 52, 30, 0.18)'
                    : 'none',
                  transition: 'all 0.22s ease',
                  '&:hover': {
                    background: isActive
                      ? 'linear-gradient(135deg, #f7fff9 0%, #dff5e8 100%)'
                      : 'rgba(255,255,255,0.08)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: isActive ? 'rgba(19,146,81,0.12)' : 'rgba(255,255,255,0.10)',
                    color: isActive ? '#139251' : 'rgba(255,255,255,0.92)',
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </Box>

                <Box sx={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                  <Typography
                    sx={{
                      fontWeight: isActive ? 800 : 700,
                      fontSize: '0.94rem',
                      lineHeight: 1.1,
                    }}
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    sx={{
                      mt: 0.35,
                      fontSize: '0.76rem',
                      color: isActive ? '#4d7a61' : 'rgba(255,255,255,0.64)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.description}
                  </Typography>
                </Box>

                {isActive && (
                  <ChevronRightRoundedIcon sx={{ fontSize: 20, color: '#139251' }} />
                )}
              </Box>
            </ButtonBase>
          )
        })}
      </Stack>

      <Box
        sx={{
          mt: 'auto',
          p: 1.8,
          borderRadius: '20px',
          background: 'rgba(255,255,255,0.10)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        <Stack spacing={1.6}>
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Avatar
              sx={{
                width: 42,
                height: 42,
                bgcolor: 'rgba(255,255,255,0.16)',
              color: '#fff',
                fontWeight: 800,
              }}
            >
              R
            </Avatar>

            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                sx={{
                  fontSize: '0.78rem',
                  color: 'rgba(255,255,255,0.68)',
                }}
              >
                Connecte en tant que
              </Typography>

              <Typography
                sx={{
                  mt: 0.35,
                fontWeight: 800,
                  fontSize: '0.92rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                Responsable formation
              </Typography>
            </Box>

            <Chip
              label={connectedUserRole}
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.14)',
                color: '#fff',
                fontWeight: 700,
                borderRadius: '10px',
              }}
            />
          </Stack>

          <Button
            variant="contained"
            startIcon={<LogoutRoundedIcon />}
            onClick={handleLogout}
            sx={{
              borderRadius: '14px',
              textTransform: 'none',
              fontWeight: 800,
              justifyContent: 'flex-start',
              bgcolor: 'rgba(255,255,255,0.16)',
              color: '#fff',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.22)',
                boxShadow: 'none',
              },
            }}
          >
            Deconnecter
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}
