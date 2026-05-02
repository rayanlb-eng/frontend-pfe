import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material'
import { createElement } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../components/layout/mainLayout'
import ChartCard from '../../components/ui/chartCard'
import StatCard from '../../components/ui/statcard'
import {
  dashboardSecondaryGridSx,
  dashboardSurfaceSx,
  recentItemSx,
  recentListSx,
  tooltipStyle,
} from './dashboard.data'

function DashboardStatsGrid({ stats }) {
  const largeColumns = stats.length === 3 ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)'

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: largeColumns,
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
          icon={createElement(Icon)}
          background={background}
          borderColor={borderColor}
        />
      ))}
    </Box>
  )
}

function EmployerMainPanel({ focusBlock, onOpenForm }) {
  if (!focusBlock) return null

  return (
    <ChartCard title={focusBlock.title} subtitle={focusBlock.subtitle}>
      <Stack spacing={1.4}>
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            borderRadius: '14px',
            border: '1px solid #e8edf5',
            background: '#fff',
          }}
        >
          <Stack spacing={0.8}>
            <Typography sx={{ fontWeight: 800, color: '#1b2740', fontSize: '1rem' }}>
              {focusBlock.ficheLabel}
            </Typography>
            <Typography sx={{ fontSize: '0.88rem', color: '#72809a' }}>
              Statut : {focusBlock.statusLabel}
            </Typography>
            <Typography sx={{ fontSize: '0.88rem', color: '#72809a' }}>
              Date limite : {focusBlock.deadlineLabel}
            </Typography>
            <Typography sx={{ fontSize: '0.88rem', color: '#72809a' }}>
              Formations demandées : {focusBlock.trainingCount}
            </Typography>
          </Stack>
        </Paper>

        {focusBlock.messages.map((message) => (
          <Paper
            key={message.text}
            elevation={0}
            sx={{
              p: 1.2,
              borderRadius: '12px',
              border: `1px solid ${message.border}`,
              background: message.background,
            }}
          >
            <Typography sx={{ fontSize: '0.88rem', color: message.color, fontWeight: 700 }}>
              {message.text}
            </Typography>
          </Paper>
        ))}

        <Button
          variant="contained"
          onClick={onOpenForm}
          disabled={!focusBlock.trackingId}
          sx={{
            alignSelf: 'flex-start',
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 800,
          }}
        >
          {focusBlock.buttonLabel}
        </Button>
      </Stack>
    </ChartCard>
  )
}

function EmployerReviewTable({ reviewBlock }) {
  if (!reviewBlock) return null

  return (
    <ChartCard title={reviewBlock.title} subtitle={reviewBlock.subtitle}>
      <Stack sx={recentListSx}>
        {reviewBlock.notifications.map((notification) => (
          <Paper
            key={notification.title}
            elevation={0}
            sx={{
              p: 1.2,
              borderRadius: '12px',
              border: '1px solid #edf1f6',
              background:
                notification.type === 'danger'
                  ? '#fff2f4'
                  : notification.type === 'warning'
                    ? '#fff7e8'
                    : '#eef8f2',
            }}
          >
            <Typography
              sx={{
                fontSize: '0.88rem',
                color:
                  notification.type === 'danger'
                    ? '#c3455b'
                    : notification.type === 'warning'
                      ? '#b96d12'
                      : '#1d8e63',
                fontWeight: 700,
              }}
            >
              {notification.title}
            </Typography>
          </Paper>
        ))}

        {reviewBlock.items.map((item) => (
          <Paper key={`${item.formation}-${item.status}`} elevation={0} sx={recentItemSx}>
            <Stack spacing={0.8}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                <Typography sx={{ fontWeight: 800, color: '#1b2740', fontSize: '0.95rem' }}>
                  {item.formation}
                </Typography>

                <Chip
                  label={item.status}
                  size="small"
                  sx={{
                    bgcolor: `${item.color}18`,
                    color: item.color,
                    fontWeight: 700,
                  }}
                />
              </Stack>

              <Typography sx={{ fontSize: '0.84rem', color: '#66758e', fontWeight: 700 }}>
                Priorité : {item.priority}
              </Typography>
              <Typography sx={{ fontSize: '0.84rem', color: '#66758e' }}>
                Employés concernés : {item.employeesCount}
              </Typography>
              <Typography sx={{ fontSize: '0.86rem', color: '#526176' }}>
                Commentaire DDRH : {item.comment}
              </Typography>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </ChartCard>
  )
}

function EmployerTrainingChart({ charts }) {
  if (!charts?.barData?.length) return null

  return (
    <ChartCard title={charts.barTitle} subtitle={charts.barSubtitle}>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={charts.barData}>
          <CartesianGrid stroke="#e7edf5" vertical={false} />
          <XAxis
            dataKey={charts.barXAxisKey}
            stroke="#6f7d95"
            interval={0}
            angle={charts.barData.length > 3 ? -12 : 0}
            textAnchor={charts.barData.length > 3 ? 'end' : 'middle'}
            height={charts.barData.length > 3 ? 56 : 30}
          />
          <YAxis stroke="#6f7d95" allowDecimals={false} />
          <Tooltip {...tooltipStyle} />
          <Bar dataKey={charts.barDataKey} radius={[9, 9, 0, 0]}>
            {charts.barData.map((entry, index) => (
              <Cell
                key={`${entry.label}-${index}`}
                fill={['#2563eb', '#1e9b6d', '#f97316', '#7c3aed', '#db5c74'][index % 5]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export default function DashboardEmp({ dashboardModel }) {
  const navigate = useNavigate()

  return (
    <MainLayout>
      <Box sx={{ display: 'grid', gap: 3 }}>
        <DashboardStatsGrid stats={dashboardModel.stats} />

        <Paper elevation={0} sx={dashboardSurfaceSx}>
          <Stack spacing={2.4}>
            <EmployerMainPanel
              focusBlock={dashboardModel.focusBlock}
              onOpenForm={() =>
                dashboardModel.focusBlock.trackingId
                  ? navigate(`/fiches/form/${dashboardModel.focusBlock.trackingId}`)
                  : undefined
              }
            />

            <Box sx={dashboardSecondaryGridSx}>
              <EmployerTrainingChart charts={dashboardModel.charts} />
              <EmployerReviewTable reviewBlock={dashboardModel.reviewTable} />
            </Box>
          </Stack>
        </Paper>
      </Box>
    </MainLayout>
  )
}
