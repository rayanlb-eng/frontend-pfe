// ===== LAYOUT =====

// utilisé pour les sections (cards)
export const sectionPaperSx = {
  p: 2.5,
  borderRadius: '18px',
  border: '1px solid #e5ebf3',
  background: '#ffffff',
}

// utilisé pour les grids (stats / top section)
export const topGridSx = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    md: 'repeat(2, minmax(0, 1fr))',
  },
  gap: 2,
}

// ===== SELECT / INPUT MODERN STYLE =====

export const modernSelectSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '14px',
    backgroundColor: '#f9fbfd',
  },
}

// ===== TABLE WRAPPER =====

export const trackingTableWrapSx = {
  overflowX: 'auto',
  borderRadius: '16px',
}

// ===== TABLE CELLS =====

export const tableHeadCellSx = {
  fontWeight: 800,
  fontSize: '0.85rem',
  color: '#1b2740',
  whiteSpace: 'nowrap',
}

export const tableBodyCellSx = {
  fontSize: '0.86rem',
  color: '#334155',
  whiteSpace: 'nowrap',
}

// ===== TABLE ACTION BUTTON =====

export const tableActionButtonSx = {
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 700,
  px: 1.5,
}

// ===== STATUS CHIP =====

export const statusChipSx = {
  fontWeight: 700,
  borderRadius: '10px',
  fontSize: '0.75rem',
}

// ===== NOTIFICATION CHIP =====

export const notificationChipSx = {
  fontWeight: 700,
  borderRadius: '10px',
  fontSize: '0.72rem',
}

// ===== SMALL TEXT =====

export const helperTextSx = {
  fontSize: '0.85rem',
  color: '#72809a',
}