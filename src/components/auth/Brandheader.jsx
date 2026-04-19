import { Box, Typography } from '@mui/material'
import mobilisLogo from '../../assets/mobilis-logo.png'

function BrandHeader({ title, subtitle }) {
  return (
    <Box
      sx={{
        display: 'grid',
        justifyItems: 'center',
        gap: 0.5,
        mb: 2,
      }}
    >
      <Box
        component="img"
        src={mobilisLogo}
        alt="Mobilis"

        sx={{
          width: { xs: 150, sm: 200 },
          height: "auto",
          objectFit: "contain",
        }}
      >
    </Box>

      {title && (
        <Box sx={{ textAlign: 'center', mt: 0.5 }}>
          <Typography
            sx={{
              fontSize: { xs: '1.45rem', sm: '1.8rem' },
              fontWeight: 800,
              color: '#163126',
            }}
          >
            {title}
          </Typography>

          {subtitle && (
            <Typography
              sx={{
                mt: 0.5,
                fontSize: '0.9rem',
                color: '#5D7367',
                maxWidth: 420,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  )
}

export default BrandHeader