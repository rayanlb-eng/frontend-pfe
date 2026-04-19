import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded'
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import {
  actionButtonsSx,
  controlSx,
  filtersRowSx,
  primaryButtonSx,
  searchBoxSx,
  secondaryButtonSx,
  statCardSx,
  statIconWrapSx,
  statSubtitleSx,
  statsGridSx,
  statTitleSx,
  statValueSx,
  toolbarTopRowSx,
  toolbarWrapSx,
  userAvatarSx,
  userCardSx,
  userPrimaryActionSx,
  userSecondaryActionSx,
  userStatusChipSx,
} from './users.styles'

export function UsersStatsGrid({ stats }) {
  return (
    <Box sx={statsGridSx}>
      {stats.map(({ title, value, subtitle, background, Icon }) => (
        <Paper key={title} elevation={0} sx={statCardSx(background)}>
          <Box sx={statIconWrapSx}>
            <Icon />
          </Box>

          <Typography sx={statTitleSx}>{title}</Typography>
          <Typography sx={statValueSx}>{value}</Typography>
          <Typography sx={statSubtitleSx}>{subtitle}</Typography>
        </Paper>
      ))}
    </Box>
  )
}

export function UsersToolbar({
  filters,
  searchTerm,
  selectedRole,
  selectedStatus,
  selectedDepartment,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onDepartmentChange,
}) {
  return (
    <Stack {...toolbarWrapSx}>
      <Stack {...toolbarTopRowSx}>
        <Box sx={searchBoxSx}>
          <SearchRoundedIcon sx={{ color: '#8a97ad', fontSize: 20 }} />
          <TextField
            variant="standard"
            placeholder="Rechercher un utilisateur..."
            fullWidth
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            InputProps={{ disableUnderline: true }}
          />
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} sx={actionButtonsSx}>
          <Button variant="outlined" size="small" sx={secondaryButtonSx}>
            Exporter la liste
          </Button>

          <Button
            variant="contained"
            size="small"
            startIcon={<PersonAddAlt1RoundedIcon />}
            sx={primaryButtonSx}
          >
            Nouvel utilisateur
          </Button>
        </Stack>
      </Stack>

      <Stack {...filtersRowSx}>
        <TextField
          select
          fullWidth
          value={selectedRole}
          onChange={(event) => onRoleChange(event.target.value)}
          size="small"
          sx={controlSx}
        >
          {filters.roles.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          value={selectedStatus}
          onChange={(event) => onStatusChange(event.target.value)}
          size="small"
          sx={controlSx}
        >
          {filters.status.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          value={selectedDepartment}
          onChange={(event) => onDepartmentChange(event.target.value)}
          size="small"
          sx={controlSx}
        >
          {filters.department.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    </Stack>
  )
}

export function UserCard({ user, canManageRoles, onEditRole, onRevokeAccess }) {
  return (
    <Paper elevation={0} sx={userCardSx}>
      <Stack spacing={1.4}>
        <Stack direction="row" spacing={1.3} alignItems="center">
          <Avatar sx={userAvatarSx(user.badgeColor)}>{user.avatar}</Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontWeight: 800,
                color: '#1b2740',
                fontSize: '1rem',
              }}
            >
              {user.name}
            </Typography>
            <Typography
              sx={{
                mt: 0.2,
                fontSize: '0.86rem',
                color: '#6f7d95',
              }}
            >
              {user.title}
            </Typography>
            <Typography
              sx={{
                mt: 0.25,
                fontSize: '0.82rem',
                color: '#7c8797',
                fontWeight: 700,
              }}
            >
              Role: {user.accessRole} - {user.department}
            </Typography>
            <Typography
              sx={{
                mt: 0.2,
                fontSize: '0.8rem',
                color: user.twoFactorEnabled ? '#1d8e63' : '#8a97ad',
                fontWeight: 700,
              }}
            >
              2FA: {user.twoFactorEnabled ? 'Activee' : 'Desactivee'}
            </Typography>
          </Box>

          <Chip label={user.status} size="small" sx={userStatusChipSx(user.badgeColor)} />
        </Stack>

        <Stack spacing={0.8}>
          <Stack direction="row" spacing={1} alignItems="center">
            <MailOutlineRoundedIcon sx={{ fontSize: 18, color: '#8a97ad' }} />
            <Typography sx={{ fontSize: '0.9rem', color: '#445169' }}>
              {user.email}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <PhoneRoundedIcon sx={{ fontSize: 18, color: '#8a97ad' }} />
            <Typography sx={{ fontSize: '0.9rem', color: '#445169' }}>
              {user.phone}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Button
            variant="contained"
            size="small"
            onClick={() => onEditRole(user)}
            disabled={!canManageRoles}
            sx={userPrimaryActionSx(user.badgeColor)}
          >
            Modifier le role
          </Button>

          <Button
            variant="outlined"
            size="small"
            onClick={() => onRevokeAccess(user)}
            disabled={!canManageRoles || user.status === 'Acces revoque'}
            sx={userSecondaryActionSx}
          >
            Revoquer l'acces
          </Button>

          <Button
            variant="outlined"
            size="small"
            onClick={() => onRevokeAccess(user, 'twoFactor')}
            disabled={!canManageRoles || !user.twoFactorEnabled}
            sx={userSecondaryActionSx}
          >
            Desactiver 2FA
          </Button>
        </Stack>
      </Stack>
    </Paper>
  )
}

export function UserRoleDialog({ open, selectedUser, onClose, onSave }) {
  const [role, setRole] = useState(selectedUser?.accessRole || 'Employeur')

  useEffect(() => {
    setRole(selectedUser?.accessRole || 'Employeur')
  }, [selectedUser])

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 800 }}>Modifier le role</DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={1.6} sx={{ mt: 0.4 }}>
          <Typography sx={{ fontSize: '0.9rem', color: '#5f6f86' }}>
            Utilisateur selectionne : <strong>{selectedUser?.name}</strong>
          </Typography>

          <TextField
            select
            fullWidth
            label="Nouveau role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            <MenuItem value="DDRH">DDRH</MenuItem>
            <MenuItem value="Employeur">Employeur</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: 'none', fontWeight: 700 }}>
          Annuler
        </Button>
        <Button
          variant="contained"
          onClick={() => onSave(role)}
          sx={{ textTransform: 'none', fontWeight: 700 }}
        >
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  )
}
