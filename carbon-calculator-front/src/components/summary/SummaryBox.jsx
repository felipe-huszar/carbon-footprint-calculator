import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import PropTypes from 'prop-types';

const SummaryBox = ({ carbonFootprintSummary, title }) => {
    if (!carbonFootprintSummary) {
        return null;
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Paper sx={{ width: '100%', padding: 3 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    {title}
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12}>
                        <Paper variant="outlined" sx={{ padding: 2, textAlign: 'center' }}>
                            <Typography variant="h5">Your Current Total:</Typography>
                            <Typography variant="h6" sx={{ fontSize: '1.2rem', marginTop: 1 }}>
                                {carbonFootprintSummary.currentTotalEmission} lbs.
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper variant="outlined" sx={{ padding: 2, textAlign: 'center' }}>
                            <Typography variant="h6">New total after your planned actions:</Typography>
                            <Typography variant="h6" sx={{ fontSize: '1.2rem', marginTop: 1 }}>
                                {carbonFootprintSummary.currentTotalEmissionAfterPlannedActions} lbs.
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper variant="outlined" sx={{ padding: 2, textAlign: 'center' }}>
                            <Typography variant="h6">U.S. Average:</Typography>
                            <Typography variant="h6" sx={{ fontSize: '1.2rem', marginTop: 1 }}>
                                {carbonFootprintSummary.usAverage} lbs.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

SummaryBox.propTypes = {
    carbonFootprintSummary: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
};

export default SummaryBox;
