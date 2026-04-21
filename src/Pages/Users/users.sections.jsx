import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
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
  canManageRoles,
  onAddUser,
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
            onClick={onAddUser}
            disabled={!canManageRoles}
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

export function UserCard({
  user,
  canManageRoles,
  onEditRole,
  onRevokeAccess,
  onDeleteUser,
  onToggleMandatory2FA,
}) {
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
              {user.twoFactorRequired ? ' - Obligatoire' : ''}
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
            Modifier
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

          <Button
            variant="outlined"
            size="small"
            onClick={() => onToggleMandatory2FA(user)}
            disabled={!canManageRoles}
            sx={userSecondaryActionSx}
          >
            {user.twoFactorRequired ? "Retirer l'obligation 2FA" : 'Rendre 2FA obligatoire'}
          </Button>

          <Button
            variant="outlined"
            size="small"
            onClick={() => onDeleteUser(user)}
            disabled={!canManageRoles}
            sx={userSecondaryActionSx}
          >
            Supprimer
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

export function UserFormDialog({ open, initialUser, onClose, onSave }) {
  const [form, setForm] = useState({
    name: '',
    title: '',
    accessRole: 'Employeur',
    department: 'Formation',
    email: '',
    phone: '',
    status: 'Actif',
    twoFactorEnabled: false,
    twoFactorRequired: false,
    badgeColor: '#2563eb',
    avatar: 'U',
  })

  useEffect(() => {
    if (initialUser) {
      setForm(initialUser)
      return
    }

    setForm({
      name: '',
      title: '',
      accessRole: 'Employeur',
      department: 'Formation',
      email: '',
      phone: '',
      status: 'Actif',
      twoFactorEnabled: false,
      twoFactorRequired: false,
      badgeColor: '#2563eb',
      avatar: 'U',
    })
  }, [initialUser, open])

  const handleChange = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }))
  }

  const handleSubmit = () => {
    const trimmedName = form.name.trim()
    const trimmedEmail = form.email.trim()
    if (!trimmedName || !trimmedEmail) return

    onSave({
      ...form,
      name: trimmedName,
      email: trimmedEmail,
      twoFactorEnabled: form.twoFactorRequired ? true : form.twoFactorEnabled,
      badgeColor: form.accessRole === 'DDRH' ? '#7c3aed' : '#2563eb',
      avatar: trimmedName.charAt(0).toUpperCase(),
    })
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800 }}>
        {initialUser ? "Modifier l'utilisateur" : 'Ajouter un utilisateur'}
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Box
          sx={{
            mt: 0.4,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: 1.4,
          }}
        >
          <TextField
            label="Nom complet"
            value={form.name}
            onChange={(event) => handleChange('name', event.target.value)}
            fullWidth
          />
          <TextField
            label="Fonction"
            value={form.title}
            onChange={(event) => handleChange('title', event.target.value)}
            fullWidth
          />
          <TextField
            label="E-mail"
            value={form.email}
            onChange={(event) => handleChange('email', event.target.value)}
            fullWidth
          />
          <TextField
            label="Telephone"
            value={form.phone}
            onChange={(event) => handleChange('phone', event.target.value)}
            fullWidth
          />
          <TextField
            select
            label="Role"
            value={form.accessRole}
            onChange={(event) => handleChange('accessRole', event.target.value)}
            fullWidth
          >
            <MenuItem value="DDRH">DDRH</MenuItem>
            <MenuItem value="Employeur">Employeur</MenuItem>
          </TextField>
          <TextField
            label="Service"
            value={form.department}
            onChange={(event) => handleChange('department', event.target.value)}
            fullWidth
          />
          <TextField
            select
            label="Statut"
            value={form.status}
            onChange={(event) => handleChange('status', event.target.value)}
            fullWidth
          >
            <MenuItem value="Actif">Actif</MenuItem>
            <MenuItem value="En attente">En attente</MenuItem>
            <MenuItem value="Inactif">Inactif</MenuItem>
            <MenuItem value="Acces revoque">Acces revoque</MenuItem>
          </TextField>
          <TextField
            select
            label="2FA"
            value={form.twoFactorEnabled ? 'oui' : 'non'}
            onChange={(event) => handleChange('twoFactorEnabled', event.target.value === 'oui')}
            fullWidth
            disabled={form.twoFactorRequired}
          >
            <MenuItem value="oui">Activee</MenuItem>
            <MenuItem value="non">Desactivee</MenuItem>
          </TextField>
          <TextField
            select
            label="2FA obligatoire"
            value={form.twoFactorRequired ? 'oui' : 'non'}
            onChange={(event) => handleChange('twoFactorRequired', event.target.value === 'oui')}
            fullWidth
          >
            <MenuItem value="oui">Oui</MenuItem>
            <MenuItem value="non">Non</MenuItem>
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: 'none', fontWeight: 700 }}>
          Annuler
        </Button>
        <Button variant="contained" onClick={handleSubmit} sx={{ textTransform: 'none', fontWeight: 700 }}>
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export function UserDeleteDialog({ open, selectedUser, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 800 }}>Supprimer l'utilisateur</DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Typography sx={{ fontSize: '0.92rem', color: '#5f6f86', mt: 0.5 }}>
          Confirmer la suppression de <strong>{selectedUser?.name}</strong> ?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: 'none', fontWeight: 700 }}>
          Annuler
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteOutlineRoundedIcon />}
          onClick={onConfirm}
          sx={{ textTransform: 'none', fontWeight: 700 }}
        >
          Supprimer
        </Button>
      </DialogActions>
    </Dialog>
  )
}
