import { Box, Button, Chip, Paper } from '@mui/material'
import { useMemo, useState } from 'react'
import BrandHeader from '../../components/auth/Brandheader'
import PasswordField from '../../components/auth/PasswordField'

function ForceChangePasswordPage({ onSubmitSuccess }) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const rules = useMemo(
    () => [
      { label: '8 caractères minimum', valid: newPassword.length >= 8 },
      { label: '1 lettre majuscule', valid: /[A-Z]/.test(newPassword) },
      { label: '1 chiffre minimum', valid: /\d/.test(newPassword) },
      { label: 'Confirmation identique', valid: !!confirmPassword && newPassword === confirmPassword },
    ],
    [newPassword, confirmPassword]
  )

  const isFormValid = currentPassword.trim() && rules.every((rule) => rule.valid)

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!isFormValid) return

    onSubmitSuccess?.({
      currentPassword,
      newPassword,
      confirmPassword,
    })
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
        py: 1.5,
        background: `
          radial-gradient(circle at 80% 20%, rgba(255,255,255,0.12), transparent 20%),
          radial-gradient(circle at 15% 75%, rgba(255,255,255,0.08), transparent 18%),
          linear-gradient(135deg, #0A7C43 0%, #0B8E4B 45%, #086437 100%)
        `,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 620,
          p: { xs: 2, sm: 3 },
          borderRadius: '34px',
          background: 'rgba(242,247,243,0.96)',
          border: '1px solid rgba(255,255,255,0.35)',
          boxShadow: '0 30px 80px rgba(4, 48, 27, 0.22)',
          backdropFilter: 'blur(14px)',
        }}
      >
        <BrandHeader title="Renouveler votre mot de passe" subtitle="" />

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 1.5 }}>
          <PasswordField
            label="Mot de passe actuel"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            visible={showCurrentPassword}
            onToggle={() => setShowCurrentPassword((value) => !value)}
          />

          <PasswordField
            label="Nouveau mot de passe"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            visible={showNewPassword}
            onToggle={() => setShowNewPassword((value) => !value)}
          />

          <PasswordField
            label="Confirmer le nouveau mot de passe"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            visible={showConfirmPassword}
            onToggle={() => setShowConfirmPassword((value) => !value)}
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
            disabled={!isFormValid}
            sx={{
              mt: 1,
              width: { xs: '100%', sm: '80%' },
              mx: 'auto',
              borderRadius: '18px',
              py: 1.4,
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
            Enregistrer et continuer
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default ForceChangePasswordPage
