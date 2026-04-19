export const analysisGridSx = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    lg: '1.15fr 0.85fr',
  },
  gap: 2,
}

export const analysisSurfaceSx = {
  p: { xs: 2, md: 2.3 },
  borderRadius: '18px',
  background:
    'linear-gradient(180deg, rgba(255,255,255,0.99) 0%, rgba(248,250,255,0.98) 100%)',
  border: '1px solid #e5ebf3',
  boxShadow: '0 10px 24px rgba(20, 31, 56, 0.08)',
}

export const priorityChipSx = (priority) => {
  const map = {
    Haute: { bg: '#ffe7ec', color: '#cc3558' },
    Moyenne: { bg: '#fff3df', color: '#c77817' },
    Basse: { bg: '#e9f7ee', color: '#168553' },
  }

  const style = map[priority] || { bg: '#eef2f7', color: '#64748b' }

  return {
    bgcolor: style.bg,
    color: style.color,
    fontWeight: 800,
    borderRadius: '10px',
  }
}

export const statusChipSx = (status) => {
  const map = {
    'En analyse': { bg: '#eef2ff', color: '#3156d3' },
    Validee: { bg: '#e8f7ee', color: '#168553' },
    'Non justifiee': { bg: '#ffe7ec', color: '#cc3558' },
    Reportee: { bg: '#fff3df', color: '#c77817' },
    'Precision demandee': { bg: '#ede9fe', color: '#6d28d9' },
  }

  const style = map[status] || { bg: '#eef2f7', color: '#64748b' }

  return {
    bgcolor: style.bg,
    color: style.color,
    fontWeight: 800,
    borderRadius: '10px',
  }
}

export const summaryCardSx = (background) => ({
  p: 2,
  minHeight: 126,
  borderRadius: '14px',
  position: 'relative',
  overflow: 'hidden',
  background,
  border: '1px solid rgba(255,255,255,0.16)',
  boxShadow: '0 10px 20px rgba(20, 31, 56, 0.10)',
})
