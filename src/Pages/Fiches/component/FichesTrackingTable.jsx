import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import {
  notificationChipSx,
  sectionPaperSx,
  statusChipSx,
  tableActionButtonSx,
  tableBodyCellSx,
  tableHeadCellSx,
  trackingTableWrapSx,
} from '../data/style'

export default function FichesTrackingTable({
  rows,
  onManualResend,
  onReopen,
  onOpenForm,
  canManageStatuses = false,
  onStatusChange,
  showOpenAction = true,
}) {
  return (
    <Paper elevation={0} sx={sectionPaperSx}>
      <Stack spacing={1.6}>
        <Box>
          <Typography sx={{ fontWeight: 800, color: '#1b2740', fontSize: '1rem' }}>
            Tableau de suivi
          </Typography>
          <Typography sx={{ mt: 0.35, fontSize: '0.88rem', color: '#72809a' }}>
            Le système suit les fiches envoyées et leur état de traitement.
          </Typography>
        </Box>

        <Box sx={trackingTableWrapSx}>
          <Table size="small" sx={{ minWidth: 0, width: '100%', tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f7fafc' }}>
                <TableCell sx={tableHeadCellSx}>Fiche</TableCell>
                <TableCell sx={tableHeadCellSx}>Structure</TableCell>
                <TableCell sx={tableHeadCellSx}>Responsable</TableCell>
                <TableCell sx={tableHeadCellSx}>Date d&apos;envoi</TableCell>
                <TableCell sx={tableHeadCellSx}>Statut</TableCell>
                <TableCell sx={tableHeadCellSx}>Fiche</TableCell>
                <TableCell sx={tableHeadCellSx}>Notification</TableCell>
                <TableCell sx={tableHeadCellSx}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{
                    '&:nth-of-type(even)': { background: '#fbfdff' },
                    '&:hover': { background: '#f3f8fd' },
                  }}
                >
                  <TableCell sx={tableBodyCellSx}>
                    <Typography sx={{ fontWeight: 700, color: '#1f2b42', fontSize: '0.88rem' }}>
                      {row.templateName}
                    </Typography>
                  </TableCell>
                  <TableCell sx={tableBodyCellSx}>{row.structure}</TableCell>
                  <TableCell sx={tableBodyCellSx}>{row.manager}</TableCell>
                  <TableCell sx={tableBodyCellSx}>{row.sentAt}</TableCell>
                  <TableCell sx={tableBodyCellSx}>
                    <Chip label={row.status} size="small" sx={statusChipSx} />
                  </TableCell>
                  <TableCell sx={tableBodyCellSx}>
                    <Chip label={row.formStatus} size="small" sx={statusChipSx} />
                  </TableCell>
                  <TableCell sx={tableBodyCellSx}>
                    <Chip label={row.notificationStatus} size="small" sx={notificationChipSx} />
                  </TableCell>
                  <TableCell sx={tableBodyCellSx}>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {showOpenAction && onOpenForm ? (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => onOpenForm(row)}
                          sx={tableActionButtonSx}
                        >
                          Ouvrir
                        </Button>
                      ) : null}

                      {canManageStatuses && onStatusChange ? (
                        <TextField
                          select
                          size="small"
                          value={row.status}
                          onChange={(event) => onStatusChange(row, event.target.value)}
                          sx={{ minWidth: 130 }}
                        >
                          <MenuItem value="Envoyee">Envoyée</MenuItem>
                          <MenuItem value="Consultee">Consultée</MenuItem>
                          <MenuItem value="En cours">En cours</MenuItem>
                          <MenuItem value="Completee">Complétée</MenuItem>
                        </TextField>
                      ) : null}

                      {row.notificationStatus === 'Non notifie' && onManualResend ? (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => onManualResend(row)}
                          sx={tableActionButtonSx}
                        >
                          Renvoyer
                        </Button>
                      ) : null}

                      {row.formStatus === 'Soumise' && onReopen ? (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => onReopen(row)}
                          sx={tableActionButtonSx}
                        >
                          Réouvrir
                        </Button>
                      ) : null}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Stack>
    </Paper>
  )
}
