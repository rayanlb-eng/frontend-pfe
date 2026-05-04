import { Stack, Typography } from '@mui/material'

export default function FormSection({ title, children }) {
  return (
    <Stack spacing={1.4}>
      <Typography sx={{ fontWeight: 700, color: '#334155', fontSize: '0.95rem' }}>
        {title}
      </Typography>
      {children}
    </Stack>
  )
}
