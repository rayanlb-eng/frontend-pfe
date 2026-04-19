export const statsGridSx = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(2, 1fr)',
    lg: 'repeat(4, 1fr)',
  },
  gap: 1.6,
}

export const statCardSx = (background) => ({
  p: 2,
  minHeight: 124,
  borderRadius: '12px',
  position: 'relative',
  overflow: 'hidden',
  background,
  border: '1px solid rgba(255,255,255,0.16)',
  boxShadow: '0 10px 20px rgba(20, 31, 56, 0.10)',
  transition: 'all 0.22s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 14px 28px rgba(20, 31, 56, 0.08)',
  },
})

export const statIconWrapSx = {
  position: 'absolute',
  top: 10,
  right: 12,
  color: 'rgba(255,255,255,0.20)',
  '& svg': { fontSize: 32 },
}

export const statTitleSx = {
  fontSize: '0.95rem',
  color: 'rgba(255,255,255,0.92)',
  fontWeight: 700,
  lineHeight: 1.15,
  maxWidth: '85%',
}

export const statValueSx = {
  fontSize: '2.1rem',
  fontWeight: 800,
  lineHeight: 1,
  mt: 1.3,
  color: '#fff',
}

export const statSubtitleSx = {
  fontSize: '0.88rem',
  color: 'rgba(255,255,255,0.95)',
  mt: 1,
  fontWeight: 700,
  maxWidth: '90%',
}

export const contentPaperSx = {
  p: { xs: 2, md: 2.3 },
  borderRadius: '18px',
  background:
    'linear-gradient(180deg, rgba(255,255,255,0.99) 0%, rgba(248,250,255,0.98) 100%)',
  border: '1px solid #e5ebf3',
  boxShadow: '0 10px 24px rgba(20, 31, 56, 0.08)',
}

export const toolbarWrapSx = {
  spacing: 1.4,
}

export const toolbarTopRowSx = {
  direction: { xs: 'column', sm: 'row' },
  spacing: 1.2,
  alignItems: { xs: 'stretch', sm: 'center' },
}

export const searchBoxSx = {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  px: 1.5,
  minHeight: 44,
  borderRadius: '14px',
  backgroundColor: '#fff',
  border: '1px solid #dbe4f0',
  boxShadow: '0 8px 18px rgba(20, 31, 56, 0.04)',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 12px 24px rgba(20, 31, 56, 0.06)',
    borderColor: '#c9d7ea',
  },
}

export const actionButtonsSx = {
  flexShrink: 0,
  width: { xs: '100%', sm: 'auto' },
}

export const filtersRowSx = {
  direction: { xs: 'column', sm: 'row' },
  spacing: 1.2,
  sx: { flex: 1 },
}

export const controlSx = {
  '& .MuiOutlinedInput-root': {
    minHeight: 44,
    borderRadius: '14px',
    backgroundColor: '#fff',
    transition: 'all 0.2s ease',
    '& fieldset': {
      borderColor: '#dbe4f0',
    },
    '&:hover': {
      backgroundColor: '#ffffff',
      boxShadow: '0 10px 22px rgba(20, 31, 56, 0.05)',
      '& fieldset': {
        borderColor: '#c9d7ea',
      },
    },
    '&.Mui-focused': {
      boxShadow: '0 12px 24px rgba(59, 130, 246, 0.10)',
      '& fieldset': {
        borderColor: '#8fb5ff',
      },
    },
  },
}

export const secondaryButtonSx = {
  borderRadius: '14px',
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '0.85rem',
  minHeight: 44,
  height: 44,
  px: 1.8,
  borderColor: '#dbe4f0',
  color: '#42516b',
  backgroundColor: '#fff',
  boxShadow: '0 8px 18px rgba(20, 31, 56, 0.05)',
  '&:hover': {
    borderColor: '#c9d7ea',
    backgroundColor: '#ffffff',
    boxShadow: '0 12px 24px rgba(20, 31, 56, 0.08)',
  },
}

export const primaryButtonSx = {
  borderRadius: '14px',
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '0.85rem',
  minHeight: 44,
  height: 44,
  px: 1.9,
  background: 'linear-gradient(135deg, #1e9b6d 0%, #2fbf87 100%)',
  boxShadow: '0 12px 24px rgba(30,155,109,0.20)',
  '& .MuiButton-startIcon': {
    mr: 0.6,
    '& > *:nth-of-type(1)': {
      fontSize: 18,
    },
  },
  '&:hover': {
    background: 'linear-gradient(135deg, #178258 0%, #28a976 100%)',
    boxShadow: '0 16px 28px rgba(30,155,109,0.24)',
  },
}

export const usersGridSx = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    xl: 'repeat(2, 1fr)',
  },
  gap: 1.4,
}

export const userCardSx = {
  p: 1.6,
  borderRadius: '14px',
  border: '1px solid #e7edf5',
  background: '#fff',
  boxShadow: '0 8px 18px rgba(20, 31, 56, 0.04)',
  transition: 'all 0.22s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 14px 28px rgba(20, 31, 56, 0.08)',
  },
}

export const userAvatarSx = (badgeColor) => ({
  width: 52,
  height: 52,
  bgcolor: `${badgeColor}18`,
  color: badgeColor,
  fontWeight: 800,
  flexShrink: 0,
})

export const userStatusChipSx = (badgeColor) => ({
  bgcolor: `${badgeColor}18`,
  color: badgeColor,
  fontWeight: 700,
  flexShrink: 0,
})

export const userPrimaryActionSx = (badgeColor) => ({
  borderRadius: '10px',
  textTransform: 'none',
  fontWeight: 700,
  bgcolor: badgeColor,
  boxShadow: 'none',
  '&:hover': {
    bgcolor: badgeColor,
    boxShadow: 'none',
  },
})

export const userSecondaryActionSx = {
  borderRadius: '10px',
  textTransform: 'none',
  fontWeight: 700,
  borderColor: '#d7e1ef',
  color: '#48556c',
}
