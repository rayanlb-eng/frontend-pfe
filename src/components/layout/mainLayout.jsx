import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './header'
import Sidebar from './sidebar'

const INACTIVITY_LIMIT_MS = 30 * 60 * 1000
const WARNING_COUNTDOWN_SECONDS = 60

export default function MainLayout({ children }) {
  const navigate = useNavigate()
  const warningTimerRef = useRef(null)
  const logoutTimerRef = useRef(null)
  const countdownIntervalRef = useRef(null)
  const [warningOpen, setWarningOpen] = useState(false)
  const [countdown, setCountdown] = useState(WARNING_COUNTDOWN_SECONDS)

  // Nettoie tous les timers pour éviter les doublons pendant la session.
  const clearTimers = useCallback(() => {
    window.clearTimeout(warningTimerRef.current)
    window.clearTimeout(logoutTimerRef.current)
    window.clearInterval(countdownIntervalRef.current)
  }, [])

  // Centralise la deconnexion manuelle et automatique.
  const logoutUser = useCallback(() => {
    clearTimers()
    setWarningOpen(false)
    localStorage.removeItem('isAuthenticated')
    sessionStorage.removeItem('pending2FA')
    navigate('/login', { replace: true })
  }, [clearTimers, navigate])

  // Relance le cycle d'inactivite: alerte au bout de 30 min puis logout si aucune action.
  const scheduleInactivityTimers = useCallback(() => {
    clearTimers()

    warningTimerRef.current = window.setTimeout(() => {
      setWarningOpen(true)
      setCountdown(WARNING_COUNTDOWN_SECONDS)

      countdownIntervalRef.current = window.setInterval(() => {
        setCountdown((currentValue) => {
          if (currentValue <= 1) {
            window.clearInterval(countdownIntervalRef.current)
            return 0
          }
          return currentValue - 1
        })
      }, 1000)

      logoutTimerRef.current = window.setTimeout(() => {
        logoutUser()
      }, WARNING_COUNTDOWN_SECONDS * 1000)
    }, INACTIVITY_LIMIT_MS)
  }, [clearTimers, logoutUser])

  useEffect(() => {
    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll']

    // Toute activite utilisateur relance le compteur tant que l'alerte n'est pas affichee.
    const handleUserActivity = () => {
      if (!warningOpen) {
        scheduleInactivityTimers()
      }
    }

    scheduleInactivityTimers()

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, handleUserActivity)
    })

    return () => {
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, handleUserActivity)
      })
      clearTimers()
    }
  }, [clearTimers, scheduleInactivityTimers, warningOpen])

  // L'utilisateur confirme qu'il veut garder sa session ouverte.
  const handleContinueSession = () => {
    setWarningOpen(false)
    setCountdown(WARNING_COUNTDOWN_SECONDS)
    scheduleInactivityTimers()
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #f3f7f4 0%, #eef5f0 45%, #f7faf8 100%)',
        }}
      >
        <Sidebar />

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            background: 'radial-gradient(circle at top right, rgba(0,166,81,0.05), transparent 22%)',
          }}
        >
          <Header />

          <Box
            component="main"
            sx={{
              flex: 1,
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 2.5, sm: 3, md: 4 },
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>

      <Dialog open={warningOpen} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          <Stack direction="row" spacing={1.1} alignItems="center">
            <WarningAmberRoundedIcon sx={{ color: '#d97706' }} />
            <Typography sx={{ fontWeight: 800 }}>Inactivite detectee</Typography>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <Typography sx={{ color: '#5f6f86', lineHeight: 1.6 }}>
            Votre session est inactive depuis 30 minutes. Si vous ne repondez pas, vous serez
            deconnecte automatiquement dans {countdown} seconde(s).
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={logoutUser}
            sx={{ textTransform: 'none', fontWeight: 700 }}
          >
            Se deconnecter
          </Button>
          <Button
            variant="contained"
            onClick={handleContinueSession}
            sx={{ textTransform: 'none', fontWeight: 700 }}
          >
            Continuer la session
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
