import { Paper, Typography } from '@mui/material'

export default function FormSectionCard({
  title,
  subtitle,
  children,
  background = '#ffffff',
  titleColor = '#173429',
  subtitleColor = '#5f7a6d',
  border = '1px solid #e3eee7',
  shadow = '0 14px 30px rgba(8, 61, 35, 0.06)',
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.25, md: 3 },
        borderRadius: '24px',
        background,
        color: titleColor,
        border,
        boxShadow: shadow,
      }}
    >
      <Typography
        sx={{
          fontWeight: 800,
          fontSize: '1.1rem',
          color: titleColor,
          mb: subtitle ? 0.5 : 2,
        }}
      >
        {title}
      </Typography>

      {subtitle && (
        <Typography
          sx={{
            fontSize: '0.92rem',
            color: subtitleColor,
            mb: 2,
          }}
        >
          {subtitle}
        </Typography>
      )}

      {children}
    </Paper>
  )
}
