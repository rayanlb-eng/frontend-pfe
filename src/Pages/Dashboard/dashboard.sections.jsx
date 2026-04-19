import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import { Box, Button, Chip, LinearProgress, Paper, Stack, Typography } from '@mui/material'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ChartCard from '../../components/ui/chartCard'
import StatCard from '../../components/ui/statcard'
import {
  alertItemSx,
  alertsListSx,
  campaignCardSx,
  exportGhostButtonSx,
  exportPanelSx,
  exportPrimaryButtonSx,
  floatingIconSx,
  quickActionCardSx,
  quickActionsGridSx,
  recentItemSx,
  recentListSx,
  whiteActionButtonSx,
} from './dashboard.styles'

const tooltipStyle = {
  contentStyle: {
    borderRadius: 12,
    border: '1px solid #e6ebf2',
    background: 'rgba(255,255,255,0.98)',
    boxShadow: '0 14px 28px rgba(20, 31, 56, 0.10)',
  },
  labelStyle: { color: '#516078', fontWeight: 700 },
  itemStyle: { color: '#18263f' },
}

function AlertChip({ type }) {
  const styles = {
    warning: {
      bg: '#fff1df',
      color: '#b96d12',
      label: 'Alerte',
      icon: <WarningAmberRoundedIcon sx={{ fontSize: 16 }} />,
    },
    danger: {
      bg: '#ffe5ea',
      color: '#c3455b',
      label: 'Critique',
      icon: <ErrorOutlineRoundedIcon sx={{ fontSize: 16 }} />,
    },
    success: {
      bg: '#e6f7ee',
      color: '#1d8e63',
      label: 'Info',
      icon: <CheckCircleRoundedIcon sx={{ fontSize: 16 }} />,
    },
  }

  const style = styles[type]

  return (
    <Chip
      icon={style.icon}
      label={style.label}
      size="small"
      sx={{
        bgcolor: style.bg,
        color: style.color,
        fontWeight: 700,
        '& .MuiChip-icon': {
          color: style.color,
        },
      }}
    />
  )
}

export function DashboardStatsGrid({ stats }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        gap: 1.6,
      }}
    >
      {stats.map(({ title, value, subtitle, background, borderColor, Icon }) => (
        <StatCard
          key={title}
          title={title}
          value={value}
          subtitle={subtitle}
          icon={<Icon />}
          background={background}
          borderColor={borderColor}
        />
      ))}
    </Box>
  )
}

