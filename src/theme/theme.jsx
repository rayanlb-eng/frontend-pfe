import { alpha, createTheme } from '@mui/material/styles'

const appTheme = createTheme({
  palette: {
    primary: {
      main: '#00A651',
      dark: '#0E7A3A',
      light: '#EAF8F0',
    },
    background: {
      default: '#F7FAFC',
      paper: '#FFFFFF',
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '"IBM Plex Sans", "Segoe UI", sans-serif',
  },
  components: {
    MuiDialog: {
      defaultProps: {
        fullWidth: true,
      },
      styleOverrides: {
        paper: {
          borderRadius: 22,
          border: '1px solid #E5EBF3',
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,255,1) 100%)',
          boxShadow: '0 24px 60px rgba(15, 23, 42, 0.18)',
          overflow: 'hidden',
        },
        container: {
          backdropFilter: 'blur(8px)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: '24px 24px 12px',
          fontSize: '1.08rem',
          fontWeight: 900,
          color: '#172033',
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0) 100%)',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '12px 24px 8px',
          color: '#5B677A',
          '&.MuiDialogContent-dividers': {
            borderTop: '1px solid #EDF2F7',
            borderBottom: '1px solid #EDF2F7',
          },
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px 22px',
          gap: 10,
          borderTop: '1px solid #EEF2F7',
          background: alpha('#F8FAFF', 0.7),
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 800,
          boxShadow: 'none',
        },
        contained: {
          boxShadow: '0 10px 22px rgba(0, 166, 81, 0.16)',
          '&:hover': {
            boxShadow: '0 14px 26px rgba(0, 166, 81, 0.2)',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: '#6B8176',
          fontWeight: 600,
          '&.Mui-focused': {
            color: '#00A651',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: '#FFFFFF',
          transition: 'all 0.2s ease',
          boxShadow: '0 6px 18px rgba(8, 61, 35, 0.04)',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#D7E6DB',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(0,166,81,0.45)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00A651',
            borderWidth: 2,
          },
        },
        input: {
          padding: '14px 16px',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          display: 'flex',
          alignItems: 'center',
          minHeight: 'unset',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          border: '1px solid #E6EDF5',
          boxShadow: '0 18px 38px rgba(15, 23, 42, 0.14)',
          padding: 6,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          minHeight: 40,
          borderRadius: 10,
          fontSize: '0.92rem',
          '&.Mui-selected': {
            backgroundColor: alpha('#00A651', 0.12),
          },
          '&.Mui-selected:hover': {
            backgroundColor: alpha('#00A651', 0.16),
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 14,
        },
      },
    },
  },
})

export default appTheme
