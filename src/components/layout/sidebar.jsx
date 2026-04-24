import { useMemo, useState } from 'react'
import {
  Avatar,
  Box,
  ButtonBase,
  Chip,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import { useLocation, useNavigate } from 'react-router-dom'
import mobilisLogo from '../../assets/mobilis-logo-blanc.png'
import {
  CONNECTED_USER_EMAIL_KEY,
  CONNECTED_USER_ROLE_KEY,
  TRUSTED_2FA_DEVICES_KEY,
} from '../../Pages/Users/users.data'
import { sidebarMainItems, sidebarSecondaryItems } from '../../data/sidebarItems'

function SidebarItem({ item, isActive, isExpanded, onClick }) {
  const Icon = item.icon

  return (
    <Tooltip title={!isExpanded ? item.label : ''} placement="right" arrow>
      <ButtonBase
        onClick={onClick}
        sx={{
          width: '100%',
          borderRadius: '16px',
          display: 'block',
          textAlign: 'left',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isExpanded ? 'flex-start' : 'center',
            gap: isExpanded ? 1.25 : 0,
            minHeight: 52,
            px: isExpanded ? 1.2 : 0.9,
            borderRadius: '16px',
            color: isActive ? '#0F6B3B' : 'rgba(255,255,255,0.94)',
            bgcolor: isActive ? '#F6FFF9' : 'transparent',
            border: isActive
              ? '1px solid rgba(255,255,255,0.18)'
              : '1px solid transparent',
            boxShadow: isActive ? '0 10px 22px rgba(8, 45, 25, 0.18)' : 'none',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: isActive ? '#F6FFF9' : 'rgba(255,255,255,0.08)',
            },
          }}
        >
          {isActive && (
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                top: 10,
                bottom: 10,
                width: 4,
                borderRadius: '0 8px 8px 0',
                bgcolor: '#1E9B6D',
              }}
            />
          )}

          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              bgcolor: isActive ? 'rgba(30,155,109,0.12)' : 'rgba(255,255,255,0.10)',
              color: isActive ? '#1E9B6D' : '#FFFFFF',
              transition: 'all 0.2s ease',
            }}
          >
            <Icon sx={{ fontSize: 20 }} />
          </Box>

          <Box
            sx={{
              minWidth: 0,
              flex: isExpanded ? 1 : 0,
              opacity: isExpanded ? 1 : 0,
              width: isExpanded ? 'auto' : 0,
              overflow: 'hidden',
              transition: 'opacity 0.18s ease, width 0.18s ease',
            }}
          >
            <Typography
              sx={{
                fontSize: '0.94rem',
                fontWeight: isActive ? 800 : 700,
                whiteSpace: 'nowrap',
              }}
            >
              {item.label}
            </Typography>
          </Box>
        </Box>
      </ButtonBase>
    </Tooltip>
  )
}

