import { Box } from '@mui/material'
import { createElement } from 'react'
import StatCard from './statcard'

export default function DashboardStatsGrid({ stats, largeColumns = 'repeat(4, 1fr)', gap = 1.6 }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: largeColumns,
        },
        gap,
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
