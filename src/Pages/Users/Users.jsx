import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded'
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { createUser, deleteUser, getUsers, updateUser } from "../../services/users"
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
  getFullName,
  getRoleColor,
  getUserAvatar,
  getUserStatusLabel,
  mapRoleFlags,
  primaryButtonSx,
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
} from './users.data'

function createEmptyUserForm() {
  return {
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    telephone: '',
    departement: '',
    role: 'Directeur de structure',
    is_active: true,
    password: '',
  }
}

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [feedback, setFeedback] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const [connectedUserRole] = useState(
    () => localStorage.getItem(CONNECTED_USER_ROLE_KEY) || 'DDRH'
  )
  const loadUsers = async () => {
    setLoading(true)
    setError('')
    setFeedback('')

    try {
      const data = await getUsers()
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Impossible de charger les utilisateurs')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    loadUsers()
  }, [])
  const canManageUsers =
    connectedUserRole === 'DDRH' || connectedUserRole === 'Admin'

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return users.filter((user) => {
      if (!normalizedSearch) return true

      const fullName = getFullName(user).toLowerCase()

      return (
        fullName.includes(normalizedSearch) ||
        user.username.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch)
      )
    })
  }, [users, searchTerm])

  const passiveFeedback = useMemo(() => {
    if (!canManageUsers) {
      return 'Acces refuse : seuls les profils Admin et DDRH peuvent gerer les utilisateurs.'
    }

    if (searchTerm.trim() && filteredUsers.length === 0) {
      return 'Utilisateur introuvable pour cette recherche.'
    }

    return ''
  }, [canManageUsers, filteredUsers.length, searchTerm])

  const handleOpenAddUser = () => {
    if (!canManageUsers) return
    setSelectedUser(null)
    setFormDialogOpen(true)
  }

  const handleOpenEditUser = (user) => {
    if (!canManageUsers) return
    setSelectedUser(user)
    setFormDialogOpen(true)
  }
  const handleSaveUser = async (nextUser) => {
  setError('')
  setFeedback('')

  try {
    if (selectedUser) {
      const updatedUser = await updateUser(selectedUser.id, nextUser)

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === selectedUser.id ? updatedUser : user
        )
      )

      setFeedback(
        `Les informations de ${getFullName(updatedUser)} ont ete mises a jour.`
      )
    } else {
      const createdUser = await createUser(nextUser)

      setUsers((currentUsers) => [createdUser, ...currentUsers])

      setFeedback(
        `Le nouvel utilisateur ${getFullName(createdUser)} a ete ajoute.`
      )
    }

    setFormDialogOpen(false)
    setSelectedUser(null)
  } catch (err) {
    setError(err.message || "Impossible d'enregistrer l'utilisateur")
  }
}

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    setError('')
    setFeedback('')

    try {
      await deleteUser(selectedUser.id)

      setUsers((currentUsers) =>
        currentUsers.filter((user) => user.id !== selectedUser.id)
      )

      setFeedback(
        `${getFullName(selectedUser)} a été supprimé  de la liste des utilisateurs.`
      )

      setDeleteDialogOpen(false)
      setSelectedUser(null)
    } catch (err) {
      setError(err.message || "Impossible de supprimer l'utilisateur")
    }
  }


  const handleOpenDeleteUser = (user) => {
    if (!canManageUsers) return
    setSelectedUser(user)
    setDeleteDialogOpen(true)
  }


  const handleDeactivateUser = async (userToUpdate) => {
    if (!canManageUsers) return

    setError('')
    setFeedback('')

    try {
      const updatedUser = await updateUser(userToUpdate.id, {
        is_active: false,
      })

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === userToUpdate.id ? updatedUser : user
        )
      )

      setFeedback(`Le compte de ${getFullName(updatedUser)} a été desactivé.`)
    } catch (err) {
      setError(err.message || "Impossible de désactiver l'utilisateur")
    }
  }


  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ display: 'grid', gap: 3 }}>
          <Paper elevation={0} sx={contentPaperSx}>
            <Typography sx={{ fontWeight: 700, color: '#1b2740' }}>
              Chargement des utilisateurs...
            </Typography>
          </Paper>
        </Box>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <Box sx={{ display: 'grid', gap: 3 }}>
        <UsersStatsGrid stats={stats} />

        <Paper elevation={0} sx={contentPaperSx}>
          <Stack spacing={2}>
            <UsersToolbar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              canManageUsers={canManageUsers}
              onAddUser={handleOpenAddUser}
            />

            <Alert severity={canManageUsers ? 'info' : 'error'} sx={{ borderRadius: '14px' }}>
              Profil connecte : <strong>{connectedUserRole}</strong>.{' '}
              {canManageUsers
                ? 'Le formulaire est aligne sur les attributs backend utilisateur.'
                : "Le systeme refuse l'acces a la gestion des utilisateurs pour un directeur de structure."}
            </Alert>
            {error ? (
              <Alert severity="error" sx={{ borderRadius: '14px' }}>
                {error}
              </Alert>
            ) : null}

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
                  Essayez un autre nom, un autre nom d&apos;utilisateur ou une autre adresse
                  e-mail.
                </Typography>
              </Paper>
            ) : (
              <Box sx={usersGridSx}>
                {filteredUsers.map((user) => (
                  <UserCard
                    key={user.id || user.username}
                    user={user}
                    canManageUsers={canManageUsers}
                    onEditUser={handleOpenEditUser}
                    onDeactivateUser={handleDeactivateUser}
                    onDeleteUser={handleOpenDeleteUser}
                  />
                ))}
              </Box>
            )}

            <UserFormDialog
              key={selectedUser?.username|| selectedUser?.id || 'new-user'}
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
          <Box sx={statIconWrapSx}>{createElement(Icon)}</Box>

          <Typography sx={statTitleSx}>{title}</Typography>
          <Typography sx={statValueSx}>{value}</Typography>
          <Typography sx={statSubtitleSx}>{subtitle}</Typography>
        </Paper>
      ))}
    </Box>
  )
}

