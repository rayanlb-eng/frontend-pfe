import { Paper, Typography, Box, Stack } from '@mui/material'

export default function ChartCard({ title, subtitle, children }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 2.4 },
        borderRadius: '16px',
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.99) 0%, rgba(248,250,255,0.98) 100%)',
        border: '1px solid #e5ebf3',
        boxShadow: '0 10px 24px rgba(20, 31, 56, 0.08)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(79,70,229,0.03) 0%, transparent 26%)',
          pointerEvents: 'none',
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: '1rem',
                color: '#1b2740',
              }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                fontSize: '0.84rem',
                color: '#73819a',
                mt: 0.4,
              }}
            >
              {subtitle}
            </Typography>
          </Box>

          <Stack direction="row" spacing={0.5} sx={{ pt: 0.4 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#c8d2e1' }} />
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#aebcd0' }} />
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#91a5bf' }} />
          </Stack>
        </Stack>

        {children}
      </Box>
    </Paper>
  )
}
