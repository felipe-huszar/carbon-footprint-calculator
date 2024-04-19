import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            light: '#C7B8F5',
            main: '#9575CD',
            dark: '#512DA8',
            contrastText: '#ffffff',
        },
        secondary: {
            light: '#F8BBD0',
            main: '#E1BEE7',
            dark: '#9C27B0',
            contrastText: '#000000',
        },
        background: {
            default: '#512DA8',
            paper: '#ffffff',
        },
        text: {
            primary: '#333333',
            secondary: '#575757',
        }
    },
    typography: {
        fontFamily: [
            'Roboto', 'Helvetica', 'Arial', 'sans-serif'
        ].join(','),
        h1: {
            fontWeight: 500,
            fontSize: '2.2rem',
        },
        subtitle1: {
            fontSize: '1.25rem',
            fontWeight: 400,
            color: 'rgba(0, 0, 0, 0.87)'
        },
        body1: {
            fontWeight: 400,
            fontSize: '1rem',
        },        
        homeEnergyEmissionItem: {
            backgroundColor: 'primary.dark',
            color: 'primary.contrastText',
            padding: '10px',
            borderRadius: '5px',
            textAlign: 'center'
        },
        gridTitle: {
            fontSize: '1.25rem',
            color: 'primary.dark'
        }
        
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    margin: '8px',
                    width: '200px',
                    transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                    boxShadow: 'none',
                    borderRadius: '8px',
                    textAlign: 'center',
                    '&:hover': {
                        transform: 'scale(1.04)',
                        boxShadow: '0 6px 12px 0 rgba(0,0,0,0.2)',
                    },
                },
            },
        },
        MuiCardMedia: {
            styleOverrides: {
                root: {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',                    
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
        MuiNavLink: {
            styleOverrides: {
                root: {
                    '&.active': {
                        border: '2px solid',
                        borderColor: 'primary.main',
                    },
                    textDecoration: 'none', // Remove underlines
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {                    
                    height: '1px',            // Set the divider thickness
                    margin: '20px 0 12px 0',          // Adjust divider margins if needed
                },
            },
        },
        layout: {
            containerWidth: '100%',
        },
    },
});

export default theme;
