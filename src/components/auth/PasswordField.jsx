import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import { IconButton, InputAdornment, TextField } from '@mui/material'
import { inputSx } from '../../theme/authstyles'

function PasswordField({ label, value, onChange, visible, onToggle, disabled = false }) {
  const canToggleVisibility = !disabled && value.length > 0

  const endAdornment = (
    <InputAdornment position="end">
      <IconButton
        onClick={onToggle}
        onMouseDown={(event) => event.preventDefault()}
        edge="end"
        disabled={!canToggleVisibility}
        aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
        sx={{
          color: canToggleVisibility ? '#00A651' : '#9FB6A8',
          '&:hover': {
            background: canToggleVisibility
              ? 'rgba(0,166,81,0.14)'
              : 'rgba(160,180,170,0.08)',
          },
          '& svg': {
            fontSize: 20,
          },
          '&.Mui-disabled': {
            color: '#9FB6A8',
          },
        }}
      >
        {visible ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
      </IconButton>
    </InputAdornment>
  )

  return (
    <TextField
      label={label}
      type={visible ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      disabled={disabled}
      fullWidth
      variant="outlined"
      sx={inputSx}
      slotProps={{
        input: {
          endAdornment,
        },
      }}
    />
  )
}

export default PasswordField
