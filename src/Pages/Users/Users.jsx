import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded'
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import {
  Alert,
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
import { createElement } from 'react'
import { useEffect, useMemo, useState } from 'react'
import MainLayout from '../../components/layout/mainLayout'
import {
  actionButtonsSx,
  CONNECTED_USER_ROLE_KEY,
  contentPaperSx,
  controlSx,
  filters,
  getStoredUsers,
  primaryButtonSx,
  saveUsers,
  searchBoxSx,
  secondaryButtonSx,
  statCardSx,
  statIconWrapSx,
  stats,
  statsGridSx,
  statSubtitleSx,
  statTitleSx,
  statValueSx,
  toolbarTopRowSx,
  toolbarWrapSx,
  userAvatarSx,
  userCardSx,
  userPrimaryActionSx,
  userSecondaryActionSx,
  userStatusChipSx,
  usersGridSx,
  filtersRowSx,
} from './users.data'

export default function Users() {
  const [users, setUsers] = useState(getStoredUsers())
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState(filters.roles[0])
  const [selectedStatus, setSelectedStatus] = useState(filters.status[0])
  const [selectedDepartment, setSelectedDepartment] = useState(filters.department[0])
  const [feedback, setFeedback] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [connectedUserRole] = useState(
    () => localStorage.getItem(CONNECTED_USER_ROLE_KEY) || 'DDRH'
  )

  useEffect(() => {
    saveUsers(users)
  }, [users])

  const canManageRoles = connectedUserRole === 'DDRH'

  // Filtre la liste selon la recherche et les criteres choisis dans la toolbar.
  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return users.filter((user) => {
      const matchesSearch =
        !normalizedSearch ||
        user.name.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch)

      const matchesRole =
        selectedRole === filters.roles[0] || user.accessRole === selectedRole

      const matchesStatus =
        selectedStatus === filters.status[0] || user.status === selectedStatus

      const matchesDepartment =
        selectedDepartment === filters.department[0] || user.department === selectedDepartment

      return matchesSearch && matchesRole && matchesStatus && matchesDepartment
    })
  }, [users, searchTerm, selectedRole, selectedStatus, selectedDepartment])

  const passiveFeedback = useMemo(() => {
    if (!canManageRoles) {
      return "Acces refuse : seul un profil DDRH peut gerer les roles et permissions."
    }

    if (
      (searchTerm.trim() ||
        selectedRole !== filters.roles[0] ||
        selectedStatus !== filters.status[0] ||
        selectedDepartment !== filters.department[0]) &&
      filteredUsers.length === 0
    ) {
      return 'Utilisateur introuvable ou aucun resultat pour les filtres selectionnes.'
    }

    return ''
  }, [
    canManageRoles,
    filteredUsers.length,
    searchTerm,
    selectedDepartment,
    selectedRole,
    selectedStatus,
  ])

  const handleOpenAddUser = () => {
    if (!canManageRoles) return
    setSelectedUser(null)
    setFormDialogOpen(true)
  }

  const handleOpenEditUser = (user) => {
    if (!canManageRoles) return
    setSelectedUser(user)
    setFormDialogOpen(true)
  }

  // Ouvre la modale de creation ou d'edition selon l'utilisateur selectionne.
  const handleSaveUser = (nextUser) => {
    setUsers((currentUsers) => {
      const exists = selectedUser
        ? currentUsers.some((user) => user.email === selectedUser.email)
        : currentUsers.some((user) => user.email === nextUser.email)

      if (!exists) {
        return [...currentUsers, nextUser]
      }

      return currentUsers.map((user) =>
        user.email === selectedUser.email ? { ...nextUser } : user
      )
    })

    setFeedback(
      selectedUser
        ? `Les informations de ${nextUser.name} ont ete mises a jour.`
        : `Le nouvel utilisateur ${nextUser.name} a ete ajoute.`
    )
    setFormDialogOpen(false)
    setSelectedUser(null)
  }

  const handleOpenDeleteUser = (user) => {
    if (!canManageRoles) return
    setSelectedUser(user)
    setDeleteDialogOpen(true)
  }

  const handleDeleteUser = () => {
    if (!selectedUser) return
    setUsers((currentUsers) => currentUsers.filter((user) => user.email !== selectedUser.email))
    setFeedback(`${selectedUser.name} a ete supprime de la liste des utilisateurs.`)
    setDeleteDialogOpen(false)
    setSelectedUser(null)
  }

  // Revoque uniquement l'acces global du compte.
  const handleRevokeAccess = (userToUpdate) => {
    if (!canManageRoles) return

    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.email === userToUpdate.email
          ? {
              ...user,
              status: 'Acces revoque',
              badgeColor: '#db5c74',
            }
          : user
      )
    )
    setFeedback(`L'acces de ${userToUpdate.name} a ete revoque.`)
  }

  // Permet a la DDRH de rendre le 2FA obligatoire pour un profil sensible.
  const handleToggleMandatory2FA = (userToUpdate) => {
    if (!canManageRoles) return

    const nextRequiredState = !userToUpdate.twoFactorRequired

    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.email === userToUpdate.email
          ? {
              ...user,
              twoFactorRequired: nextRequiredState,
            }
          : user
      )
    )

    setFeedback(
      nextRequiredState
        ? `Le 2FA est maintenant obligatoire pour ${userToUpdate.name}.`
        : `Le caractere obligatoire du 2FA a ete retire pour ${userToUpdate.name}.`
    )
  }

  return (
    <MainLayout>
      <Box sx={{ display: 'grid', gap: 3 }}>
        <UsersStatsGrid stats={stats} />

        <Paper elevation={0} sx={contentPaperSx}>
          <Stack spacing={2}>
            <UsersToolbar
              filters={filters}
              searchTerm={searchTerm}
              selectedRole={selectedRole}
              selectedStatus={selectedStatus}
              selectedDepartment={selectedDepartment}
              onSearchChange={setSearchTerm}
              onRoleChange={setSelectedRole}
              onStatusChange={setSelectedStatus}
              onDepartmentChange={setSelectedDepartment}
              canManageRoles={canManageRoles}
              onAddUser={handleOpenAddUser}
            />

            <Alert severity={canManageRoles ? 'info' : 'error'} sx={{ borderRadius: '14px' }}>
              Profil connecte : <strong>{connectedUserRole}</strong>.{' '}
              {canManageRoles
                ? 'Vous pouvez modifier les roles et revoquer les acces.'
                : "Le systeme refuse l'acces a la gestion des roles pour un employeur."}
            </Alert>

            {feedback || passiveFeedback ? (
              <Alert
                severity={
                  (feedback || passiveFeedback).includes('introuvable') ||
                  (feedback || passiveFeedback).includes('Acces refuse')
                    ? 'error'
                    : 'success'
                }
                sx={{ borderRadius: '14px' }}
              >
                {feedback || passiveFeedback}
              </Alert>
            ) : null}

            {filteredUsers.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  border: '1px dashed #d6dfeb',
                  background: '#fbfcff',
                  textAlign: 'center',
                }}
              >
                <Typography sx={{ fontWeight: 800, color: '#1b2740' }}>
                  Aucun utilisateur trouve.
                </Typography>
                <Typography sx={{ mt: 0.5, fontSize: '0.9rem', color: '#72809a' }}>
                  Essayez un autre nom, un autre role ou un autre filtre.
                </Typography>
              </Paper>
            ) : (
              <Box sx={usersGridSx}>
                {filteredUsers.map((user) => (
                  <UserCard
                    key={user.email}
                    user={user}
                    canManageRoles={canManageRoles}
                    onEditUser={handleOpenEditUser}
                    onRevokeAccess={handleRevokeAccess}
                    onToggleMandatory2FA={handleToggleMandatory2FA}
                    onDeleteUser={handleOpenDeleteUser}
                  />
                ))}
              </Box>
            )}

            <UserFormDialog
              key={selectedUser?.email || 'new-user'}
              open={formDialogOpen}
              initialUser={selectedUser}
              onClose={() => {
                setFormDialogOpen(false)
                setSelectedUser(null)
              }}
              onSave={handleSaveUser}
            />

            <UserDeleteDialog
              open={deleteDialogOpen}
              selectedUser={selectedUser}
              onClose={() => {
                setDeleteDialogOpen(false)
                setSelectedUser(null)
              }}
              onConfirm={handleDeleteUser}
            />
          </Stack>
        </Paper>
      </Box>
    </MainLayout>
  )
}

