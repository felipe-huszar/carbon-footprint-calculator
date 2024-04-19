// BoxContainer.jsx

import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { Box, useTheme } from '@mui/material';

const BoxContainer = ({ children }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',                            
                padding: '5vw',
                bgcolor: theme.palette.background.default,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    bgcolor: theme.palette.background.paper,
                    p: 4,
                    borderRadius: theme.shape.borderRadius, 
                    boxShadow: theme.shadows[5], 
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

// Add prop validation using PropTypes
BoxContainer.propTypes = {
    children: PropTypes.node.isRequired, // Ensure that children is a node and is required
};

export default BoxContainer;