function UsersToolbar({ searchTerm, onSearchChange, canManageUsers, onAddUser }) {
  return (
    <Stack sx={toolbarWrapSx}>
      <Box sx={toolbarTopRowSx}>
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

        <Stack direction="row" spacing={1.2} sx={actionButtonsSx}>
          <Button variant="outlined" size="small" sx={secondaryButtonSx}>
            Exporter la liste
          </Button>

          <Button
            variant="contained"
            size="small"
            startIcon={<PersonAddAlt1RoundedIcon />}
            sx={primaryButtonSx}
            onClick={onAddUser}
            disabled={!canManageUsers}
          >
            Nouvel utilisateur
          </Button>
        </Stack>
      </Box>
    </Stack>
  )
}

function UserCard({ user, canManageUsers, onEditUser, onDeactivateUser, onDeleteUser }) {
  const roleColor = getRoleColor(user.role)

  return (
    <Paper elevation={0} sx={userCardSx}>
      <Stack spacing={1.4}>
        <Stack direction="row" spacing={1.3} alignItems="center">
          <Avatar sx={userAvatarSx(roleColor)}>{getUserAvatar(user)}</Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontWeight: 800, color: '#1b2740', fontSize: '1rem' }}>
              {getFullName(user)}
            </Typography>
            <Typography sx={{ mt: 0.2, fontSize: '0.86rem', color: '#6f7d95' }}>
              @{user.username}
            </Typography>
            <Typography
              sx={{ mt: 0.25, fontSize: '0.82rem', color: '#7c8797', fontWeight: 700 }}
            >
              Role : {user.role} - {user.departement}
            </Typography>
          </Box>

          <Chip
            label={getUserStatusLabel(user)}
            size="small"
            sx={userStatusChipSx(roleColor)}
          />
        </Stack>

        <Stack spacing={0.8}>
          <Stack direction="row" spacing={1} alignItems="center">
            <MailOutlineRoundedIcon sx={{ fontSize: 18, color: '#8a97ad' }} />
            <Typography sx={{ fontSize: '0.9rem', color: '#445169' }}>{user.email}</Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <PhoneRoundedIcon sx={{ fontSize: 18, color: '#8a97ad' }} />
            <Typography sx={{ fontSize: '0.9rem', color: '#445169' }}>
              {user.telephone}
            </Typography>
          </Stack>

          <Typography sx={{ fontSize: '0.82rem', color: '#7c8797' }}>
            Derniere connexion : {user.last_login || 'Non disponible'}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => onEditUser(user)}
            disabled={!canManageUsers}
            sx={userPrimaryActionSx(roleColor)}
          >
            Modifier
          </Button>

          <Button
            variant="outlined"
            size="small"
            onClick={() => onDeactivateUser(user)}
            disabled={!canManageUsers || !user.is_active}
            sx={userSecondaryActionSx}
          >
            Desactiver
          </Button>

          <Button
            variant="outlined"
            size="small"
            onClick={() => onDeleteUser(user)}
            disabled={!canManageUsers}
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
    initialUser
      ? {
        username: initialUser.username || '',
        email: initialUser.email || '',
        first_name: initialUser.first_name || '',
        last_name: initialUser.last_name || '',
        telephone: initialUser.telephone || '',
        departement: initialUser.departement || '',
        role: initialUser.role || 'Directeur de structure',
        is_active:
          typeof initialUser.is_active === 'boolean' ? initialUser.is_active : true,
        password: '',
      }
      : createEmptyUserForm()
  )

  const handleChange = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }))
  }

  const handleSubmit = () => {
    const username = form.username.trim()
    const email = form.email.trim()
    const firstName = form.first_name.trim()
    const lastName = form.last_name.trim()

    if (!username || !email || !firstName || !lastName) return

    const roleFlags = mapRoleFlags(form.role)

    onSave({
      username,
      email,
      first_name: firstName,
      last_name: lastName,
      telephone: form.telephone.trim(),
      departement: form.departement.trim(),
      role: form.role,
      is_active: form.is_active,
      password: form.password,
      is_staff: roleFlags.is_staff,
      is_superuser: roleFlags.is_superuser,
      last_login: initialUser?.last_login || '',
      date_joined: initialUser?.date_joined || new Date().toISOString(),
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
            label="Nom d'utilisateur"
            value={form.username}
            onChange={(event) => handleChange('username', event.target.value)}
            fullWidth
          />
          <TextField
            label="E-mail"
            value={form.email}
            onChange={(event) => handleChange('email', event.target.value)}
            fullWidth
          />
          <TextField
            label="Prenom"
            value={form.first_name}
            onChange={(event) => handleChange('first_name', event.target.value)}
            fullWidth
          />
          <TextField
            label="Nom"
            value={form.last_name}
            onChange={(event) => handleChange('last_name', event.target.value)}
            fullWidth
          />
          <TextField
            label="Telephone"
            value={form.telephone}
            onChange={(event) => handleChange('telephone', event.target.value)}
            fullWidth
          />
          <TextField
            label="Departement"
            value={form.departement}
            onChange={(event) => handleChange('departement', event.target.value)}
            fullWidth
          />
          <TextField
            select
            label="Role"
            value={form.role}
            onChange={(event) => handleChange('role', event.target.value)}
            fullWidth
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="DDRH">DDRH</MenuItem>
            <MenuItem value="Directeur de structure">Directeur de structure</MenuItem>
          </TextField>
          <TextField
            select
            label="Compte actif"
            value={form.is_active ? 'oui' : 'non'}
            onChange={(event) => handleChange('is_active', event.target.value === 'oui')}
            fullWidth
          >
            <MenuItem value="oui">Oui</MenuItem>
            <MenuItem value="non">Non</MenuItem>
          </TextField>
          {!initialUser ? (
            <TextField
              label="Mot de passe"
              type="password"
              value={form.password}
              onChange={(event) => handleChange('password', event.target.value)}
              fullWidth
              sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}
            />
          ) : null}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: 'none', fontWeight: 700 }}>
          Annuler
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ textTransform: 'none', fontWeight: 700 }}
        >
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
          Confirmer la suppression de{' '}
          <strong>{selectedUser ? getFullName(selectedUser) : 'cet utilisateur'}</strong>.
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
