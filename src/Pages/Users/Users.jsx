import { Alert, Box, Paper, Stack, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import MainLayout from '../../components/layout/mainLayout'
import { CONNECTED_USER_ROLE_KEY, filters, initialUsers, stats } from './users.data'
import { UserCard, UserRoleDialog, UsersStatsGrid, UsersToolbar } from './users.sections'
import { contentPaperSx, usersGridSx } from './users.styles'

export default function Users() {
  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState(filters.roles[0])
  const [selectedStatus, setSelectedStatus] = useState(filters.status[0])
  const [selectedDepartment, setSelectedDepartment] = useState(filters.department[0])
  const [feedback, setFeedback] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [connectedUserRole, setConnectedUserRole] = useState('DDRH')

  useEffect(() => {
    const storedRole = localStorage.getItem(CONNECTED_USER_ROLE_KEY) || 'DDRH'
    setConnectedUserRole(storedRole)
  }, [])

  const canManageRoles = connectedUserRole === 'DDRH'

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

  useEffect(() => {
    if (!canManageRoles) {
      setFeedback("Acces refuse : seul un profil DDRH peut gerer les roles et permissions.")
      return
    }

    if ((searchTerm.trim() || selectedRole !== filters.roles[0] || selectedStatus !== filters.status[0] || selectedDepartment !== filters.department[0]) && filteredUsers.length === 0) {
      setFeedback("Utilisateur introuvable ou aucun resultat pour les filtres selectionnes.")
      return
    }

    setFeedback('')
  }, [canManageRoles, filteredUsers.length, searchTerm, selectedDepartment, selectedRole, selectedStatus])

  const handleEditRole = (user) => {
    if (!canManageRoles) return
    setSelectedUser(user)
    setDialogOpen(true)
  }

  const handleSaveRole = (nextRole) => {
    if (!selectedUser) return

    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.email === selectedUser.email
          ? {
              ...user,
              accessRole: nextRole,
              badgeColor: nextRole === 'DDRH' ? '#7c3aed' : '#2563eb',
            }
          : user
      )
    )
    setFeedback(`Le role de ${selectedUser.name} a ete mis a jour avec succes.`)
    setDialogOpen(false)
    setSelectedUser(null)
  }

  const handleRevokeAccess = (userToUpdate, mode = 'access') => {
    if (!canManageRoles) return

    if (mode === 'twoFactor') {
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.email === userToUpdate.email
            ? {
                ...user,
                twoFactorEnabled: false,
              }
            : user
        )
      )
      setFeedback(`Le 2FA de ${userToUpdate.name} a ete desactive temporairement.`)
      return
    }

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
            />

            <Alert severity={canManageRoles ? 'info' : 'error'} sx={{ borderRadius: '14px' }}>
              Profil connecte : <strong>{connectedUserRole}</strong>.{' '}
              {canManageRoles
                ? 'Vous pouvez modifier les roles et revoquer les acces.'
                : "Le systeme refuse l'acces a la gestion des roles pour un employeur."}
            </Alert>

            {feedback ? (
              <Alert
                severity={
                  feedback.includes('introuvable') || feedback.includes('Acces refuse')
                    ? 'error'
                    : 'success'
                }
                sx={{ borderRadius: '14px' }}
              >
                {feedback}
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
                  Aucun utilisateur trouve
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
                    onEditRole={handleEditRole}
                    onRevokeAccess={handleRevokeAccess}
                  />
                ))}
              </Box>
            )}

            <UserRoleDialog
              open={dialogOpen}
              selectedUser={selectedUser}
              onClose={() => {
                setDialogOpen(false)
                setSelectedUser(null)
              }}
              onSave={handleSaveRole}
            />
          </Stack>
        </Paper>
      </Box>
    </MainLayout>
  )
}
