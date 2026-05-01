import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material'
import { createElement } from 'react'
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
import MainLayout from '../../components/layout/mainLayout'
import ChartCard from '../../components/ui/chartCard'
import StatCard from '../../components/ui/statcard'
import { CONNECTED_USER_EMAIL_KEY, CONNECTED_USER_ROLE_KEY } from '../Users/users.data'
import DashboardEmp from './dashboardEmp'
import {
  buildDdrhDashboardModel,
  buildEmployerDashboardModel,
  dashboardMainGridSx,
  dashboardSecondaryGridSx,
  dashboardSurfaceSx,
  floatingIconSx,
  quickActionCardSx,
  quickActionsGridSx,
  recentItemSx,
  recentListSx,
  tooltipStyle,
  whiteActionButtonSx,
} from './dashboard.data'

export default function Dashboard() {
  const connectedRole = localStorage.getItem(CONNECTED_USER_ROLE_KEY) || 'DDRH'
  const connectedEmail =
    localStorage.getItem(CONNECTED_USER_EMAIL_KEY) || 'k.ziani@mobilis.dz'

  const dashboardModel =
    connectedRole === 'DDRH'
      ? buildDdrhDashboardModel()
      : buildEmployerDashboardModel(connectedEmail)

  if (dashboardModel.role === 'EMPLOYEUR') {
    return <DashboardEmp dashboardModel={dashboardModel} />
  }

  return (
    <MainLayout>
      <Box sx={{ display: 'grid', gap: 3 }}>
        <DashboardStatsGrid stats={dashboardModel.stats} />

        <Paper elevation={0} sx={dashboardSurfaceSx}>
          <Stack spacing={2.4}>
            <DashboardChartsSection charts={dashboardModel.charts} />

            <Box sx={dashboardMainGridSx}>
              <DashboardTableCard block={dashboardModel.tables.latestSubmitted} />
              <DashboardTableCard block={dashboardModel.tables.pendingStructures} />
            </Box>

            <Box sx={dashboardSecondaryGridSx}>
              <DashboardTableCard block={dashboardModel.tables.topTrainings} />
              <DashboardQuickActions quickBlock={dashboardModel.quick} />
            </Box>
          </Stack>
        </Paper>
      </Box>
    </MainLayout>
  )
}

function DashboardStatsGrid({ stats }) {
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
          icon={createElement(Icon)}
          background={background}
          borderColor={borderColor}
        />
      ))}
    </Box>
  )
}

function DashboardChartsSection({ charts }) {
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
        <ChartCard title={charts.lineTitle} subtitle={charts.lineSubtitle}>
          <ResponsiveContainer width="100%" height={285}>
            <LineChart data={charts.lineData}>
              <CartesianGrid stroke="#e7edf5" vertical={false} />
              <XAxis dataKey={charts.lineXAxisKey} stroke="#6f7d95" />
              <YAxis stroke="#6f7d95" allowDecimals={false} />
              <Tooltip {...tooltipStyle} />
              <Line
                type="monotone"
                dataKey={charts.lineDataKey}
                stroke="#4b6bfb"
                strokeWidth={3}
                dot={{ r: 4, fill: '#4b6bfb' }}
                activeDot={{ r: 7, fill: '#4b6bfb' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={charts.pieTitle} subtitle={charts.pieSubtitle}>
          <ResponsiveContainer width="100%" height={285}>
            <PieChart>
              <Pie
                data={charts.pieData}
                cx="50%"
                cy="50%"
                innerRadius={68}
                outerRadius={98}
                dataKey="value"
                paddingAngle={4}
              >
                {charts.pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </Box>

      <ChartCard title={charts.barTitle} subtitle={charts.barSubtitle}>
        <ResponsiveContainer width="100%" height={285}>
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
                  fill={['#4b6bfb', '#1e9b6d', '#e08b2f', '#db5c74', '#7b61ff'][index % 5]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </>
  )
}

function DashboardTableCard({ block }) {
  return (
    <ChartCard title={block.title} subtitle={block.subtitle}>
      <Stack sx={recentListSx}>
        {block.items.map((item) => (
          <Paper key={`${block.title}-${item.title}-${item.meta}`} elevation={0} sx={recentItemSx}>
            <Stack spacing={0.8}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                <Typography sx={{ fontWeight: 800, color: '#1b2740', fontSize: '0.95rem' }}>
                  {item.title}
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

              <Typography sx={{ fontSize: '0.86rem', color: '#66758e' }}>
                {item.subtitle}
              </Typography>
              <Typography sx={{ fontSize: '0.82rem', color: '#8a97ad', fontWeight: 700 }}>
                {item.meta}
              </Typography>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </ChartCard>
  )
}

function DashboardQuickActions({ quickBlock }) {
  return (
    <ChartCard title={quickBlock.title} subtitle={quickBlock.subtitle}>
      <Box sx={quickActionsGridSx}>
        {quickBlock.items.map(({ title, subtitle, background, Icon }) => (
          <Paper key={title} elevation={0} sx={quickActionCardSx(background)}>
            <Box sx={floatingIconSx}>
              {createElement(Icon)}
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
