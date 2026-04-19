import { Box, Paper, Stack } from '@mui/material'
import MainLayout from '../../components/layout/mainLayout'
import {
  alerts,
  campaignSteps,
  departmentTrainingData,
  exportActions,
  quickActions,
  recentFiches,
  stats,
  statusData,
  yearlyTrainingData,
} from './dashboard.data'
import {
  DashboardAlertsPanel,
  DashboardCampaignPanel,
  DashboardChartsSection,
  DashboardQuickActions,
  DashboardRecentFiches,
  DashboardStatsGrid,
  ExportPanel,
} from './dashboard.sections'
import {
  dashboardMainGridSx,
  dashboardSecondaryGridSx,
  dashboardSurfaceSx,
} from './dashboard.styles'

export default function Dashboard() {
  return (
    <MainLayout>
      <Box sx={{ display: 'grid', gap: 3 }}>
        <DashboardStatsGrid stats={stats} />

        <Paper elevation={0} sx={dashboardSurfaceSx}>
          <Stack spacing={2.4}>
            <DashboardChartsSection
              yearlyTrainingData={yearlyTrainingData}
              statusData={statusData}
              departmentTrainingData={departmentTrainingData}
            />

            <Box sx={dashboardMainGridSx}>
              <DashboardCampaignPanel campaignSteps={campaignSteps} />
              <DashboardAlertsPanel alerts={alerts} />
            </Box>

            <Box sx={dashboardSecondaryGridSx}>
              <DashboardRecentFiches recentFiches={recentFiches} />
              <DashboardQuickActions quickActions={quickActions} />
            </Box>
          </Stack>
        </Paper>

        <ExportPanel exportActions={exportActions} />
      </Box>
    </MainLayout>
  )
}
