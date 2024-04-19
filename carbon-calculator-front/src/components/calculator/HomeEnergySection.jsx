import React, { useContext } from 'react';
import { Typography, TextField, FormControl, InputLabel, Select, MenuItem, Grid, Divider } from '@mui/material';
import CalculatorLayout from './CalculatorLayout';
import { CALCULATE_HOME_ENERGY_EMISSION } from '../../graphql/mutations';
import { useMutation } from '@apollo/client';
import { useTheme } from '@mui/material/styles';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import StarsIcon from '@mui/icons-material/Stars';
import { ReductionCommitmentEnum } from '../../enums/calculatorEnums';
import SummaryBox from '../summary/SummaryBox';
import { CalculatorContext } from '../contexts/CalculatorContext';
import { convertInputFields } from '../../graphql/adapters/homeEnergyAdapter';

/* Preferably, validating each input would be best, but for now I will be focusing on making
the calculations work */

const HomeEnergySection = () => {    
    const theme = useTheme();

    const { 
        carbonFootprintSummary, 
        setCarbonFootprintSummary,
        calculateHomeEnergyEmissionsInput, 
        setCalculateHomeEnergyEmissionInputs,
        calculateHomeEnergyEmissionsOutput,
        setCalculateHomeEnergyEmissionsOutput
    } = useContext(CalculatorContext); 

    const [calculateHomeEnergyEmission] = useMutation(CALCULATE_HOME_ENERGY_EMISSION); 

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const updatedInputs = {
            ...calculateHomeEnergyEmissionsInput,
            [name]: value
        };
        setCalculateHomeEnergyEmissionInputs(updatedInputs);
        calculateEmissions(updatedInputs);
    };

    

    const calculateEmissions = async (input) => {
        try {
            const convertedInput = convertInputFields(input);

            const { data } = await calculateHomeEnergyEmission({
                variables: {
                    input: convertedInput
                },
            });                       
            setCalculateHomeEnergyEmissionsOutput(data.calculateHomeEnergyEmission.homeEnergyEmission);  
            setCarbonFootprintSummary(data.calculateHomeEnergyEmission.carbonFootprintSummary);
        } catch (error) {
            console.error('Error calculating emissions:', error);
        }
    };
    
    return (
        
        <CalculatorLayout>
            <Typography variant="h4" gutterBottom>
                Home Energy
            </Typography>
            <Grid container spacing={3} sx={{ marginTop: theme.spacing(4) }}>
                <Grid item xs={3}>
                    <TextField
                        label="Natural Gas"
                        variant="outlined"
                        name="naturalGasAmount"
                        value={calculateHomeEnergyEmissionsInput.naturalGasAmount}
                        onChange={handleInputChange}
                        fullWidth
                    />                 
                </Grid>                
                <Grid item xs={3}>
                    <TextField
                        label="Electricity"
                        variant="outlined"
                        name="electricityAmount"
                        value={calculateHomeEnergyEmissionsInput.electricityAmount}
                        onChange={handleInputChange}
                        fullWidth
                    />      
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        label="Fuel Oil"
                        variant="outlined"
                        name="fuelOilAmount"
                        value={calculateHomeEnergyEmissionsInput.fuelOilAmount}
                        onChange={handleInputChange}
                        fullWidth
                    />                  
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        label="Propane"
                        variant="outlined"
                        name="propaneAmount"
                        value={calculateHomeEnergyEmissionsInput.propaneAmount}
                        onChange={handleInputChange}
                        fullWidth
                    />                    
                </Grid>

                <Grid item xs={3}>
                    <FormControl fullWidth>
                        <InputLabel>Unit</InputLabel>
                        <Select
                            name="naturalGasUnit"
                            value={calculateHomeEnergyEmissionsInput.naturalGasUnit}
                            onChange={handleInputChange}
                            label="Unit"
                        >
                            <MenuItem value="DOLLARS">Dollars</MenuItem>
                            <MenuItem value="THOUSAND_CUBIC_FEET">Thousands Cubic Feet</MenuItem>
                            <MenuItem value="THERMS">Therms</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                
                <Grid item xs={3}> 
                    <FormControl fullWidth>
                        <InputLabel>Unit</InputLabel>
                        <Select
                            name="electricityUnit"
                            value={calculateHomeEnergyEmissionsInput.electricityUnit}
                            onChange={handleInputChange}
                            label="Unit"
                        >
                            <MenuItem value="DOLLARS">Dollars</MenuItem>
                            <MenuItem value="KWH">KWh</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="% electricity that is green"
                        variant="outlined"
                        name="electricityGreenPercentage"
                        sx={{marginTop: theme.spacing(2)}}
                        value={calculateHomeEnergyEmissionsInput.electricityGreenPercentage}
                        onChange={handleInputChange}
                        fullWidth
                    />  
                </Grid>
                
                <Grid item xs={3}>         
                    <FormControl fullWidth>
                        <InputLabel>Unit</InputLabel>
                        <Select
                            name="fuelOilUnit"
                            value={calculateHomeEnergyEmissionsInput.fuelOilUnit}
                            onChange={handleInputChange}
                            label="Unit"
                        >
                            <MenuItem value="DOLLARS">Dollars</MenuItem>
                            <MenuItem value="GALLONS">Gallons</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                
                <Grid item xs={3}>                   
                    <FormControl fullWidth>
                        <InputLabel>Unit</InputLabel>
                        <Select
                            name="propaneUnit"
                            value={calculateHomeEnergyEmissionsInput.propaneUnit}
                            onChange={handleInputChange}
                            label="Unit"
                        >
                            <MenuItem value="DOLLARS">Dollars</MenuItem>
                            <MenuItem value="GALLONS">Gallons</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sx={{ marginTop: theme.spacing(1) }}>                    
                    <Typography>Estimated pounds of CO2 / year</Typography>
                </Grid>

                
                <Grid item xs={3}>
                    <Typography sx={theme.typography.homeEnergyEmissionItem}>{calculateHomeEnergyEmissionsOutput.naturalGas} lbs.</Typography>
                </Grid>
                
                <Grid item xs={3}> 
                    <Typography sx={theme.typography.homeEnergyEmissionItem}>{calculateHomeEnergyEmissionsOutput.electricity} lbs.</Typography>
                </Grid>
            
                <Grid item xs={3}>         
                    <Typography sx={theme.typography.homeEnergyEmissionItem}>{calculateHomeEnergyEmissionsOutput.fuelOil} lbs.</Typography>
                </Grid>
                
                <Grid item xs={3}>                                      
                    <Typography sx={theme.typography.homeEnergyEmissionItem}>{calculateHomeEnergyEmissionsOutput.propane} lbs.</Typography>
                </Grid>               
                
            </Grid>

            <Typography variant="h4" gutterBottom sx={{ marginTop: theme.spacing(12) }} >
                [-] Reduce Your Emissions
            </Typography>

            <Grid container spacing={1} sx={{ marginTop: theme.spacing(4) }} alignItems="center">          
                <Grid container spacing={1} alignItems="center"> 
                    <Grid item xs={1} sx={{textAlign: 'center'}}>
                        <ThermostatIcon fontSize="large" />
                    </Grid>   
                    <Grid item xs={9}>
                        <Typography sx={ theme.typography.gridTitle }>
                            Heating & Cooling
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
                            Turn up A/C thermostat in summer by
                        </Typography>
                    </Grid>             
                    <Grid item xs={5} sx={{display: "flex"}}>
                        <TextField                        
                            variant="outlined"
                            name="reduceThermostatSummerDegrees"                        
                            onChange={handleInputChange}
                            value={calculateHomeEnergyEmissionsInput.reduceThermostatSummerDegrees}
                            size='small'                      
                        /><Typography sx={{marginLeft: theme.spacing(1)}}>℉</Typography>     
                    </Grid>
                    <Grid item xs={2}>
                        <Typography>{calculateHomeEnergyEmissionsOutput.reductions.reduceThermostatSummer} lbs.</Typography>
                    </Grid>

                    <Grid item xs={1} sx={{textAlign: 'center'}}>
                        <Typography>
                            FREE
                        </Typography>
                    </Grid>   
                    <Grid item xs={4}>
                        <Typography>
                            Turn down heating thermostat on winter nights by
                        </Typography>
                    </Grid>             
                    <Grid item xs={5} sx={{display: "flex"}}>
                        <TextField                        
                            variant="outlined"
                            name="reduceThermostatWinterNightsDegrees"                        
                            onChange={handleInputChange}  
                            value={calculateHomeEnergyEmissionsInput.reduceThermostatWinterNightsDegrees}
                            size='small'                     
                        /><Typography sx={{marginLeft: theme.spacing(1)}}>℉</Typography>     
                    </Grid>
                    <Grid item xs={2}>
                        <Typography>{calculateHomeEnergyEmissionsOutput.reductions.reduceThermostatWinterNights} lbs.</Typography>
                    </Grid>
                    <Grid item xs={12}><Divider /></Grid>
                </Grid>
                
                <Grid container spacing={1} alignItems="center" sx={{marginTop: theme.spacing(2)}}> 
                    <Grid item xs={1} sx={{textAlign: 'center'}}>
                        <LightbulbIcon fontSize="large" />
                    </Grid>   
                    <Grid item xs={9}>
                        <Typography sx={ theme.typography.gridTitle }>
                            Lighting
                        </Typography>
                    </Grid>             
                    <Grid item xs={2}>
                        <Typography variant="h6">
                            Estimated Anual Savings
                        </Typography>     
                    </Grid>       
                
                    <Grid item xs={1} sx={{textAlign: 'center'}}>
                        <Typography>
                            $
                        </Typography>
                    </Grid>   
                    <Grid item xs={4}>
                        <Typography>
                            Replace incandescent lightbulbs with ENERGY STAR ® lights
                        </Typography>
                    </Grid>             
                    <Grid item xs={5}>
                        <TextField                        
                            variant="outlined"
                            name="ledBulbsReplacementCount"  
                            value={calculateHomeEnergyEmissionsInput.ledBulbsReplacementCount}
                            onChange={handleInputChange}
                            size='small'                        
                        />     
                    </Grid>
                    <Grid item xs={2}>
                        <Typography>{calculateHomeEnergyEmissionsOutput.reductions.ledBulbsReplacement} lbs.</Typography>
                    </Grid>                   
                </Grid>
                <Grid item xs={12}><Divider /></Grid>
                <Grid container spacing={1} alignItems="center" sx={{marginTop: theme.spacing(2)}}> 
                    <Grid item xs={1} sx={{textAlign: 'center'}}>
                        <PowerSettingsNewIcon fontSize="large" />
                    </Grid>   
                    <Grid item xs={9}>
                        <Typography sx={ theme.typography.gridTitle }>
                            Power Source & Settings
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
                            Enable the power management features on your computer
                        </Typography>
                    </Grid>             
                    <Grid item xs={5}>
                        <FormControl fullWidth sx={{ width: '12vw' }}>
                            <InputLabel>Choose one</InputLabel>
                            <Select
                                name="enablePowerManagementOnPCCommitment"                                
                                onChange={handleInputChange}                                
                                size='small'
                                value={calculateHomeEnergyEmissionsInput.enablePowerManagementOnPCCommitment}
                            >
                                <MenuItem value={ReductionCommitmentEnum.WILL_DO}>Will do</MenuItem>
                                <MenuItem value={ReductionCommitmentEnum.WILL_NOT_DO}>Will not do</MenuItem>
                                <MenuItem value={ReductionCommitmentEnum.ALREADY_DONE}>Already done</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography>{calculateHomeEnergyEmissionsOutput.reductions.enablePowerManagementOnPC} lbs.</Typography>
                    </Grid>   
                    <Grid item xs={1} sx={{textAlign: 'center'}}>
                        <Typography>
                            $
                        </Typography>
                    </Grid>   
                    <Grid item xs={4}>
                        <Typography>
                            Increase your household Green Power usage by
                        </Typography>
                    </Grid>             
                    <Grid item xs={5} sx={{display: "flex"}}>
                        <TextField                        
                            variant="outlined"
                            name="greenPowerUsageIncrease"                        
                            onChange={handleInputChange}
                            value={calculateHomeEnergyEmissionsInput.greenPowerUsageIncrease}
                            size='small'                        
                        /><Typography sx={{marginLeft: theme.spacing(1)}}>%</Typography>
                    </Grid>                    
                    <Grid item xs={2}>
                        <Typography>{calculateHomeEnergyEmissionsOutput.reductions.greenPowerUsageIncrease} lbs.</Typography>
                    </Grid> 

                </Grid>
                <Grid item xs={12}><Divider /></Grid>
                <Grid container spacing={1} alignItems="center" sx={{marginTop: theme.spacing(2)}}> 
                    <Grid item xs={1} sx={{textAlign: 'center'}}>
                        <LocalLaundryServiceIcon fontSize="large" />
                    </Grid>   
                    <Grid item xs={9}>
                        <Typography sx={ theme.typography.gridTitle }>
                            Washing & Drying
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
                            Wash your clothes in cold water
                        </Typography>
                    </Grid>             
                    <Grid item xs={5} sx={{display: "flex"}}>
                        <FormControl fullWidth sx={{ width: '12vw' }}>
                            <InputLabel>Choose one</InputLabel>
                            <Select
                                name="washingClothesColdWaterCommitment"                                
                                onChange={handleInputChange}  
                                value={calculateHomeEnergyEmissionsInput.washingClothesColdWaterCommitment}
                                size='small'
                            >
                                <MenuItem value={ReductionCommitmentEnum.WILL_DO}>Will do</MenuItem>
                                <MenuItem value={ReductionCommitmentEnum.WILL_NOT_DO}>Will not do</MenuItem>
                                <MenuItem value={ReductionCommitmentEnum.ALREADY_DONE}>Already done</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField sx={{marginLeft: theme.spacing(1)}}                        
                            variant="outlined"
                            name="washingClothesColdWaterLoadsPerWeek"                        
                            onChange={handleInputChange}
                            label="Loads per week"
                            size='small'                        
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Typography>{calculateHomeEnergyEmissionsOutput.reductions.washingClothesColdWater} lbs.</Typography>
                    </Grid>   
                    <Grid item xs={1} sx={{textAlign: 'center'}}>
                        <Typography>
                            FREE
                        </Typography>
                    </Grid>   
                    <Grid item xs={4}>
                        <Typography>
                            Use clothes line or drying rack instead of dryer
                        </Typography>
                    </Grid>             
                    <Grid item xs={5} sx={{display: "flex"}}>
                        <FormControl fullWidth sx={{ width: '12vw' }}>
                            <InputLabel>Choose one</InputLabel>
                            <Select
                                name="lineDryClothingCommitment"                                
                                onChange={handleInputChange}    
                                value={calculateHomeEnergyEmissionsInput.lineDryClothingCommitment}
                                size='small'
                            >
                                <MenuItem value={ReductionCommitmentEnum.WILL_DO}>Will do</MenuItem>
                                <MenuItem value={ReductionCommitmentEnum.WILL_NOT_DO}>Will not do</MenuItem>
                                <MenuItem value={ReductionCommitmentEnum.ALREADY_DONE}>Already done</MenuItem>
                            </Select>
                        </FormControl>   
                        <FormControl fullWidth sx={{ width: '12vw', marginLeft: theme.spacing(1) }}>
                            <InputLabel>Choose one</InputLabel>
                            <Select
                                name="lineDryClothingPercentage"                                
                                onChange={handleInputChange}     
                                value={calculateHomeEnergyEmissionsInput.lineDryClothingPercentage}
                                size='small'
                            >
                                <MenuItem value='100'>All my laundry</MenuItem>
                                <MenuItem value='50'>50% of my laundry</MenuItem>
                                <MenuItem value='20'>20 % of my laundry</MenuItem>
                                <MenuItem value='10'>10 % of my laundry</MenuItem>
                            </Select>
                        </FormControl>                      
                    </Grid>
                    <Grid item xs={2}>
                        <Typography>{calculateHomeEnergyEmissionsOutput.reductions.lineDryClothing} lbs.</Typography>
                    </Grid> 

                </Grid>
                <Grid item xs={12}><Divider /></Grid>
                <Grid container spacing={1} alignItems="center" sx={{marginTop: theme.spacing(2)}}> 
                    <Grid item xs={1} sx={{textAlign: 'center'}}>
                        <StarsIcon fontSize="large" />
                    </Grid>   
                    <Grid item xs={9}>
                        <Typography sx={ theme.typography.gridTitle }>
                            ENERGY STAR Products
                        </Typography>
                    </Grid>             
                    <Grid item xs={2}>
                        <Typography variant="h6">
                            Estimated Anual Savings
                        </Typography>     
                    </Grid>       
                
                    <Grid item xs={1} sx={{textAlign: 'center'}}>
                        <Typography>
                            $$
                        </Typography>
                    </Grid>   
                    <Grid item xs={4}>
                        <Typography>
                            Refrigerator
                        </Typography>
                    </Grid>             
                    <Grid item xs={5} sx={{display: "flex"}}>
                        <FormControl fullWidth sx={{ width: '12vw' }}>
                            <InputLabel>Choose one</InputLabel>
                            <Select
                                name="energyStarRefrigeratorCommitment"                                
                                onChange={handleInputChange}   
                                value={calculateHomeEnergyEmissionsInput.energyStarRefrigeratorCommitment}                             
                                size='small'
                            >
                                <MenuItem value={ReductionCommitmentEnum.WILL_DO}>Will do</MenuItem>
                                <MenuItem value={ReductionCommitmentEnum.WILL_NOT_DO}>Will not do</MenuItem>
                                <MenuItem value={ReductionCommitmentEnum.ALREADY_DONE}>Already done</MenuItem>
                            </Select>
                        </FormControl>                        
                    </Grid>
                    <Grid item xs={2}>
                        <Typography>{calculateHomeEnergyEmissionsOutput.reductions.energyStarRefrigerator} lbs.</Typography>
                    </Grid>   
                    <Grid item xs={1} sx={{textAlign: 'center'}}>
                        <Typography>
                            $$$
                        </Typography>
                    </Grid>   
                    <Grid item xs={4}>
                        <Typography>
                            Furnace or boiler
                        </Typography>
                    </Grid>             
                    <Grid item xs={5} sx={{display: "flex"}}>
                        <FormControl fullWidth sx={{ width: '12vw' }}>
                            <InputLabel>Choose one</InputLabel>
                            <Select
                                name="energyStarFurnaceCommitment"                                
                                onChange={handleInputChange}        
                                value={calculateHomeEnergyEmissionsInput.energyStarFurnaceCommitment}                        
                                size='small'
                            >
                                <MenuItem value={ReductionCommitmentEnum.WILL_DO}>Will do</MenuItem>
                                <MenuItem value={ReductionCommitmentEnum.WILL_NOT_DO}>Will not do</MenuItem>
                                <MenuItem value={ReductionCommitmentEnum.ALREADY_DONE}>Already done</MenuItem>
                            </Select>
                        </FormControl>                                 
                    </Grid>
                    <Grid item xs={2}>
                        <Typography>{calculateHomeEnergyEmissionsOutput.reductions.energyStarFurnace} lbs.</Typography>
                    </Grid> 
                    <Grid item xs={1} sx={{textAlign: 'center'}}>
                        <Typography>
                            $$$
                        </Typography>
                    </Grid>   
                    <Grid item xs={4}>
                        <Typography>
                            Windows
                        </Typography>
                    </Grid>             
                    <Grid item xs={5} sx={{display: "flex"}}>
                        <FormControl fullWidth sx={{ width: '12vw' }}>
                            <InputLabel>Choose one</InputLabel>
                            <Select
                                name="energyStarWindowsCommitment"                                
                                onChange={handleInputChange} 
                                value={calculateHomeEnergyEmissionsInput.energyStarWindowsCommitment}                                  
                                size='small'
                            >
                                <MenuItem value={ReductionCommitmentEnum.WILL_DO}>Will do</MenuItem>
                                <MenuItem value={ReductionCommitmentEnum.WILL_NOT_DO}>Will not do</MenuItem>
                                <MenuItem value={ReductionCommitmentEnum.ALREADY_DONE}>Already done</MenuItem>
                            </Select>
                        </FormControl>                                                
                    </Grid>
                    <Grid item xs={2}>
                        <Typography>{calculateHomeEnergyEmissionsOutput.reductions.energyStarWindows} lbs.</Typography>
                    </Grid>
                </Grid>                                
            </Grid>
            <Divider sx={{marginTop: theme.spacing(8)}} />

            {carbonFootprintSummary && (
                <SummaryBox carbonFootprintSummary={carbonFootprintSummary} />
            )}            
            
        </CalculatorLayout>
        
    );
};

export default HomeEnergySection;
