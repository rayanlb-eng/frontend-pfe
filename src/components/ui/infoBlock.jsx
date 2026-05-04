import { Paper, Stack, Typography } from '@mui/material'

export default function InfoBlock({
  label,
  value,
  variant = 'stack',
  stackSx,
  labelSx,
  valueSx,
  paperSx,
}) {
  const content = (
    <>
      <Typography
        sx={{
          fontSize: '0.76rem',
          color: '#8A97AD',
          fontWeight: 800,
          mb: variant === 'paper' ? 0.35 : 0,
          ...labelSx,
        }}
      >
        {label}
      </Typography>
      {typeof value === 'string' || typeof value === 'number' ? (
        <Typography
          sx={{
            fontSize: '0.92rem',
            color: '#1F2B42',
            fontWeight: 700,
            lineHeight: 1.45,
            ...valueSx,
          }}
        >
          {value}
        </Typography>
      ) : (
        value
      )}
    </>
  )

  if (variant === 'stack') {
    return (
      <Stack spacing={0.35} sx={stackSx}>
        {content}
      </Stack>
    )
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.3,
        borderRadius: '16px',
        border: '1px solid #E8EEF6',
        background: '#FFFFFF',
        ...paperSx,
      }}
    >
      {content}
    </Paper>
  )
}
