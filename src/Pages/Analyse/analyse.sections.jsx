import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import {
  Alert,
  Box,
  Button,
  Chip,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import {
  analysisSurfaceSx,
  priorityChipSx,
  statusChipSx,
  summaryCardSx,
} from './analyse.styles'

export function AnalysisSummaryCards({ summaryCards, summary }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          xl: 'repeat(4, 1fr)',
        },
        gap: 1.6,
      }}
    >
      {summaryCards.map(({ key, title, Icon, background }) => (
        <Paper key={key} elevation={0} sx={summaryCardSx(background)}>
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: 12,
              color: 'rgba(255,255,255,0.20)',
              '& svg': { fontSize: 32 },
            }}
          >
            <Icon />
          </Box>
          <Typography sx={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.92)', fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: '2.1rem', fontWeight: 800, mt: 1.3, color: '#fff' }}>
            {key === 'budget' ? `${Math.round(summary[key] / 1000)}k` : summary[key]}
          </Typography>
          <Typography sx={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.95)', mt: 1, fontWeight: 700 }}>
            {key === 'budget' ? 'DZD engages' : 'Synthese scenario 8'}
          </Typography>
        </Paper>
      ))}
    </Box>
  )
}

export function AnalysisBudgetPanel({ summary, budgetCapacity }) {
  return (
    <Paper elevation={0} sx={analysisSurfaceSx}>
      <Stack spacing={1.4}>
        <Box>
          <Typography sx={{ fontWeight: 800, color: '#1b2740', fontSize: '1rem' }}>
            Budget et arbitrage
          </Typography>
          <Typography sx={{ mt: 0.35, fontSize: '0.88rem', color: '#72809a' }}>
            Controle du budget avant validation finale des priorites.
          </Typography>
        </Box>

        {summary.exceedsBudget ? (
          <Alert severity="warning" sx={{ borderRadius: '14px' }}>
            Le budget total depasse la capacite prevue. La DDRH doit reduire certaines demandes ou
            les reporter.
          </Alert>
        ) : (
          <Alert severity="success" sx={{ borderRadius: '14px' }}>
            Le budget global reste dans la capacite prevue pour la campagne.
          </Alert>
        )}

        <Box sx={{ display: 'grid', gap: 1 }}>
          <MetricRow label="Budget disponible" value={`${Math.round(budgetCapacity / 1000)} 000 DZD`} />
          <MetricRow label="Budget engage" value={`${Math.round(summary.totalBudget / 1000)} 000 DZD`} />
          <MetricRow
            label="Ecart"
            value={`${Math.round((budgetCapacity - summary.totalBudget) / 1000)} 000 DZD`}
          />
        </Box>
      </Stack>
    </Paper>
  )
}

