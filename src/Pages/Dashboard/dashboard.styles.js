export const dashboardSurfaceSx = {
  p: { xs: 2, md: 2.3 },
  borderRadius: '18px',
  background:
    'linear-gradient(180deg, rgba(255,255,255,0.99) 0%, rgba(248,250,255,0.98) 100%)',
  border: '1px solid #e5ebf3',
  boxShadow: '0 10px 24px rgba(20, 31, 56, 0.08)',
}

export const dashboardMainGridSx = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    lg: '1.4fr 1fr',
  },
  gap: 2,
}

export const dashboardSecondaryGridSx = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    lg: '1.15fr 1fr',
  },
  gap: 2,
}

export const alertsListSx = {
  spacing: 1,
}

export const alertItemSx = {
  p: 1.3,
  borderRadius: '12px',
  border: '1px solid #edf1f6',
  background: '#fbfcff',
}

export const campaignCardSx = {
  p: 1.4,
  borderRadius: '14px',
  border: '1px solid #e8edf5',
  background: '#fff',
}

export const quickActionsGridSx = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(2, 1fr)',
  },
  gap: 1.4,
}

export const quickActionCardSx = (background) => ({
  p: 2,
  minHeight: 132,
  borderRadius: '14px',
  position: 'relative',
  overflow: 'hidden',
  background,
  border: '1px solid rgba(255,255,255,0.16)',
  boxShadow: '0 10px 20px rgba(20, 31, 56, 0.10)',
})

export const floatingIconSx = {
  position: 'absolute',
  top: 10,
  right: 12,
  color: 'rgba(255,255,255,0.20)',
  '& svg': { fontSize: 32 },
}

export const whiteActionButtonSx = {
  mt: 2,
  bgcolor: 'rgba(255,255,255,0.18)',
  color: '#fff',
  textTransform: 'none',
  fontWeight: 700,
  borderRadius: '10px',
  boxShadow: 'none',
  '&:hover': {
    bgcolor: 'rgba(255,255,255,0.24)',
    boxShadow: 'none',
  },
}

export const exportPanelSx = {
  p: { xs: 2, md: 2.4 },
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #0f9d58 0%, #1f7ae0 55%, #7c3aed 100%)',
  border: '1px solid rgba(255,255,255,0.14)',
  boxShadow: '0 14px 28px rgba(20, 31, 56, 0.12)',
  color: '#fff',
}

export const exportPrimaryButtonSx = {
  borderRadius: '10px',
  bgcolor: '#fff',
  color: '#1f3b75',
  textTransform: 'none',
  fontWeight: 700,
  boxShadow: 'none',
  '&:hover': { bgcolor: '#f4f7ff', boxShadow: 'none' },
}

export const exportGhostButtonSx = {
  borderRadius: '10px',
  bgcolor: 'rgba(255,255,255,0.16)',
  color: '#fff',
  textTransform: 'none',
  fontWeight: 700,
  boxShadow: 'none',
  '&:hover': { bgcolor: 'rgba(255,255,255,0.22)', boxShadow: 'none' },
}

export const recentListSx = {
  spacing: 1,
}

export const recentItemSx = {
  p: 1.35,
  borderRadius: '12px',
  border: '1px solid #edf1f6',
  background: '#fff',
}