export function DashboardChartsSection({
  yearlyTrainingData,
  statusData,
  departmentTrainingData,
}) {
  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: '1.5fr 1fr',
          },
          gap: 2,
        }}
      >
        <ChartCard
          title="Employes en formation par annee"
          subtitle="Evolution annuelle des besoins recenses"
        >
          <ResponsiveContainer width="100%" height={285}>
            <LineChart data={yearlyTrainingData}>
              <CartesianGrid stroke="#e7edf5" vertical={false} />
              <XAxis dataKey="year" stroke="#6f7d95" />
              <YAxis stroke="#6f7d95" />
              <Tooltip {...tooltipStyle} />
              <Line
                type="monotone"
                dataKey="employees"
                stroke="#4b6bfb"
                strokeWidth={3}
                dot={{ r: 4, fill: '#4b6bfb' }}
                activeDot={{ r: 7, fill: '#4b6bfb' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Etat des demandes" subtitle="Vue globale des statuts actuels">
          <ResponsiveContainer width="100%" height={285}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={68}
                outerRadius={98}
                dataKey="value"
                paddingAngle={4}
              >
                {statusData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </Box>

      <ChartCard
        title="Repartition par departement"
        subtitle="Volume de besoins exprimes par structure"
      >
        <ResponsiveContainer width="100%" height={285}>
          <BarChart data={departmentTrainingData}>
            <CartesianGrid stroke="#e7edf5" vertical={false} />
            <XAxis dataKey="department" stroke="#6f7d95" />
            <YAxis stroke="#6f7d95" />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="employees" radius={[9, 9, 0, 0]}>
              <Cell fill="#4b6bfb" />
              <Cell fill="#1e9b6d" />
              <Cell fill="#e08b2f" />
              <Cell fill="#db5c74" />
              <Cell fill="#7b61ff" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </>
  )
}

export function DashboardCampaignPanel({ campaignSteps }) {
  return (
    <ChartCard
      title="Suivi de campagne"
      subtitle="Avancement des etapes de la campagne"
    >
      <Stack spacing={1.2}>
        {campaignSteps.map((step) => (
          <Paper key={step.title} elevation={0} sx={campaignCardSx}>
            <Stack spacing={1}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
              >
                <Box>
                  <Typography sx={{ fontWeight: 800, color: '#1b2740', fontSize: '0.96rem' }}>
                    {step.title}
                  </Typography>
                  <Typography sx={{ fontSize: '0.84rem', color: '#72809a', mt: 0.35 }}>
                    {step.subtitle}
                  </Typography>
                </Box>

                <Chip
                  label={step.chip}
                  size="small"
                  sx={{
                    bgcolor: `${step.color}18`,
                    color: step.color,
                    fontWeight: 700,
                  }}
                />
              </Stack>

              <LinearProgress
                variant="determinate"
                value={step.progress}
                sx={{
                  height: 8,
                  borderRadius: 999,
                  bgcolor: '#eef2f7',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 999,
                    bgcolor: step.color,
                  },
                }}
              />

              <Typography sx={{ fontSize: '0.8rem', color: '#72809a', fontWeight: 700 }}>
                {step.progress}% d'avancement
              </Typography>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </ChartCard>
  )
}

export function DashboardAlertsPanel({ alerts }) {
  return (
    <ChartCard title="Alertes et suivi" subtitle="Elements a surveiller au quotidien">
      <Stack sx={alertsListSx}>
        {alerts.map((alert) => (
          <Paper key={alert.title} elevation={0} sx={alertItemSx}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
            >
              <Typography
                sx={{
                  fontSize: '0.9rem',
                  color: '#32415a',
                  fontWeight: 600,
                }}
              >
                {alert.title}
              </Typography>
              <AlertChip type={alert.type} />
            </Stack>
          </Paper>
        ))}
      </Stack>
    </ChartCard>
  )
}

export function DashboardRecentFiches({ recentFiches }) {
  return (
    <ChartCard title="Dernieres fiches recues" subtitle="Derniers besoins remontes par les structures">
      <Stack sx={recentListSx}>
        {recentFiches.map((fiche) => (
          <Paper key={`${fiche.structure}-${fiche.submittedAt}`} elevation={0} sx={recentItemSx}>
            <Stack spacing={0.8}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
              >
                <Typography sx={{ fontWeight: 800, color: '#1b2740', fontSize: '0.95rem' }}>
                  {fiche.structure}
                </Typography>

                <Chip
                  label={fiche.status}
                  size="small"
                  sx={{
                    bgcolor: `${fiche.color}18`,
                    color: fiche.color,
                    fontWeight: 700,
                  }}
                />
              </Stack>

              <Typography sx={{ fontSize: '0.86rem', color: '#66758e' }}>
                Domaine: {fiche.domain}
              </Typography>
              <Typography sx={{ fontSize: '0.82rem', color: '#8a97ad', fontWeight: 700 }}>
                Recue le {fiche.submittedAt}
              </Typography>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </ChartCard>
  )
}

export function DashboardQuickActions({ quickActions }) {
  return (
    <ChartCard title="Actions rapides" subtitle="Acces directs aux modules principaux">
      <Box sx={quickActionsGridSx}>
        {quickActions.map(({ title, subtitle, background, Icon }) => (
          <Paper key={title} elevation={0} sx={quickActionCardSx(background)}>
            <Box sx={floatingIconSx}>
              <Icon />
            </Box>

            <Typography
              sx={{
                color: 'rgba(255,255,255,0.92)',
                fontWeight: 700,
                fontSize: '1rem',
                maxWidth: '80%',
              }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                mt: 0.9,
                color: 'rgba(255,255,255,0.95)',
                fontSize: '0.88rem',
                fontWeight: 700,
                maxWidth: '86%',
              }}
            >
              {subtitle}
            </Typography>

            <Button size="small" variant="contained" sx={whiteActionButtonSx}>
              Ouvrir
            </Button>
          </Paper>
        ))}
      </Box>
    </ChartCard>
  )
}

export function ExportPanel({ exportActions }) {
  return (
    <Paper elevation={0} sx={exportPanelSx}>
      <Typography sx={{ fontWeight: 800, fontSize: '1rem' }}>Exports rapides</Typography>
      <Typography sx={{ fontSize: '0.88rem', opacity: 0.92, mt: 0.4, mb: 2 }}>
        Generation des etats et reporting
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.4}>
        {exportActions.map(({ label, variant, Icon }) => (
          <Button
            key={label}
            variant="contained"
            startIcon={<Icon />}
            sx={variant === 'light' ? exportPrimaryButtonSx : exportGhostButtonSx}
          >
            {label}
          </Button>
        ))}
      </Stack>
    </Paper>
  )
}
