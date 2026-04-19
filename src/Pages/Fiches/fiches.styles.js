export const sectionPaperSx = {
  p: { xs: 2, md: 2.4 },
  borderRadius: '18px',
  background: 'linear-gradient(180deg, rgba(255,255,255,0.99) 0%, rgba(248,250,255,0.98) 100%)',
  border: '1px solid #e5ebf3',
  boxShadow: '0 10px 24px rgba(20, 31, 56, 0.08)',
}

export const topGridSx = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    xl: '1.05fr 0.95fr',
  },
  gap: 2,
}

export const trackingTableWrapSx = {
  borderRadius: '16px',
  overflow: 'hidden',
  border: '1px solid #e7edf5',
}

export const statusChipSx = (status) => {
  const map = {
    Envoyee: { bg: '#e8f7ee', color: '#168553' },
    Consultee: { bg: '#eaf2ff', color: '#2563eb' },
    'En cours': { bg: '#fff4df', color: '#c77817' },
    Completee: { bg: '#efe7ff', color: '#7c3aed' },
  }

  const style = map[status] || { bg: '#eef2f7', color: '#64748b' }

  return {
    bgcolor: style.bg,
    color: style.color,
    fontWeight: 700,
    borderRadius: '10px',
  }
}

export const notificationChipSx = (status) => {
  const map = {
    Notifie: { bg: '#e8f7ee', color: '#168553' },
    'Non notifie': { bg: '#ffe9ec', color: '#c24157' },
    Replanifie: { bg: '#fff4df', color: '#c77817' },
  }

  const style = map[status] || { bg: '#eef2f7', color: '#64748b' }

  return {
    bgcolor: style.bg,
    color: style.color,
    fontWeight: 700,
    borderRadius: '10px',
  }
}