function UsersStatsGrid({ stats }) {
  return (
    <Box sx={statsGridSx}>
      {stats.map(({ title, value, subtitle, background, Icon }) => (
        <Paper key={title} elevation={0} sx={statCardSx(background)}>
          <Box sx={statIconWrapSx}>
            {createElement(Icon)}
          </Box>

          <Typography sx={statTitleSx}>{title}</Typography>
          <Typography sx={statValueSx}>{value}</Typography>
          <Typography sx={statSubtitleSx}>{subtitle}</Typography>
        </Paper>
      ))}
    </Box>
  )
}

function UsersToolbar({
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
    <Stack sx={toolbarWrapSx}>
      <Stack sx={toolbarTopRowSx}>
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

      <Stack sx={filtersRowSx}>
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

function UserCard({
  user,
  canManageRoles,
  onEditUser,
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
            <Typography sx={{ fontWeight: 800, color: '#1b2740', fontSize: '1rem' }}>
              {user.name}
            </Typography>
            <Typography sx={{ mt: 0.2, fontSize: '0.86rem', color: '#6f7d95' }}>
              {user.title}
            </Typography>
            <Typography sx={{ mt: 0.25, fontSize: '0.82rem', color: '#7c8797', fontWeight: 700 }}>
              Role: {user.accessRole} - {user.department}
            </Typography>
            <Typography
              sx={{
                mt: 0.2,
                fontSize: '0.8rem',
                color: user.twoFactorRequired ? '#7c3aed' : '#1d8e63',
                fontWeight: 700,
              }}
            >
              2FA: Activee par defaut
              {user.twoFactorRequired ? ' - Obligatoire' : ''}
            </Typography>
          </Box>

          <Chip label={user.status} size="small" sx={userStatusChipSx(user.badgeColor)} />
        </Stack>

        <Stack spacing={0.8}>
          <Stack direction="row" spacing={1} alignItems="center">
            <MailOutlineRoundedIcon sx={{ fontSize: 18, color: '#8a97ad' }} />
            <Typography sx={{ fontSize: '0.9rem', color: '#445169' }}>{user.email}</Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <PhoneRoundedIcon sx={{ fontSize: 18, color: '#8a97ad' }} />
            <Typography sx={{ fontSize: '0.9rem', color: '#445169' }}>{user.phone}</Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => onEditUser(user)}
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

function UserFormDialog({ open, initialUser, onClose, onSave }) {
  const [form, setForm] = useState(() =>
    initialUser || {
      name: '',
      title: '',
      accessRole: 'Employeur',
      department: 'Formation',
      email: '',
      phone: '',
      status: 'Actif',
      twoFactorRequired: false,
      badgeColor: '#2563eb',
      avatar: 'U',
    }
  )

  const handleChange = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }))
  }

  // Normalise le profil avant enregistrement ; le 2FA est considere actif par defaut.
  const handleSubmit = () => {
    const trimmedName = form.name.trim()
    const trimmedEmail = form.email.trim()
    if (!trimmedName || !trimmedEmail) return

    onSave({
      ...form,
      name: trimmedName,
      email: trimmedEmail,
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
          <TextField label="Nom complet" value={form.name} onChange={(event) => handleChange('name', event.target.value)} fullWidth />
          <TextField label="Fonction" value={form.title} onChange={(event) => handleChange('title', event.target.value)} fullWidth />
          <TextField label="E-mail" value={form.email} onChange={(event) => handleChange('email', event.target.value)} fullWidth />
          <TextField label="Telephone" value={form.phone} onChange={(event) => handleChange('phone', event.target.value)} fullWidth />
          <TextField select label="Role" value={form.accessRole} onChange={(event) => handleChange('accessRole', event.target.value)} fullWidth>
            <MenuItem value="DDRH">DDRH</MenuItem>
            <MenuItem value="Employeur">Employeur</MenuItem>
          </TextField>
          <TextField label="Service" value={form.department} onChange={(event) => handleChange('department', event.target.value)} fullWidth />
          <TextField select label="Statut" value={form.status} onChange={(event) => handleChange('status', event.target.value)} fullWidth>
            <MenuItem value="Actif">Actif</MenuItem>
            <MenuItem value="En attente">En attente</MenuItem>
            <MenuItem value="Inactif">Inactif</MenuItem>
            <MenuItem value="Acces revoque">Acces revoque</MenuItem>
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

function UserDeleteDialog({ open, selectedUser, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 800 }}>Supprimer l'utilisateur</DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Typography sx={{ fontSize: '0.92rem', color: '#5f6f86', mt: 0.5 }}>
          Confirmer la suppression de <strong>{selectedUser?.name || 'cet utilisateur'}</strong>.
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
