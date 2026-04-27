import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BrandHeader from '../../components/auth/Brandheader'
import { TRUSTED_2FA_DEVICES_KEY } from '../Users/users.data'
import { inputSx } from '../../theme/authstyles'

const MAX_2FA_ATTEMPTS = 3
const INITIAL_DEMO_OTP = '123456'

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export default function TwoFactorPage() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resent, setResent] = useState(false)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [requiresNewCode, setRequiresNewCode] = useState(false)
  const [lostAccessHelp, setLostAccessHelp] = useState(false)
  const [rememberDevice, setRememberDevice] = useState(false)
  const [currentOtp, setCurrentOtp] = useState(INITIAL_DEMO_OTP)
  const pendingAuth = useMemo(() => {
    const raw = sessionStorage.getItem('pending2FA')
    return raw ? JSON.parse(raw) : null
  }, [])

  const isMandatoryProfile = Boolean(pendingAuth?.twoFactorRequired)

  useEffect(() => {
    if (!pendingAuth) {
      navigate('/login', { replace: true })
    }
  }, [navigate, pendingAuth])

  const isDisabled = !code.trim() || loading || requiresNewCode

  // Valide le code courant et memorise l'appareil uniquement si le profil l'autorise.
  const handleVerify = async (event) => {
    event.preventDefault()
    if (isDisabled) return

    setLoading(true)
    setError('')

    await new Promise((resolve) => window.setTimeout(resolve, 800))

    if (code.trim() !== currentOtp) {
      const nextFailedAttempts = failedAttempts + 1
      setFailedAttempts(nextFailedAttempts)
      setLoading(false)
      if (nextFailedAttempts >= MAX_2FA_ATTEMPTS) {
        setRequiresNewCode(true)
        setError('Trois codes incorrects ont ete saisis. Un nouveau code doit etre genere.')
        return
      }
      setError(
        `Code temporaire invalide. Il vous reste ${MAX_2FA_ATTEMPTS - nextFailedAttempts} tentative(s).`
      )
      return
    }

    if (rememberDevice && !isMandatoryProfile) {
      const trustedDevices = JSON.parse(localStorage.getItem(TRUSTED_2FA_DEVICES_KEY) || '{}')
      trustedDevices[pendingAuth.email] = true
      localStorage.setItem(TRUSTED_2FA_DEVICES_KEY, JSON.stringify(trustedDevices))
    }

    localStorage.setItem('isAuthenticated', 'true')
    sessionStorage.removeItem('pending2FA')
    setLoading(false)
    navigate('/dashboard', { replace: true })
  }

  // Regenere un code temporaire et reinitialise le compteur d'erreurs.
  const handleResend = async () => {
    setResent(false)
    setLoading(true)
    setError('')
    await new Promise((resolve) => window.setTimeout(resolve, 700))
    setCurrentOtp(generateOtp())
    setFailedAttempts(0)
    setRequiresNewCode(false)
    setCode('')
    setLoading(false)
    setResent(true)
  }

  if (!pendingAuth) {
    return null
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
          maxWidth: 580,
          p: { xs: 2, sm: 3 },
          borderRadius: '34px',
          background: 'rgba(242,247,243,0.96)',
          border: '1px solid rgba(255,255,255,0.35)',
          boxShadow: '0 30px 80px rgba(4, 48, 27, 0.22)',
          backdropFilter: 'blur(14px)',
        }}
      >
        <BrandHeader title="Verification a double facteur" subtitle="" />

        <Box sx={{ display: 'grid', gap: 2 }}>
          <Alert icon={<LockOutlinedIcon fontSize="inherit" />} severity="info" sx={{ borderRadius: '18px' }}>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
              Un code temporaire a ete envoye a {pendingAuth.email}
            </Typography>
            <Typography sx={{ mt: 0.25, fontSize: '0.84rem' }}>
              Demo frontend : utilisez le code {currentOtp}
            </Typography>
          </Alert>

          {isMandatoryProfile ? (
            <Alert severity="warning" sx={{ borderRadius: '18px' }}>
              <Typography sx={{ fontSize: '0.88rem', fontWeight: 600 }}>
                Le 2FA est obligatoire pour ce profil. La memorisation de l&apos;appareil n&apos;est
                pas disponible.
              </Typography>
            </Alert>
          ) : null}

          {!requiresNewCode && failedAttempts > 0 ? (
            <Alert severity="warning" sx={{ borderRadius: '18px' }}>
              <Typography sx={{ fontSize: '0.88rem', fontWeight: 600 }}>
                Tentatives restantes : {MAX_2FA_ATTEMPTS - failedAttempts}
              </Typography>
            </Alert>
          ) : null}

          {error ? (
            <Alert severity="error" sx={{ borderRadius: '18px' }}>
              <Typography sx={{ fontSize: '0.88rem', fontWeight: 600 }}>{error}</Typography>
            </Alert>
          ) : null}

          {resent ? (
            <Alert severity="success" sx={{ borderRadius: '18px' }}>
              <Typography sx={{ fontSize: '0.88rem', fontWeight: 600 }}>
                Un nouveau code a ete renvoye.
              </Typography>
            </Alert>
          ) : null}

          {lostAccessHelp ? (
            <Alert
              severity="warning"
              icon={<WarningAmberRoundedIcon fontSize="inherit" />}
              sx={{ borderRadius: '18px' }}
            >
              <Typography sx={{ fontSize: '0.88rem', fontWeight: 600 }}>
                Si vous avez perdu l&apos;acces a votre telephone ou a votre e-mail, contactez
                l&apos;administrateur DDRH. Il pourra desactiver temporairement le 2FA.
              </Typography>
            </Alert>
          ) : null}

          <Box component="form" onSubmit={handleVerify} sx={{ display: 'grid', gap: 2 }}>
            <TextField
              label="Code temporaire"
              placeholder="Saisir le code a 6 chiffres"
              fullWidth
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
              sx={inputSx}
              disabled={loading}
            />

            <FormControlLabel
              sx={{ m: 0 }}
              control={
                <Checkbox
                  checked={rememberDevice}
                  onChange={(event) => setRememberDevice(event.target.checked)}
                  disabled={loading || isMandatoryProfile}
                  sx={{
                    color: '#00A651',
                    '&.Mui-checked': {
                      color: '#00A651',
                    },
                  }}
                />
              }
              label={
                <Typography sx={{ fontSize: '0.9rem', color: '#5D7367', fontWeight: 500 }}>
                  {isMandatoryProfile
                    ? "Memorisation indisponible pour ce profil"
                    : 'Se souvenir de moi sur cet appareil'}
                </Typography>
              }
            />

            <Button
              type="submit"
              disabled={isDisabled}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
              sx={{
                mt: 0.5,
                width: { xs: '100%', sm: '72%' },
                mx: 'auto',
                borderRadius: '18px',
                py: 1.6,
                fontWeight: 800,
                fontSize: '1rem',
                textTransform: 'none',
                color: '#fff',
                background: 'linear-gradient(135deg, #00A651 0%, #007A3D 100%)',
                boxShadow: '0 18px 34px rgba(0,166,81,0.28)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #00A651 0%, #007A3D 100%)',
                },
                '&.Mui-disabled': {
                  color: 'rgba(255,255,255,0.75)',
                  background: 'linear-gradient(135deg, #71C89B 0%, #4FA777 100%)',
                },
              }}
            >
              {loading ? 'Verification...' : 'Verifier le code'}
            </Button>
          </Box>

          <Button
            type="button"
            variant="text"
            startIcon={<ReplayRoundedIcon />}
            onClick={handleResend}
            disabled={loading}
            sx={{
              width: 'fit-content',
              mx: 'auto',
              textTransform: 'none',
              fontWeight: 700,
              color: '#007A3D',
            }}
          >
            Renvoyer le code
          </Button>

          <Button
            type="button"
            variant="text"
            onClick={() => setLostAccessHelp((value) => !value)}
            sx={{
              width: 'fit-content',
              mx: 'auto',
              textTransform: 'none',
              fontWeight: 700,
              color: '#6b7280',
            }}
          >
            Je n&apos;ai plus acces a mon dispositif 2FA
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}
