import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import {
  Alert,
  Box,
  Chip,
  FormControlLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import MainLayout from '../../components/layout/mainLayout'
import {
  CONNECTED_USER_EMAIL_KEY,
  CONNECTED_USER_ROLE_KEY,
  getStoredUsers,
} from '../Users/users.data'
import { structureRecipients } from '../Fiches/data/data'

const NOTIFICATIONS_STORAGE_KEY = 'emailNotificationsEnabled'

const sectionCardSx = {
  p: { xs: 2, md: 2.4 },
  borderRadius: '18px',
  background: 'linear-gradient(180deg, rgba(255,255,255,0.99) 0%, rgba(248,250,255,0.98) 100%)',
  border: '1px solid #e5ebf3',
  boxShadow: '0 10px 24px rgba(20, 31, 56, 0.08)',
}

const iconBoxSx = (background, color) => ({
  width: 46,
  height: 46,
  borderRadius: '14px',
  bgcolor: background,
  color,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
})

export default function Parameters() {
  const [twoFactorRequired, setTwoFactorRequired] = useState(false)
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true)
  const [connectedUserRole, setConnectedUserRole] = useState('DDRH')
  const [connectedUserEmail, setConnectedUserEmail] = useState('k.ziani@mobilis.dz')

  // Recharge le profil courant et ses options locales de demonstration.
  useEffect(() => {
    const storedNotifications = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY)
    setEmailNotificationsEnabled(storedNotifications !== 'false')
    const nextRole = localStorage.getItem(CONNECTED_USER_ROLE_KEY) || 'DDRH'
    const nextEmail = localStorage.getItem(CONNECTED_USER_EMAIL_KEY) || 'k.ziani@mobilis.dz'
    setConnectedUserRole(nextRole)
    setConnectedUserEmail(nextEmail)

    const user = getStoredUsers().find((item) => item.email === nextEmail)
    setTwoFactorRequired(Boolean(user?.twoFactorRequired))
  }, [])

  // Persiste l'option de notifications e-mail dans le navigateur.
  const handleToggleNotifications = (event) => {
    const checked = event.target.checked
    setEmailNotificationsEnabled(checked)
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, String(checked))
  }

  // Change le role de demonstration pour tester les restrictions d'acces.
  const handleConnectedRoleChange = (event) => {
    const value = event.target.value
    setConnectedUserRole(value)
    localStorage.setItem(CONNECTED_USER_ROLE_KEY, value)
  }

  // Change l'utilisateur courant pour tester les flux par destinataire et les notifications.
  const handleConnectedEmailChange = (event) => {
    const value = event.target.value
    setConnectedUserEmail(value)
    localStorage.setItem(CONNECTED_USER_EMAIL_KEY, value)
    const user = getStoredUsers().find((item) => item.email === value)
    setTwoFactorRequired(Boolean(user?.twoFactorRequired))
  }

  return (
    <MainLayout>
      <Box sx={{ display: 'grid', gap: 3 }}>
        <Box>
          <Typography
            sx={{
              fontSize: '1.6rem',
              fontWeight: 800,
              color: '#1b2740',
            }}
          >
            Parametres
          </Typography>
          <Typography
            sx={{
              mt: 0.6,
              fontSize: '0.92rem',
              color: '#72809a',
              maxWidth: 720,
            }}
          >
            Espace de configuration pour la securite, les preferences d'utilisation et les options
            temporaires du front-end.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              xl: '1.15fr 0.85fr',
            },
            gap: 2,
          }}
        >
          <Paper elevation={0} sx={sectionCardSx}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1.4} alignItems="center">
                <Box sx={iconBoxSx('rgba(0,166,81,0.10)', '#00A651')}>
                  <ShieldRoundedIcon />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 800, color: '#1b2740', fontSize: '1rem' }}>
                    Securite du compte
                  </Typography>
                  <Typography sx={{ mt: 0.35, fontSize: '0.88rem', color: '#72809a' }}>
                    Reglages visibles pour le parcours de connexion et la protection du compte.
                  </Typography>
                </Box>

                <Chip
                  label={
                    twoFactorRequired
                      ? '2FA obligatoire'
                      : '2FA activee'
                  }
                  size="small"
                  sx={{
                    bgcolor: twoFactorRequired
                      ? '#efe7ff'
                      : '#e6f7ee',
                    color: twoFactorRequired
                      ? '#7c3aed'
                      : '#1d8e63',
                    fontWeight: 700,
                  }}
                />
              </Stack>

              <Alert severity="success" sx={{ borderRadius: '14px' }}>
                Le 2FA est actif par defaut sur la plateforme. La DDRH peut seulement rendre cette
                verification obligatoire pour certains profils sensibles.
              </Alert>

              <Alert severity="info" sx={{ borderRadius: '14px' }}>
                Tant que le backend n&apos;est pas branche, cette option est simulee avec
                `localStorage`.
              </Alert>
            </Stack>
          </Paper>

          <Paper elevation={0} sx={sectionCardSx}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1.4} alignItems="center">
                <Box sx={iconBoxSx('rgba(59,130,246,0.10)', '#2563eb')}>
                  <NotificationsActiveRoundedIcon />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 800, color: '#1b2740', fontSize: '1rem' }}>
                    Preferences
                  </Typography>
                  <Typography sx={{ mt: 0.35, fontSize: '0.88rem', color: '#72809a' }}>
                    Reglages utilisateur visibles pour la demo de l&apos;interface.
                  </Typography>
                </Box>
              </Stack>

              <FormControlLabel
                control={
                  <Switch
                    checked={emailNotificationsEnabled}
                    onChange={handleToggleNotifications}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography sx={{ fontSize: '0.92rem', color: '#445169', fontWeight: 700 }}>
                      Notifications par e-mail
                    </Typography>
                    <Typography sx={{ mt: 0.2, fontSize: '0.82rem', color: '#7b8798' }}>
                      Active les messages informatifs et les rappels de traitement.
                    </Typography>
                  </Box>
                }
                sx={{ m: 0, alignItems: 'flex-start' }}
              />

              <Chip
                label={emailNotificationsEnabled ? 'Notifications actives' : 'Notifications coupees'}
                size="small"
                sx={{
                  width: 'fit-content',
                  bgcolor: emailNotificationsEnabled ? '#eaf2ff' : '#f3f4f6',
                  color: emailNotificationsEnabled ? '#2563eb' : '#6b7280',
                  fontWeight: 700,
                }}
              />
            </Stack>
          </Paper>

          <Paper elevation={0} sx={sectionCardSx}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1.4} alignItems="center">
                <Box sx={iconBoxSx('rgba(124,58,237,0.10)', '#7c3aed')}>
                  <PersonOutlineRoundedIcon />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 800, color: '#1b2740', fontSize: '1rem' }}>
                    Profil de demonstration
                  </Typography>
                  <Typography sx={{ mt: 0.35, fontSize: '0.88rem', color: '#72809a' }}>
                    Permet de tester la restriction d'acces a la gestion des roles.
                  </Typography>
                </Box>
              </Stack>

              <Select value={connectedUserRole} onChange={handleConnectedRoleChange} size="small">
                <MenuItem value="DDRH">DDRH</MenuItem>
                <MenuItem value="Employeur">Employeur</MenuItem>
              </Select>

              <Select value={connectedUserEmail} onChange={handleConnectedEmailChange} size="small">
                {structureRecipients.map((recipient) => (
                  <MenuItem key={recipient.id} value={recipient.email}>
                    {recipient.manager} - {recipient.email}
                  </MenuItem>
                ))}
              </Select>

              <Chip
                label={`Profil courant : ${connectedUserRole}`}
                size="small"
                sx={{
                  width: 'fit-content',
                  bgcolor: connectedUserRole === 'DDRH' ? '#efe7ff' : '#eaf2ff',
                  color: connectedUserRole === 'DDRH' ? '#7c3aed' : '#2563eb',
                  fontWeight: 700,
                }}
              />

              <Chip
                label={`Utilisateur courant : ${connectedUserEmail}`}
                size="small"
                sx={{
                  width: 'fit-content',
                  bgcolor: '#eef2f7',
                  color: '#475569',
                  fontWeight: 700,
                }}
              />
            </Stack>
          </Paper>
        </Box>

        <Paper elevation={0} sx={sectionCardSx}>
          <Stack spacing={1.6}>
            <Stack direction="row" spacing={1.4} alignItems="center">
              <Box sx={iconBoxSx('rgba(249,115,22,0.10)', '#ea580c')}>
                <TuneRoundedIcon />
              </Box>

              <Box>
                <Typography sx={{ fontWeight: 800, color: '#1b2740', fontSize: '1rem' }}>
                  Notes front-end
                </Typography>
                <Typography sx={{ mt: 0.35, fontSize: '0.88rem', color: '#72809a' }}>
                  Ce bloc clarifie ce qui est deja pris en charge par le front et ce qui devra etre
                  branche plus tard avec le backend.
                </Typography>
              </Box>
            </Stack>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 1.4,
              }}
            >
              <Alert severity="success" sx={{ borderRadius: '14px' }}>
                Parcours front deja disponible : login, erreurs, blocage, 2FA par defaut,
                mot de passe oublie, reinitialisation.
              </Alert>

              <Alert severity="warning" sx={{ borderRadius: '14px' }}>
                A brancher plus tard : verification reelle du 2FA, expiration serveur, premier
                login et changement obligatoire du mot de passe.
              </Alert>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </MainLayout>
  )
}
