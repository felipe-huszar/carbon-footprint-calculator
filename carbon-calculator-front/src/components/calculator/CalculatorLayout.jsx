import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Card, CardContent, useTheme } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom'; // Import useLocation hook
import HomeIcon from '@mui/icons-material/Home';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DeleteIcon from '@mui/icons-material/Delete';
import BoxContainer from '../common/BoxContainer';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';

const CalculatorLayout = ({ children }) => {
    const theme = useTheme();
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    const activeLinkStyle = {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    };

    return (        
        <BoxContainer>
            <Typography variant="h3" gutterBottom>
                Calculator
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: theme.spacing(4) }}>
                <NavLink to="/calculator/home-energy" style={{ textDecoration: 'none' }}>
                    <Card sx={{ ...theme.components.MuiCard.styleOverrides.root, ...(isActive('/calculator/home-energy') && activeLinkStyle) }}>
                        <CardContent>
                            <HomeIcon fontSize="large" />
                            <Typography gutterBottom variant="h5">
                                Home Energy
                            </Typography>
                        </CardContent>
                    </Card>
                </NavLink>
                <NavLink to="/calculator/transportation" style={{ textDecoration: 'none' }}>
                    <Card sx={{ ...theme.components.MuiCard.styleOverrides.root, ...(isActive('/calculator/transportation') && activeLinkStyle) }}>
                        <CardContent>
                            <DirectionsCarIcon fontSize="large" />
                            <Typography gutterBottom variant="h5">
                                Transportation
                            </Typography>
                        </CardContent>
                    </Card>
                </NavLink>
                <NavLink to="/calculator/waste" style={{ textDecoration: 'none' }}>
                    <Card sx={{ ...theme.components.MuiCard.styleOverrides.root, ...(isActive('/calculator/waste') && activeLinkStyle) }}>
                        <CardContent>
                            <DeleteIcon fontSize="large" />
                            <Typography gutterBottom variant="h5">
                                Waste
                            </Typography>
                        </CardContent>
                    </Card>
                </NavLink>
                <NavLink to="/calculator/report" style={{ textDecoration: 'none' }}>
                    <Card sx={{ ...theme.components.MuiCard.styleOverrides.root, ...(isActive('/calculator/report') && activeLinkStyle) }}>
                        <CardContent>
                            <InsertChartOutlinedIcon fontSize="large" />
                            <Typography gutterBottom variant="h5">
                                Calculate
                            </Typography>
                        </CardContent>
                    </Card>
                </NavLink>
            </Box>            
            <Box sx={{ marginBottom: theme.spacing(4), width: '90vw' }}>
                <Box sx={{ padding: theme.spacing(2), bgcolor: theme.palette.background.paper }}>                    
                    {children}
                </Box>
            </Box>            
        </BoxContainer>        
    );
};

CalculatorLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default CalculatorLayout;
