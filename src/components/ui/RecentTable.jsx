import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip,
} from '@mui/material'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'

const rows = [
  {
    nom: 'Formation Leadership',
    domaine: 'Informatique',
    date: '23 Sep 20/22',
    statut: 'En attente',
  },
  {
    nom: 'Gestion de Projet',
    domaine: 'Management',
    date: '29 Sep 20/21',
    statut: 'Fort intérêt',
  },
]

const getStatusStyle = (statut) => {
  if (statut === 'En attente') {
    return {
      label: 'En attente',
      sx: {
        bgcolor: '#f6b26b',
        color: '#fff',
        fontWeight: 700,
      },
    }
  }

  return {
    label: 'Fort intérêt',
    sx: {
      bgcolor: '#2fbf71',
      color: '#fff',
      fontWeight: 700,
    },
  }
}

export default function RecentTable() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: '14px',
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: '1rem',
            fontWeight: 700,
            color: '#2f3b45',
          }}
        >
          Dernières Fiches Soumises
        </Typography>

        <MoreHorizRoundedIcon sx={{ color: '#b1b8be' }} />
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                '& th': {
                  background: '#f5f6f7',
                  color: '#48545c',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  borderBottom: '1px solid #e5e7eb',
                },
              }}
            >
              <TableCell>Nom</TableCell>
              <TableCell>Domaine</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => {
              const status = getStatusStyle(row.statut)

              return (
                <TableRow
                  key={row.nom}
                  sx={{
                    '& td': {
                      borderBottom: '1px solid #edf0f2',
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: '#2f3b45',
                    }}
                  >
                    {row.nom}
                  </TableCell>

                  <TableCell sx={{ color: '#5f6b73' }}>{row.domaine}</TableCell>
                  <TableCell sx={{ color: '#5f6b73' }}>{row.date}</TableCell>

                  <TableCell>
                    <Chip
                      label={status.label}
                      size="small"
                      sx={{
                        height: 24,
                        borderRadius: '999px',
                        ...status.sx,
                      }}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <DeleteOutlineRoundedIcon
                      sx={{
                        fontSize: 18,
                        color: '#a7afb6',
                        cursor: 'pointer',
                      }}
                    />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}