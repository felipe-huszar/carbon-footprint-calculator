// HomePage.jsx

import React, { useState, useContext } from 'react';
import { Typography, TextField, Button, Alert } from '@mui/material';
import { CalculatorContext } from '../components/contexts/CalculatorContext';
import CalculateIcon from '@mui/icons-material/Calculate'; 
import { CONFIGURE_INITIAL_PARAMETERS } from '../graphql/mutations';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import BoxContainer from '../components/common/BoxContainer'; // Import the reusable BoxContainer component

const HomePage = () => {
    const [configureParameters] = useMutation(CONFIGURE_INITIAL_PARAMETERS);
    const navigate = useNavigate();
    const { 
        numPeopleHousehold, setNumPeopleHousehold,
        carbonFootprintSummary, setCarbonFootprintSummary,
    } = useContext(CalculatorContext);

    const [zipCode, setZipCode] = useState('');
    const [error, setError] = useState(null);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'numberOfPeopleHoulsehold') {
            setNumPeopleHousehold(parseInt(value, 10));
        } else if (name === 'zipCode') {
            setZipCode(value);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const { data } = await configureParameters({
                variables: {
                    input: {
                        numberOfPeoplehousehold: numPeopleHousehold,
                        zipCode: zipCode,
                    },
                },
            });

            if (data.configureInitialParameters) {
                setCarbonFootprintSummary(data.configureInitialParameters.carbonFootprintSummary);
                navigate('/calculator/home-energy');
            } else {
                setError(`Could not fetch initial parameters, try again latter`);
            }
        } catch (error) {
            console.error('Error configuring initial parameters:', error);
            setError(`Error configuring initial calculation parameters: ${error}`);
        }
    };

    return (
        <BoxContainer>
            <CalculateIcon fontSize="large" sx={{ mb: 2 }} />
            <Typography variant="h4" gutterBottom component="h1">
                Carbon Footprint Calculator
            </Typography>
            <TextField
                name='numberOfPeopleHoulsehold'
                fullWidth
                label="Number of people in your household"
                variant="outlined"
                margin="normal"
                sx={{ mb: 2 }}
                onChange={handleInputChange}
            />
            <TextField
                name='zipCode'
                fullWidth
                label="ZIP Code"
                variant="outlined"
                margin="normal"
                sx={{ mb: 3 }}
                onChange={handleInputChange}
            />
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large" 
                type="submit"
                onClick={handleSubmit}
            >
                Get Started
            </Button>
        </BoxContainer>
    );
};

export default HomePage;
