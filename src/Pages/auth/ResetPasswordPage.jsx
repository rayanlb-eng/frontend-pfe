import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import LinkOffRoundedIcon from '@mui/icons-material/LinkOffRounded'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import BrandHeader from '../../components/auth/Brandheader'
import PasswordField from '../../components/auth/PasswordField'

export default function ResetPasswordPage() {
  const { token } = useParams()
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const isExpired = token === 'expired'

  // Calcule en direct les regles de securite du nouveau mot de passe.
  const rules = useMemo(
    () => [
      { label: '8 caracteres minimum', valid: newPassword.length >= 8 },
      { label: '1 lettre majuscule', valid: /[A-Z]/.test(newPassword) },
      { label: '1 chiffre minimum', valid: /\d/.test(newPassword) },
      { label: '1 symbole minimum', valid: /[^A-Za-z0-9]/.test(newPassword) },
      {
        label: 'Confirmation identique',
        valid: !!confirmPassword && newPassword === confirmPassword,
      },
    ],
    [newPassword, confirmPassword]
  )

  const isFormValid = rules.every((rule) => rule.valid)

  // Simule la reinitialisation apres validation des regles et du token temporaire.
  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!isFormValid || isExpired || loading) return

    setLoading(true)
    setError('')

    await new Promise((resolve) => window.setTimeout(resolve, 900))

    setLoading(false)
    setSuccess(true)
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
          maxWidth: 590,
          p: { xs: 2, sm: 2.6 },
          borderRadius: '30px',
          background: 'rgba(242,247,243,0.96)',
          border: '1px solid rgba(255,255,255,0.35)',
          boxShadow: '0 30px 80px rgba(4, 48, 27, 0.22)',
          backdropFilter: 'blur(14px)',
        }}
      >
        <BrandHeader
          title="Reinitialiser le mot de passe"
          subtitle="Choisissez un nouveau mot de passe securise pour votre compte."
        />

        <Box sx={{ display: 'grid', gap: 1.6 }}>
          {isExpired ? (
            <Alert
              severity="error"
              icon={<LinkOffRoundedIcon fontSize="inherit" />}
              sx={{ borderRadius: '18px' }}
            >
              <Typography sx={{ fontSize: '0.88rem', fontWeight: 600 }}>
                Le lien de reinitialisation a expire. Veuillez refaire la demande.
              </Typography>
            </Alert>
          ) : null}

          {error ? (
            <Alert severity="error" sx={{ borderRadius: '18px' }}>
              <Typography sx={{ fontSize: '0.88rem', fontWeight: 600 }}>{error}</Typography>
            </Alert>
          ) : null}

          {success ? (
            <Alert
              severity="success"
              icon={<CheckCircleRoundedIcon fontSize="inherit" />}
              sx={{ borderRadius: '18px' }}
            >
              <Typography sx={{ fontSize: '0.88rem', fontWeight: 600 }}>
                Votre nouveau mot de passe a ete enregistre avec succes.
              </Typography>
            </Alert>
          ) : null}

          {!success && !isExpired ? (
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 1.5 }}>
              <PasswordField
                label="Nouveau mot de passe"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                visible={showNewPassword}
                onToggle={() => setShowNewPassword((value) => !value)}
                disabled={loading}
              />

              <PasswordField
                label="Confirmer le nouveau mot de passe"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                visible={showConfirmPassword}
                onToggle={() => setShowConfirmPassword((value) => !value)}
                disabled={loading}
              />

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {rules.map((rule) => (
                  <Chip
                    key={rule.label}
                    label={rule.label}
                    sx={{
                      borderRadius: '999px',
                      px: 0.3,
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: rule.valid ? '#0B5E36' : '#5D7367',
                      background: rule.valid
                        ? 'linear-gradient(180deg, #DDF7E7, #F5FFF8)'
                        : 'linear-gradient(180deg, #EDF3EE, #F7FAF8)',
                      border: rule.valid
                        ? '1px solid rgba(0,166,81,0.22)'
                        : '1px solid rgba(160,180,170,0.22)',
                    }}
                  />
                ))}
              </Box>

              <Button
                type="submit"
                disabled={!isFormValid || loading}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
                sx={{
                  mt: 1,
                  width: { xs: '100%', sm: '80%' },
                  mx: 'auto',
                  borderRadius: '18px',
                  py: 1.5,
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
                {loading ? 'Enregistrement...' : 'Enregistrer le nouveau mot de passe'}
              </Button>
            </Box>
          ) : null}

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.2, flexWrap: 'wrap' }}>
            {isExpired ? (
              <Button
                component={RouterLink}
                to="/forgot-password"
                variant="contained"
                sx={{
                  borderRadius: '14px',
                  textTransform: 'none',
                  fontWeight: 700,
                }}
              >
                Redemander un lien
              </Button>
            ) : null}

            {success ? (
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                sx={{
                  borderRadius: '14px',
                  textTransform: 'none',
                  fontWeight: 700,
                }}
              >
                Retour a la connexion
              </Button>
            ) : (
              <Button
                component={RouterLink}
                to="/login"
                variant="text"
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  color: '#007A3D',
                }}
              >
                Retour a la connexion
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}
