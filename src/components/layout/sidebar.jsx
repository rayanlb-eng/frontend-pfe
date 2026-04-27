import { useMemo } from 'react'
import { Box, ButtonBase, Chip, Divider, Stack, Tooltip, Typography } from '@mui/material'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import { useLocation, useNavigate } from 'react-router-dom'
import mobilisLogo from '../../assets/mobilis-logo-blanc-rouge.png'
import { CONNECTED_USER_EMAIL_KEY, CONNECTED_USER_ROLE_KEY } from '../../Pages/Users/users.data'
import { sidebarMainItems, sidebarSecondaryItems } from '../../data/sidebarItems'

function SidebarItem({ item, isActive, onClick }) {
  const Icon = item.icon

  return (
    <Tooltip title={item.label} placement="right" arrow>
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
            justifyContent: 'flex-start',
            gap: 1.25,
            minHeight: 52,
            px: 1.2,
            borderRadius: '16px',
            color: isActive ? '#0F6B3B' : 'rgba(255,255,255,0.94)',
            bgcolor: isActive ? '#F6FFF9' : 'transparent',
            border: isActive ? '1px solid rgba(255,255,255,0.18)' : '1px solid transparent',
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
            }}
          >
            <Icon sx={{ fontSize: 20 }} />
          </Box>

          <Box sx={{ minWidth: 0, flex: 1 }}>
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

function SidebarSection({ title, items, location, navigate }) {
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

  const connectedUserRole = localStorage.getItem(CONNECTED_USER_ROLE_KEY) || 'DDRH'
  const connectedUserEmail =
    localStorage.getItem(CONNECTED_USER_EMAIL_KEY) || 'responsable@mobilis.dz'

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

  return (
    <Box
      sx={{
        width: 260,
        minHeight: '100vh',
        px: 1.5,
        py: 1.8,
        bgcolor: '#0E5F35',
        background: 'linear-gradient(180deg, #127242 0%, #0E5F35 42%, #0A4E2C 100%)',
        color: '#fff',
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '10px 0 28px rgba(7, 52, 30, 0.12)',
        position: 'sticky',
        top: 0,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          mb: 2.1,
          px: 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 0,
            flex: 1,
            minHeight: 96,
            px: 1.4,
            py: 1,
            borderRadius: '22px',
            bgcolor: 'rgba(255,255,255,0.09)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow:
              'inset 0 1px 0 rgba(255,255,255,0.08), 0 14px 28px rgba(4, 33, 19, 0.16)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 52%, rgba(255,255,255,0.00) 100%)',
              pointerEvents: 'none',
            },
          }}
        >
          <Box
            component="img"
            src={mobilisLogo}
            alt="Mobilis"
            sx={{
              width: 172,
              height: 58,
              objectFit: 'contain',
              display: 'block',
              filter: 'drop-shadow(0 10px 18px rgba(3, 31, 17, 0.18))',
              position: 'relative',
              zIndex: 1,
            }}
          />
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 1.4 }} />

      <Stack spacing={1.4}>
        <SidebarSection
          title="Principal"
          items={mainItems}
          location={location}
          navigate={navigate}
        />

        <SidebarSection
          title="Administration"
          items={sidebarSecondaryItems}
          location={location}
          navigate={navigate}
        />
      </Stack>

      <Box sx={{ mt: 'auto', pt: 1.5 }}>
        <ButtonBase
          onClick={() => navigate('/parametres')}
          sx={{
            width: '100%',
            display: 'block',
            textAlign: 'left',
            p: 1.2,
            borderRadius: '18px',
            bgcolor: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.10)',
            transition: 'all 0.2s ease',
            boxShadow: location.pathname.startsWith('/parametres')
              ? '0 12px 24px rgba(4, 33, 19, 0.16)'
              : 'none',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.14)',
              borderColor: 'rgba(255,255,255,0.16)',
            },
          }}
        >
          <Stack spacing={1.2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(255,255,255,0.16)',
                  color: '#fff',
                  flexShrink: 0,
                }}
              >
                <SettingsRoundedIcon sx={{ fontSize: 20 }} />
              </Box>

              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    color: '#fff',
                  }}
                >
                  Paramètres
                </Typography>
                <Typography
                  sx={{
                    mt: 0.2,
                    fontSize: '0.76rem',
                    color: 'rgba(255,255,255,0.68)',
                    lineHeight: 1.35,
                  }}
                >
                  Configuration de la plateforme, préférences et options globales.
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
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
              <Typography
                sx={{
                  fontSize: '0.74rem',
                  color: 'rgba(255,255,255,0.62)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {connectedUserEmail}
              </Typography>
            </Stack>
          </Stack>
        </ButtonBase>
      </Box>
    </Box>
  )
}
