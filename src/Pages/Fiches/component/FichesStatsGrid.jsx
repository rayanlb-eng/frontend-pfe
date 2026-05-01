import { Box, Paper, Typography } from '@mui/material'
import { createElement } from 'react'

export default function FichesStatsGrid({ stats }) {
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
      {stats.map(({ title, value, subtitle, background, Icon }) => (
        <Paper
          key={title}
          elevation={0}
          sx={{
            p: 2.1,
            minHeight: 132,
            borderRadius: '18px',
            position: 'relative',
            overflow: 'hidden',
            background,
            border: '1px solid rgba(255,255,255,0.16)',
            boxShadow: '0 18px 30px rgba(20, 31, 56, 0.12)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 24px 38px rgba(20, 31, 56, 0.16)',
            },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at top right, rgba(255,255,255,0.18), transparent 32%)',
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: 12,
              color: 'rgba(255,255,255,0.20)',
              '& svg': { fontSize: 32 },
            }}
          >
            {createElement(Icon)}
          </Box>
          <Typography
            sx={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.92)', fontWeight: 700 }}
          >
            {title}
          </Typography>
          <Typography sx={{ fontSize: '2.1rem', fontWeight: 800, mt: 1.3, color: '#fff' }}>
            {value}
          </Typography>
          <Typography
            sx={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.95)', mt: 1, fontWeight: 700 }}
          >
            {subtitle}
          </Typography>
        </Paper>
      ))}
    </Box>
  )
}
