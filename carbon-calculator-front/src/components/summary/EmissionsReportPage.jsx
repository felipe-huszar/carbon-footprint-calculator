import React, { useEffect, useContext } from 'react';
import { useMutation } from '@apollo/client';
import { Button, Box, Typography, Grid, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import SummaryBox from './SummaryBox';
import CalculatorLayout from '../calculator/CalculatorLayout';
import { GENERATE_EMISSIONS_REPORT } from '../../graphql/mutations';
import { CalculatorContext } from '../contexts/CalculatorContext';
import { convertInputFields as convertInputFieldsHome } from '../../graphql/adapters/homeEnergyAdapter';
import { convertInputFields as convertInputFieldsTransportation } from '../../graphql/adapters/transportationAdapter';
import { convertInputFields as convertInputFieldsWaste } from '../../graphql/adapters/wasteAdapter';


const EmissionsReportPage = () => {
    const [getEmissionsReport, { data, loading, error }] = useMutation(GENERATE_EMISSIONS_REPORT);
    const navigate = useNavigate();
    const theme = useTheme();

    const {         
        calculateHomeEnergyEmissionsInput, 
        calculateTransportationEmissionsInput,
        calculateWasteEmissionsInput,
    } = useContext(CalculatorContext); 

    useEffect(() => {
        const input = {
            variables: {
                input: {
                    homeEnergyParameters: convertInputFieldsHome(calculateHomeEnergyEmissionsInput),
                    transportationParameters: convertInputFieldsTransportation(calculateTransportationEmissionsInput),
                    wasteParameters: convertInputFieldsWaste(calculateWasteEmissionsInput),
                }
            }          
        }  
        getEmissionsReport(input);
    }, [getEmissionsReport]);

    if (loading) return <CircularProgress />;
    
    if (error) {
        console.error('GraphQL Error:', error);
        console.error('GraphQL Errors:', error.graphQLErrors);
        console.error('Network Error:', error.networkError);
        console.error('Extra Error Info:', error.extraInfo);
    }
    
    const { homeEnergySumary, transportationSumary, wasteSumary, totalSumary } = data?.generateEmissionsReport || {};

    return (
        <CalculatorLayout>
            <Typography variant="h4" gutterBottom>
                Emissions Report
            </Typography>
            {error && (
                <Typography color="error">Error: {error.message}</Typography>
            )}
            <Grid container spacing={4}>
                {homeEnergySumary && (
                    <Grid item xs={12} md={6}>
                        <SummaryBox carbonFootprintSummary={homeEnergySumary} title="Home Energy Summary" />
                    </Grid>
                )}
                {transportationSumary && (
                    <Grid item xs={12} md={6}>
                        <SummaryBox carbonFootprintSummary={transportationSumary} title="Transportation Summary" />
                    </Grid>
                )}
                {wasteSumary && (
                    <Grid item xs={12} md={6}>
                        <SummaryBox carbonFootprintSummary={wasteSumary} title="Waste Summary" />
                    </Grid>
                )}
                {totalSumary && (
                    <Grid item xs={12} md={6}>
                        <SummaryBox carbonFootprintSummary={totalSumary} title="Total Summary" />
                    </Grid>
                )}
            </Grid>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/calculator/home-energy')}
                sx={{ marginTop: theme.spacing(4) }}
            >
                Go back to Calculator
            </Button>
        </CalculatorLayout>
    );
};

export default EmissionsReportPage;
