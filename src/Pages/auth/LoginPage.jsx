import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import LockClockRoundedIcon from '@mui/icons-material/LockClockRounded'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import BrandHeader from '../../components/auth/Brandheader'
import PasswordField from '../../components/auth/PasswordField'
import { inputSx } from '../../theme/authstyles'

const MAX_ATTEMPTS = 3
const BLOCK_DURATION_MS = 5 * 60 * 1000
const DEMO_EMAIL = 'admin@mobilis.dz'
const DEMO_PASSWORD = 'Mobilis123'
const TWO_FACTOR_STORAGE_KEY = 'twoFactorEnabled'

function formatRemainingTime(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [failedAttempts, setFailedAttempts] = useState(() => {
    const value = Number(localStorage.getItem('loginFailedAttempts'))
    return Number.isNaN(value) ? 0 : value
  })
  const [blockedUntil, setBlockedUntil] = useState(() => {
    const value = Number(localStorage.getItem('loginBlockedUntil'))
    return Number.isNaN(value) ? 0 : value
  })
  const [remainingMs, setRemainingMs] = useState(0)
  const navigate = useNavigate()

  const isBlocked = blockedUntil > Date.now()
  const isDisabled = !email.trim() || !password.trim() || loading || isBlocked

  useEffect(() => {
    if (!isBlocked) {
      setRemainingMs(0)
      if (blockedUntil) {
        localStorage.removeItem('loginBlockedUntil')
        localStorage.removeItem('loginFailedAttempts')
        setFailedAttempts(0)
        setBlockedUntil(0)
      }
      return
    }

    const updateRemaining = () => {
      const nextRemaining = blockedUntil - Date.now()
      if (nextRemaining <= 0) {
        setRemainingMs(0)
        setBlockedUntil(0)
        setFailedAttempts(0)
        localStorage.removeItem('loginBlockedUntil')
        localStorage.removeItem('loginFailedAttempts')
        return
      }
      setRemainingMs(nextRemaining)
    }

    updateRemaining()
    const intervalId = window.setInterval(updateRemaining, 1000)
    return () => window.clearInterval(intervalId)
  }, [blockedUntil, isBlocked])

  const attemptsLeft = useMemo(
    () => Math.max(0, MAX_ATTEMPTS - failedAttempts),
    [failedAttempts]
  )

  const handleFailedLogin = () => {
    const nextAttempts = failedAttempts + 1
    setFailedAttempts(nextAttempts)
    localStorage.setItem('loginFailedAttempts', String(nextAttempts))

    if (nextAttempts >= MAX_ATTEMPTS) {
      const nextBlockedUntil = Date.now() + BLOCK_DURATION_MS
      setBlockedUntil(nextBlockedUntil)
      localStorage.setItem('loginBlockedUntil', String(nextBlockedUntil))
      setError('Compte temporairement bloque apres 3 tentatives. Reessayez dans 5 minutes.')
      return
    }

    setError(
      `Utilisateur ou mot de passe incorrect. Il vous reste ${Math.max(0, MAX_ATTEMPTS - nextAttempts)} tentative(s).`
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isDisabled) return

    setLoading(true)
    setError('')

    await new Promise((resolve) => window.setTimeout(resolve, 900))

    const isValidCredentials =
      email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD

    if (!isValidCredentials) {
      setLoading(false)
      handleFailedLogin()
      return
    }

    setFailedAttempts(0)
    localStorage.removeItem('loginFailedAttempts')
    localStorage.removeItem('loginBlockedUntil')

    onLogin?.({
      email,
      password,
      rememberMe,
    })

    const isTwoFactorEnabled = localStorage.getItem(TWO_FACTOR_STORAGE_KEY) === 'true'

    if (!isTwoFactorEnabled) {
      localStorage.setItem('isAuthenticated', 'true')
      setLoading(false)
      navigate('/dashboard')
      return
    }

    sessionStorage.setItem(
      'pending2FA',
      JSON.stringify({
        email: email.trim(),
        rememberMe,
      })
    )

    setLoading(false)
    navigate('/login/2fa')
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 3,
        background: `
          radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12), transparent 22%),
          radial-gradient(circle at 80% 75%, rgba(255,255,255,0.10), transparent 18%),
          linear-gradient(135deg, #0A7C43 0%, #0B8E4B 45%, #086437 100%)
        `,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 560,
          p: { xs: 1.8, sm: 2.3 },
          borderRadius: '30px',
          background: 'rgba(242,247,243,0.96)',
          border: '1px solid rgba(255,255,255,0.35)',
          boxShadow: '0 30px 80px rgba(4, 48, 27, 0.22)',
          backdropFilter: 'blur(14px)',
        }}
      >
        <BrandHeader title="Connexion a la plateforme" subtitle="" />

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 1.6 }}>
          <Alert
            severity="info"
            sx={{
              borderRadius: '18px',
              alignItems: 'center',
              '& .MuiAlert-message': { width: '100%' },
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
              Demo frontend
            </Typography>
            <Typography sx={{ mt: 0.2, fontSize: '0.84rem' }}>
              Utilisateur: {DEMO_EMAIL} | Mot de passe: {DEMO_PASSWORD}
            </Typography>
          </Alert>

          {error ? (
            <Alert
              severity={isBlocked ? 'warning' : 'error'}
              icon={isBlocked ? <LockClockRoundedIcon /> : <ErrorOutlineRoundedIcon />}
              sx={{ borderRadius: '18px' }}
            >
              <Typography sx={{ fontSize: '0.88rem', fontWeight: 600 }}>{error}</Typography>
            </Alert>
          ) : null}

          {isBlocked ? (
            <Alert severity="warning" sx={{ borderRadius: '18px' }}>
              <Typography sx={{ fontSize: '0.88rem', fontWeight: 600 }}>
                Compte bloque temporairement. Temps restant: {formatRemainingTime(remainingMs)}
              </Typography>
            </Alert>
          ) : null}

          {!isBlocked && failedAttempts > 0 && !error.includes('incorrect') ? (
            <Alert severity="info" sx={{ borderRadius: '18px' }}>
              <Typography sx={{ fontSize: '0.88rem', fontWeight: 600 }}>
                Tentatives restantes: {attemptsLeft}
              </Typography>
            </Alert>
          ) : null}

          <TextField
            label="Adresse e-mail professionnelle"
            type="email"
            placeholder="nom.prenom@mobilis.dz"
            autoComplete="username"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={inputSx}
            disabled={loading || isBlocked}
          />

          <PasswordFieldWrapper
            password={password}
            setPassword={setPassword}
            disabled={loading || isBlocked}
          />

          <Box
            sx={{
              display: 'flex',
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              gap: 1.5,
              flexDirection: { xs: 'column', sm: 'row' },
              mt: 0.2,
            }}
          >
            <FormControlLabel
              sx={{ m: 0 }}
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading || isBlocked}
                  sx={{
                    color: '#00A651',
                    '&.Mui-checked': {
                      color: '#00A651',
                    },
                  }}
                />
              }
              label={
                <Typography sx={{ fontSize: '0.92rem', color: '#5D7367', fontWeight: 500 }}>
                  Se souvenir de moi
                </Typography>
              }
            />

            <Link
              component={RouterLink}
              to="/forgot-password"
              underline="none"
              sx={{
                color: '#008A46',
                fontWeight: 700,
                fontSize: '0.92rem',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: '#0B5E36',
                },
              }}
            >
              Mot de passe oublie ?
            </Link>
          </Box>

          <Button
            type="submit"
            disabled={isDisabled}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
            sx={{
              mt: 1,
              width: { xs: '100%', sm: '70%' },
              mx: 'auto',
              borderRadius: '18px',
              py: 1.7,
              fontWeight: 800,
              fontSize: '1rem',
              textTransform: 'none',
              color: '#fff',
              background: 'linear-gradient(135deg, #00A651 0%, #007A3D 100%)',
              boxShadow: '0 18px 34px rgba(0,166,81,0.28)',
              transition: 'all 0.22s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #00A651 0%, #007A3D 100%)',
                boxShadow: '0 22px 40px rgba(0,166,81,0.34)',
                transform: 'translateY(-2px)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
              '&.Mui-disabled': {
                color: 'rgba(255,255,255,0.75)',
                background: 'linear-gradient(135deg, #71C89B 0%, #4FA777 100%)',
              },
            }}
          >
            {loading ? 'Verification...' : 'Se connecter'}
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

function PasswordFieldWrapper({ password, setPassword, disabled }) {
  const [visible, setVisible] = useState(false)

  return (
    <PasswordField
      label="Mot de passe"
      value={password}
      onChange={(event) => setPassword(event.target.value)}
      visible={visible}
      onToggle={() => setVisible((value) => !value)}
      disabled={disabled}
    />
  )
}

export default LoginPage
