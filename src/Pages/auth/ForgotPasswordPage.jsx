import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import MarkEmailReadRoundedIcon from '@mui/icons-material/MarkEmailReadRounded'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import BrandHeader from '../../components/auth/Brandheader'
import { initialUsers } from '../Users/users.data'
import { inputSx } from '../../theme/authstyles'

const DEMO_ACCOUNTS = [
  {
    identifier: 'admin',
    email: 'admin@mobilis.dz',
  },
  ...initialUsers.map((user) => ({
    identifier: user.email.split('@')[0],
    email: user.email,
  })),
]

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('')
  const [sentToEmail, setSentToEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const isDisabled = !identifier.trim() || loading

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isDisabled) return

    setLoading(true)
    setError('')
    setSuccess(false)

    await new Promise((resolve) => window.setTimeout(resolve, 900))

    const normalizedIdentifier = identifier.trim().toLowerCase()
    const matchedAccount = DEMO_ACCOUNTS.find(
      (account) =>
        account.email.toLowerCase() === normalizedIdentifier ||
        account.identifier.toLowerCase() === normalizedIdentifier
    )

    if (!matchedAccount) {
      setLoading(false)
      setError("Le compte n'existe pas ou n'est pas reconnu.")
      return
    }

    setSentToEmail(matchedAccount.email)
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
          maxWidth: 560,
          p: { xs: 2, sm: 2.5 },
          borderRadius: '30px',
          background: 'rgba(242,247,243,0.96)',
          border: '1px solid rgba(255,255,255,0.35)',
          boxShadow: '0 30px 80px rgba(4, 48, 27, 0.22)',
          backdropFilter: 'blur(14px)',
        }}
      >
        <BrandHeader
          title="Mot de passe oublie"
          subtitle="Saisissez votre adresse utilisateur pour recevoir un lien de reinitialisation."
        />

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 1.6 }}>
          <Alert severity="info" sx={{ borderRadius: '18px' }}>
            Demo frontend : utilisez `admin`, `admin@mobilis.dz`, `k.ziani` ou `k.ziani@mobilis.dz`
          </Alert>

          {error ? (
            <Alert severity="error" sx={{ borderRadius: '18px' }}>
              <Typography sx={{ fontSize: '0.88rem', fontWeight: 600 }}>{error}</Typography>
            </Alert>
          ) : null}

          {success ? (
            <Alert
              icon={<MarkEmailReadRoundedIcon fontSize="inherit" />}
              severity="success"
              sx={{ borderRadius: '18px' }}
            >
              <Typography sx={{ fontSize: '0.88rem', fontWeight: 600 }}>
                Un lien temporaire de reinitialisation a ete envoye a {sentToEmail}.
              </Typography>
              <Typography sx={{ mt: 0.35, fontSize: '0.82rem' }}>
                Pour la demo front, ouvrez directement le lien de test.
              </Typography>
            </Alert>
          ) : null}

          <TextField
            label="Nom d'utilisateur ou e-mail"
            type="text"
            placeholder="admin ou nom.prenom@mobilis.dz"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            fullWidth
            sx={inputSx}
            disabled={loading}
            InputProps={{
              startAdornment: <EmailOutlinedIcon sx={{ color: '#8aa095', mr: 1 }} />,
            }}
          />

          <Button
            type="submit"
            disabled={isDisabled}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
            sx={{
              mt: 0.8,
              width: { xs: '100%', sm: '72%' },
              mx: 'auto',
              borderRadius: '18px',
              py: 1.55,
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
            {loading ? 'Envoi du lien...' : 'Envoyer le lien'}
          </Button>

          {success ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.2, flexWrap: 'wrap' }}>
              <Button
                component={RouterLink}
                to="/reset-password/demo-token"
                variant="outlined"
                sx={{
                  borderRadius: '14px',
                  textTransform: 'none',
                  fontWeight: 700,
                }}
              >
                Lien de demo valide
              </Button>

              <Button
                component={RouterLink}
                to="/reset-password/expired"
                variant="outlined"
                sx={{
                  borderRadius: '14px',
                  textTransform: 'none',
                  fontWeight: 700,
                }}
              >
                Tester lien expire
              </Button>
            </Box>
          ) : null}

          <Button
            component={RouterLink}
            to="/login"
            variant="text"
            sx={{
              width: 'fit-content',
              mx: 'auto',
              textTransform: 'none',
              fontWeight: 700,
              color: '#007A3D',
            }}
          >
            Retour a la connexion
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}