export function AnalysisItemsPanel({
  items,
  onPriorityChange,
  onStatusChange,
  onNoteChange,
  onLock,
  onUnlock,
}) {
  return (
    <Paper elevation={0} sx={analysisSurfaceSx}>
      <Stack spacing={2}>
        <Box>
          <Typography sx={{ fontWeight: 800, color: '#1b2740', fontSize: '1rem' }}>
            Analyse et priorisation
          </Typography>
          <Typography sx={{ mt: 0.35, fontSize: '0.88rem', color: '#72809a' }}>
            Regroupement des demandes similaires, priorite automatique puis ajustement manuel DDRH.
          </Typography>
        </Box>

        {items.length === 0 ? (
          <Alert severity="info" sx={{ borderRadius: '14px' }}>
            Aucune fiche soumise n&apos;est encore disponible pour analyse.
          </Alert>
        ) : (
          <Stack spacing={1.4}>
            {items.map((item) => (
              <Paper
                key={item.id}
                elevation={0}
                sx={{
                  p: 1.7,
                  borderRadius: '16px',
                  border: '1px solid #e8edf5',
                  background: '#fff',
                }}
              >
                <Stack spacing={1.3}>
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    justifyContent="space-between"
                    spacing={1.2}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 800, color: '#1b2740', fontSize: '0.98rem' }}>
                        {item.title || 'Demande sans intitule'}
                      </Typography>
                      <Typography sx={{ mt: 0.35, fontSize: '0.84rem', color: '#72809a' }}>
                        {item.requestCount} demande(s) similaires | Structures :{' '}
                        {item.structures.join(', ')}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={0.8} flexWrap="wrap">
                      <Chip label={`Auto: ${item.autoPriority}`} size="small" sx={priorityChipSx(item.autoPriority)} />
                      <Chip label={item.status} size="small" sx={statusChipSx(item.status)} />
                      {item.locked ? (
                        <Chip label="Verrouillee" size="small" sx={statusChipSx('Validee')} />
                      ) : null}
                    </Stack>
                  </Stack>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, minmax(0, 1fr))' }, gap: 1 }}>
                    <MetricTile label="Urgence" value={`${item.urgencyScore}/100`} />
                    <MetricTile label="Budget estime" value={`${Math.round(item.estimatedBudget / 1000)}k DZD`} />
                    <MetricTile label="Score auto" value={`${item.autoPriorityScore}/100`} />
                    <MetricTile label="Echeance" value={item.earliestDeadline || 'Non definie'} />
                  </Box>

                  <Typography sx={{ fontSize: '0.86rem', color: '#526176' }}>
                    {item.objective || item.context || 'Aucune justification encore saisie.'}
                  </Typography>

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr 1.3fr' },
                      gap: 1.2,
                    }}
                  >
                    <TextField
                      select
                      label="Priorite manuelle"
                      value={item.manualPriority}
                      onChange={(event) => onPriorityChange(item, event.target.value)}
                      disabled={item.locked}
                      size="small"
                    >
                      {['Haute', 'Moyenne', 'Basse'].map((priority) => (
                        <MenuItem key={priority} value={priority}>
                          {priority}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      select
                      label="Statut de la demande"
                      value={item.status}
                      onChange={(event) => onStatusChange(item, event.target.value)}
                      disabled={item.locked}
                      size="small"
                    >
                      {['En analyse', 'Validee', 'Non justifiee', 'Precision demandee', 'Reportee'].map(
                        (status) => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        )
                      )}
                    </TextField>

                    <TextField
                      label="Note DDRH / justification"
                      value={item.justificationNote}
                      onChange={(event) => onNoteChange(item, event.target.value)}
                      disabled={item.locked}
                      size="small"
                      multiline
                      minRows={2}
                    />
                  </Box>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    {!item.locked ? (
                      <Button
                        variant="contained"
                        startIcon={<LockRoundedIcon />}
                        onClick={() => onLock(item)}
                        sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 800 }}
                      >
                        Verrouiller la fiche
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        startIcon={<LockOpenRoundedIcon />}
                        onClick={() => onUnlock(item)}
                        sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}
                      >
                        Deverrouiller
                      </Button>
                    )}

                    <Button
                      variant="outlined"
                      startIcon={<TuneRoundedIcon />}
                      disabled
                      sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}
                    >
                      Priorite auto calculee
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  )
}

function MetricTile({ label, value }) {
  return (
    <Box
      sx={{
        p: 1.2,
        borderRadius: '12px',
        border: '1px solid #e8edf5',
        background: '#fbfcff',
      }}
    >
      <Typography sx={{ fontSize: '0.76rem', fontWeight: 700, color: '#7b879b' }}>{label}</Typography>
      <Typography sx={{ mt: 0.35, fontSize: '0.92rem', fontWeight: 800, color: '#1f2d44' }}>
        {value}
      </Typography>
    </Box>
  )
}

function MetricRow({ label, value }) {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={1}>
      <Typography sx={{ fontSize: '0.88rem', color: '#72809a', fontWeight: 700 }}>{label}</Typography>
      <Typography sx={{ fontSize: '0.9rem', color: '#1f2d44', fontWeight: 800 }}>{value}</Typography>
    </Stack>
  )
}
