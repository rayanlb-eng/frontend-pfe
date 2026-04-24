import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded'
import DraftsRoundedIcon from '@mui/icons-material/DraftsRounded'
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded'
import MarkEmailReadRoundedIcon from '@mui/icons-material/MarkEmailReadRounded'
import { Alert, Box, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import MainLayout from '../../components/layout/mainLayout'
import { CONNECTED_USER_EMAIL_KEY, CONNECTED_USER_ROLE_KEY } from '../Users/users.data'
import {
  FichesStatsGrid,
  FichesTrackingTable,
  getStoredTrackingRows,
  structureRecipients,
} from './fiches.data'

function buildMesFichesStats(rows) {
  const openedCount = rows.filter((row) => row.formStatus !== 'Non ouverte').length
  const draftCount = rows.filter((row) => row.formStatus === 'Brouillon').length
  const submittedCount = rows.filter((row) => row.formStatus === 'Soumise').length
  const pendingCount = rows.filter((row) => row.formStatus !== 'Soumise').length

  return [
    {
      title: 'Fiches recues',
      value: String(rows.length),
      subtitle: 'A traiter par votre structure',
      background: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)',
      Icon: MarkEmailReadRoundedIcon,
    },
    {
      title: 'Fiches ouvertes',
      value: String(openedCount),
      subtitle: 'Consultation demarree',
      background: 'linear-gradient(135deg, #0ea55b 0%, #34d399 100%)',
      Icon: FactCheckRoundedIcon,
    },
    {
      title: 'Brouillons',
      value: String(draftCount),
      subtitle: 'En cours de preparation',
      background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
      Icon: DraftsRoundedIcon,
    },
    {
      title: 'Fiches soumises',
      value: String(submittedCount),
      subtitle: pendingCount > 0 ? `${pendingCount} fiche(s) restantes` : 'Tout est transmis',
      background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
      Icon: AssignmentTurnedInRoundedIcon,
    },
  ]
}

export default function MesFichesPage() {
  const navigate = useNavigate()
  const [connectedUserRole, setConnectedUserRole] = useState('Employeur')
  const [connectedUserEmail, setConnectedUserEmail] = useState('')
  const [trackingRows, setTrackingRows] = useState(getStoredTrackingRows())

  useEffect(() => {
    setConnectedUserRole(localStorage.getItem(CONNECTED_USER_ROLE_KEY) || 'Employeur')
    setConnectedUserEmail(localStorage.getItem(CONNECTED_USER_EMAIL_KEY) || '')
    setTrackingRows(getStoredTrackingRows())
  }, [])

  if (connectedUserRole === 'DDRH') {
    return <Navigate to="/fiches/gestion" replace />
  }

  const myRecipientIds = useMemo(
    () =>
      structureRecipients
        .filter((recipient) => recipient.email === connectedUserEmail)
        .map((recipient) => recipient.id),
    [connectedUserEmail]
  )

  const myRows = useMemo(
    () => trackingRows.filter((row) => myRecipientIds.includes(row.recipientId)),
    [myRecipientIds, trackingRows]
  )

  const mesFichesStats = useMemo(() => buildMesFichesStats(myRows), [myRows])

  return (
    <MainLayout>
      <Box sx={{ display: 'grid', gap: 3 }}>
        <Alert severity="info" sx={{ borderRadius: '14px' }}>
          Cette vue est dediee au responsable de structure. Vous pouvez ouvrir vos fiches,
          reprendre un brouillon ou verifier qu&apos;une soumission a bien ete transmise a la DDRH.
        </Alert>

        <FichesStatsGrid stats={mesFichesStats} />

        {myRows.length === 0 ? (
          <Alert severity="warning" sx={{ borderRadius: '14px' }}>
            Aucune fiche n&apos;est actuellement rattachee a votre compte.
          </Alert>
        ) : (
          <FichesTrackingTable rows={myRows} onOpenForm={(row) => navigate(`/fiches/form/${row.id}`)} />
        )}

        <Typography sx={{ fontSize: '0.86rem', color: '#72809a' }}>
          Les actions d&apos;envoi, de relance et de reouverture restent reservees a la DDRH.
        </Typography>
      </Box>
    </MainLayout>
  )
}
