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
          transform: 'translateY(-4px) scale(1.01)',
          boxShadow: '0 14px 26px rgba(20, 31, 56, 0.14)',
        },
        '&::before': {
  content: '""',
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(120deg, rgba(255,255,255,0.15), transparent)',
  opacity: 0.6,
},
      }}
    >
      <Box
  sx={{
    position: 'absolute',
    top: 12,
    right: 12,
    width: 42,
    height: 42,
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(6px)',
    color: '#fff',
    '& svg': {
      fontSize: 22,
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
            fontSize: '2.4rem',
fontWeight: 900,
letterSpacing: '-0.5px',
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