function SidebarSection({ title, items, isExpanded, location, navigate }) {
  return (
    <Box>
      <Typography
        sx={{
          px: 1,
          mb: 0.9,
          fontSize: '0.72rem',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'rgba(255,255,255,0.58)',
          fontWeight: 800,
          opacity: isExpanded ? 1 : 0,
          height: isExpanded ? 'auto' : 0,
          overflow: 'hidden',
          transition: 'opacity 0.18s ease, height 0.18s ease',
        }}
      >
        {title}
      </Typography>

      <Stack spacing={0.7}>
        {items.map((item) => {
          const isActive =
            item.path === '/dashboard'
              ? location.pathname === '/dashboard'
              : item.path.startsWith('/fiches/')
                ? location.pathname.startsWith('/fiches')
              : location.pathname.startsWith(item.path)

          return (
            <SidebarItem
              key={item.label}
              item={item}
              isActive={isActive}
              isExpanded={isExpanded}
              onClick={() => navigate(item.path)}
            />
          )
        })}
      </Stack>
    </Box>
  )
}

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isExpanded, setIsExpanded] = useState(true)

  const connectedUserRole =
    localStorage.getItem(CONNECTED_USER_ROLE_KEY) || 'DDRH'
  const connectedUserEmail =
    localStorage.getItem(CONNECTED_USER_EMAIL_KEY) || 'responsable@mobilis.dz'

  const userDisplay = useMemo(() => {
    const namePart = connectedUserEmail.split('@')[0] || 'user'
    const parts = namePart.split('.')
    const formattedName = parts
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')

    return {
      fullName: formattedName || 'Utilisateur',
      initial: formattedName?.charAt(0)?.toUpperCase() || 'U',
    }
  }, [connectedUserEmail])

  const mainItems = useMemo(
    () =>
      sidebarMainItems.map((item) =>
        item.path === '/fiches'
          ? {
              ...item,
              label: connectedUserRole === 'DDRH' ? 'Fiches' : 'Mes fiches',
              path: connectedUserRole === 'DDRH' ? '/fiches/gestion' : '/fiches/mes',
            }
          : item
      ),
    [connectedUserRole]
  )

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem(CONNECTED_USER_ROLE_KEY)
    localStorage.removeItem(CONNECTED_USER_EMAIL_KEY)
    sessionStorage.removeItem('pending2FA')
    navigate('/login', { replace: true })
  }

  return (
    <Box
      sx={{
        width: isExpanded ? 260 : 88,
        minHeight: '100vh',
        px: isExpanded ? 1.5 : 1,
        py: 1.8,
        bgcolor: '#0E5F35',
        background:
          'linear-gradient(180deg, #127242 0%, #0E5F35 42%, #0A4E2C 100%)',
        color: '#fff',
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '10px 0 28px rgba(7, 52, 30, 0.12)',
        position: 'sticky',
        top: 0,
        overflow: 'hidden',
        transition: 'width 0.22s ease, padding 0.22s ease',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isExpanded ? 'space-between' : 'center',
          gap: 1,
          mb: 1.8,
          px: 0.4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isExpanded ? 'flex-start' : 'center',
            gap: isExpanded ? 1 : 0,
            minWidth: 0,
            flex: 1,
          }}
        >
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: '16px',
              bgcolor: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.10)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Box
              component="img"
              src={mobilisLogo}
              alt="Mobilis"
              sx={{
                width: 30,
                height: 30,
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </Box>

          <Box
            sx={{
              minWidth: 0,
              opacity: isExpanded ? 1 : 0,
              width: isExpanded ? 'auto' : 0,
              overflow: 'hidden',
              transition: 'opacity 0.18s ease, width 0.18s ease',
            }}
          >
            <Typography
              sx={{
                fontSize: '1rem',
                fontWeight: 800,
                lineHeight: 1.1,
                color: '#fff',
                whiteSpace: 'nowrap',
              }}
            >
              Mobilis
            </Typography>
            <Typography
              sx={{
                mt: 0.2,
                fontSize: '0.76rem',
                color: 'rgba(255,255,255,0.70)',
                whiteSpace: 'nowrap',
              }}
            >
              Plateforme formation
            </Typography>
          </Box>
        </Box>

        


      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 1.4 }} />

      {/* Navigation */}
      <Stack spacing={1.4}>
        <SidebarSection
          title="Principal"
          items={mainItems}
          isExpanded={isExpanded}
          location={location}
          navigate={navigate}
        />

        <SidebarSection
          title="Administration"
          items={sidebarSecondaryItems}
          isExpanded={isExpanded}
          location={location}
          navigate={navigate}
        />
      </Stack>

      {/* Bottom user block */}
      <Box sx={{ mt: 'auto', pt: 1.5 }}>
        <Box
          sx={{
            p: isExpanded ? 1.2 : 0.9,
            borderRadius: '18px',
            bgcolor: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.10)',
            transition: 'all 0.2s ease',
          }}
        >
          <Stack spacing={1.2}>
            <Stack
              direction="row"
              spacing={isExpanded ? 1 : 0}
              alignItems="center"
              justifyContent={isExpanded ? 'flex-start' : 'center'}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: 'rgba(255,255,255,0.16)',
                  color: '#fff',
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                {userDisplay.initial}
              </Avatar>

              <Box
                sx={{
                  minWidth: 0,
                  flex: isExpanded ? 1 : 0,
                  opacity: isExpanded ? 1 : 0,
                  width: isExpanded ? 'auto' : 0,
                  overflow: 'hidden',
                  transition: 'opacity 0.18s ease, width 0.18s ease',
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {userDisplay.fullName}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.2,
                    fontSize: '0.75rem',
                    color: 'rgba(255,255,255,0.68)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {connectedUserEmail}
                </Typography>
              </Box>
            </Stack>

            {isExpanded && (
              <Chip
                label={connectedUserRole}
                size="small"
                sx={{
                  alignSelf: 'flex-start',
                  bgcolor: 'rgba(255,255,255,0.14)',
                  color: '#fff',
                  fontWeight: 700,
                  borderRadius: '10px',
                }}
              />
            )}

            <Tooltip title={!isExpanded ? 'Déconnecter' : ''} placement="right" arrow>
              <ButtonBase
                onClick={handleLogout}
                sx={{
                  width: '100%',
                  minHeight: 44,
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isExpanded ? 'flex-start' : 'center',
                  gap: isExpanded ? 1 : 0,
                  px: isExpanded ? 1.2 : 0.8,
                  color: '#fff',
                  bgcolor: 'rgba(255,255,255,0.10)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.18)',
                  },
                }}
              >
                <LogoutRoundedIcon sx={{ fontSize: 20 }} />
                <Box
                  sx={{
                    opacity: isExpanded ? 1 : 0,
                    width: isExpanded ? 'auto' : 0,
                    overflow: 'hidden',
                    transition: 'opacity 0.18s ease, width 0.18s ease',
                  }}
                >
                  <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                    Déconnecter
                  </Typography>
                </Box>
              </ButtonBase>
            </Tooltip>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
