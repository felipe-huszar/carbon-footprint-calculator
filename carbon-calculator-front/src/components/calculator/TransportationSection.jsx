import React, { useContext, useState } from 'react';
import { Typography, TextField, FormControl, InputLabel, Select, MenuItem, Grid, Divider } from '@mui/material';
import CalculatorLayout from './CalculatorLayout';
import { CALCULATE_TRANSPORTATION_EMISSIOSN } from '../../graphql/mutations';
import { useMutation } from '@apollo/client';
import { useTheme } from '@mui/material/styles';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SummaryBox from '../summary/SummaryBox';
import { CalculatorContext } from '../contexts/CalculatorContext';
import { convertInputFields } from '../../graphql/adapters/transportationAdapter';

/* Preferably, validating each input would be best, but for now I will be focusing on making
the calculations work */

const TransportationEnergySection = () => {    
    const theme = useTheme();    

    const {
        carbonFootprintSummary, 
        setCarbonFootprintSummary,
        numVehicles,
        setNumVehicles,
        calculateTransportationEmissionsInput, 
        setCalculateTransportationEmissionsInputs,
        calculateTransportationEmissionsOutput,
        setCalculateTransportationEmissionsOutput
    } = useContext(CalculatorContext); 

    const [calculateTransportationEmission] = useMutation(CALCULATE_TRANSPORTATION_EMISSIOSN); 

    const handleNumVehiclesChange = (event) => {
        const newNumVehicles = Number(event.target.value);
        setNumVehicles(newNumVehicles);
        setCalculateTransportationEmissionsInputs({
            vehicles: Array.from({ length: newNumVehicles }, (_, index) => calculateTransportationEmissionsInput.vehicles[index] || { 
                milesDriven: '', 
                mileageUnit: 'MILES_PER_YEAR', 
                gasMileage: '',
                reductions: {
                    reducedMiles: '',
                    reducedMilesUnit: 'MILES_PER_YEAR',
                    milesperGaloonVehicleReplacement: '',
                }
            })
        });
    };

    const handleVehicleChange = (index, field) => (event) => {
        const newVehicles = [...calculateTransportationEmissionsInput.vehicles];
        newVehicles[index] = { ...newVehicles[index], [field]: event.target.value };   
        
        const newTransportationEmissionsInput = {
            vehicles: newVehicles
        }
        setCalculateTransportationEmissionsInputs(newTransportationEmissionsInput)                    
        calculateEmissions(newTransportationEmissionsInput);
    };

    

    const calculateEmissions = async (input) => {
        try {
            const convertedInput = convertInputFields(input);

            const { data } = await calculateTransportationEmission({
                variables: {
                    input: convertedInput
                },
            });                       
            setCalculateTransportationEmissionsOutput(data.calculateTransportationEmission);  
            setCarbonFootprintSummary(data.calculateTransportationEmission.carbonFootprintSummary);
        } catch (error) {
            console.error('Error calculating emissions:', error);
        }
    };
    
    return (
        
        <CalculatorLayout>            
            <Typography variant="h4" gutterBottom>
                Transportation
            </Typography>            

            <Grid container spacing={1} sx={{ marginTop: theme.spacing(4) }} alignItems="center">          
                <Grid container spacing={1} alignItems="center"> 
                    <Grid item xs={1} sx={{textAlign: 'center'}}>
                        <DirectionsCarIcon fontSize="large" />
                    </Grid>   
                    <Grid item xs={9}>
                        <Typography sx={ theme.typography.gridTitle }>
                            Vehicles
                        </Typography>
                    </Grid>             
                    <Grid item xs={2}>
                        <Typography variant="h6">
                            Estimated CO2 Emissions
                        </Typography>     
                    </Grid>       
                
                    <Grid item xs={1}></Grid>   
                    <Grid item xs={4}>
                        <Typography>
                            How many vehicles does your household have?
                        </Typography>
                    </Grid>             
                    <Grid item xs={7} sx={{display: "flex"}}>
                        <TextField
                            select
                            label="Select before continuing" 
                            onChange={handleNumVehiclesChange}
                            variant="outlined"     
                            sx={{width: '15vw'}}
                            size='small'
                            value={numVehicles}                   
                        >
                            {[0, 1, 2, 3, 4, 5].map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
  
                    </Grid>                    
                    
                    <Grid item xs={12}><Divider /></Grid>
                </Grid>

                {Array.from({ length: numVehicles }, (_, i) => (
                    <React.Fragment key={i}>
                        <Grid item xs={1} sx={{textAlign: 'center'}}>
                            <DirectionsCarIcon fontSize="large" />
                        </Grid>   
                        <Grid item xs={11}>
                            <Typography sx={ theme.typography.gridTitle }>
                                Vehicle {i + 1}
                            </Typography>
                        </Grid>                                                      

                        <Grid item xs={1}></Grid>
                        <Grid item xs={4}>
                            <Typography>
                                On average, miles you drive:
                            </Typography>
                        </Grid>
                        <Grid item xs={5} alignItems='center' sx={{display: 'flex'}}>
                            <TextField                                
                                name={`vehicle${i}milesDriven`}
                                value={calculateTransportationEmissionsInput.vehicles[i].milesDriven}
                                onChange={handleVehicleChange(i, 'milesDriven')}
                                size='small'
                            />
                            <Typography sx={{marginLeft: theme.spacing(1)}}>
                                Miles
                            </Typography>
                            <FormControl fullWidth sx={{ width: '8vw', marginLeft: theme.spacing(1) }}>                                
                                <Select
                                    name={`vehicle${i}_mileageUnit`}
                                    onChange={handleVehicleChange(i, 'mileageUnit')}
                                    size='small'    
                                    value={calculateTransportationEmissionsInput.vehicles[i].mileageUnit}
                                >
                                    <MenuItem value='MILES_PER_YEAR'>Per year</MenuItem>
                                    <MenuItem value='MILES_PER_MONTH'>Per month</MenuItem>                                    
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={2}></Grid>

                        <Grid item xs={1}></Grid>
                        <Grid item xs={4}>
                            <Typography>
                                Average gas mileage:
                            </Typography>
                        </Grid>
                        <Grid item xs={5} alignItems='center' sx={{display: 'flex'}}>                        
                            <TextField                                
                                name={`vehicle${i}_gasMileage`}
                                value={calculateTransportationEmissionsInput.vehicles[i].gasMileage}
                                onChange={handleVehicleChange(i, 'gasMileage')}
                                size='small'
                            />  
                            <Typography sx={{marginLeft: theme.spacing(1)}}>
                                Miles per gallon
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>                                                    
                            <Typography>
                                {calculateTransportationEmissionsOutput.vehicleEmissions && calculateTransportationEmissionsOutput.vehicleEmissions[i] != null
                                    ? `${calculateTransportationEmissionsOutput.vehicleEmissions[i]} lbs.`
                                    : '0 lbs.'
                                }
                            </Typography>
                        </Grid>
                        <Grid item xs={12}><Divider /></Grid>
                    </React.Fragment>
                ))}
                
            </Grid>
            <Typography variant="h4" gutterBottom sx={{ marginTop: theme.spacing(12) }} >
                [-] Reduce Your Emissions
            </Typography>
            <Grid container spacing={1} sx={{ marginTop: theme.spacing(4) }} alignItems="center">          
                {Array.from({ length: numVehicles }, (_, i) => (
                    <React.Fragment key={i}>
                        <Grid container spacing={1} alignItems="center"> 
                            <Grid item xs={1} sx={{textAlign: 'center'}}>
                                <DirectionsCarIcon fontSize="large" />
                            </Grid>   
                            <Grid item xs={9}>
                                <Typography sx={ theme.typography.gridTitle }>
                                    Vehicle {i + 1}
                                </Typography>
                            </Grid>             
                            <Grid item xs={2}>
                                <Typography variant="h6">
                                    Estimated Anual Savings
                                </Typography>     
                            </Grid>       
                
                            <Grid item xs={1} sx={{textAlign: 'center'}}>
                                <Typography>
                                    FREE
                                </Typography>
                            </Grid>   
                            <Grid item xs={4}>
                                <Typography>
                                    Reduce the number of miles you drive by:
                                </Typography>
                            </Grid>             
                            <Grid item xs={5} alignItems='center' sx={{display: "flex"}}>
                                <TextField                                
                                    name={`vehicle${i}_reducedMiles`}
                                    value={calculateTransportationEmissionsInput.vehicles[i].reducedMiles}
                                    onChange={handleVehicleChange(i, 'reducedMiles')}
                                    size='small'
                                />
                                <Typography sx={{marginLeft: theme.spacing(1)}}>
                                    Miles
                                </Typography>
                                <FormControl fullWidth sx={{ width: '8vw', marginLeft: theme.spacing(1) }}>                                
                                    <Select
                                        name={`vehicle${i}_reducedMilesUnit`}
                                        onChange={handleVehicleChange(i, 'reducedMilesUnit')}                          
                                        size='small'    
                                        value={calculateTransportationEmissionsInput.vehicles[i].reducedMilesUnit}
                                    >
                                        <MenuItem value='MILES_PER_YEAR'>Per year</MenuItem>
                                        <MenuItem value='MILES_PER_MONTH'>Per month</MenuItem>                                    
                                    </Select>
                                </FormControl> 
                            </Grid>
                            <Grid item xs={2}>                                
                                {calculateTransportationEmissionsOutput.reductions && calculateTransportationEmissionsOutput.reductions[i] != null
                                    ? `${calculateTransportationEmissionsOutput.reductions[i].milesDriven} lbs.`
                                    : '0 lbs.'
                                }
                            </Grid>

                            <Grid item xs={1} sx={{textAlign: 'center'}}>
                                <Typography>
                                    $$$
                                </Typography>
                            </Grid>   
                            <Grid item xs={4}>
                                <Typography>
                                    Replace vehicle {i+1} with one that gets:
                                </Typography>
                            </Grid>             
                            <Grid item xs={5} alignItems='center' sx={{display: "flex"}}>
                                <TextField                                
                                    name={`vehicle${i}_milesperGaloonVehicleReplacement`}
                                    value={calculateTransportationEmissionsInput.vehicles[i].milesperGaloonVehicleReplacement}
                                    onChange={handleVehicleChange(i, 'milesperGaloonVehicleReplacement')}
                                    size='small'
                                />
                                <Typography sx={{marginLeft: theme.spacing(1)}}>
                                    Miles per gallon
                                </Typography>                                
                            </Grid>
                            <Grid item xs={2}>                                
                                {calculateTransportationEmissionsOutput.reductions && calculateTransportationEmissionsOutput.reductions[i] != null
                                    ? `${calculateTransportationEmissionsOutput.reductions[i].replacedVehicle} lbs.`
                                    : '0 lbs.'
                                }
                            </Grid>
                            <Grid item xs={12}><Divider /></Grid>
                        </Grid>  
                    </React.Fragment>
                ))}
                
                                          
            </Grid>            

            {carbonFootprintSummary && (
                <SummaryBox carbonFootprintSummary={carbonFootprintSummary} />
            )}            
            
        </CalculatorLayout>
        
    );
};

export default TransportationEnergySection;
