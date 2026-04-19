import { Box, Paper, Typography } from '@mui/material'

export default function StatCard({
  title,
  value,
  icon,
  subtitle,
  background,
  borderColor,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 2.15 },
        minHeight: 126,
        borderRadius: '12px',
        position: 'relative',
        overflow: 'hidden',
        background,
        border: `1px solid ${borderColor || 'rgba(255,255,255,0.22)'}`,
        boxShadow: '0 10px 20px rgba(20, 31, 56, 0.10)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 14px 26px rgba(20, 31, 56, 0.14)',
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          right: 12,
          color: 'rgba(255,255,255,0.20)',
          '& svg': {
            fontSize: 32,
          },
        }}
      >
        {icon}
      </Box>

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          sx={{
            fontSize: '0.95rem',
            color: 'rgba(255,255,255,0.92)',
            fontWeight: 700,
            lineHeight: 1.15,
            maxWidth: '85%',
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: '2.1rem',
            fontWeight: 800,
            lineHeight: 1,
            mt: 1.3,
            color: '#fff',
          }}
        >
          {value}
        </Typography>

        <Typography
          sx={{
            fontSize: '0.88rem',
            color: 'rgba(255,255,255,0.95)',
            mt: 1,
            fontWeight: 700,
            maxWidth: '90%',
          }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Paper>
  )
}
