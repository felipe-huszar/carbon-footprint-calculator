import React, { useContext, useEffect, useState } from 'react';
import { Typography, FormGroup, FormControl, FormControlLabel, Checkbox, Grid, Divider } from '@mui/material';
import CalculatorLayout from './CalculatorLayout';
import { CALCULATE_WASTE_EMISSIOSN } from '../../graphql/mutations';
import { GET_AVERAGE_WASTE } from '../../graphql/queries';
import { useMutation } from '@apollo/client';
import { useQuery } from '@apollo/client';
import { useTheme } from '@mui/material/styles';
import DeleteIcon  from '@mui/icons-material/Delete';
import LoopIcon from '@mui/icons-material/Loop';
import SummaryBox from '../summary/SummaryBox';
import { CalculatorContext } from '../contexts/CalculatorContext';
import { convertInputFields } from '../../graphql/adapters/wasteAdapter';

/* Preferably, validating each input would be best, but for now I will be focusing on making
the calculations work */

const WasteSection = () => {    
    const theme = useTheme();

    const { 
        numPeopleHousehold,
        carbonFootprintSummary, 
        setCarbonFootprintSummary,
        calculateWasteEmissionsInput,
        setCalculateWasteEmissionsInputs,
        calculateWasteEmissionsOutput,
        setCalculateWasteEmissionsOutput
    } = useContext(CalculatorContext); 

    const { loading, error, data: averageWasteData } = useQuery(GET_AVERAGE_WASTE, {
        variables: {
            numberOfPersons: numPeopleHousehold,          
        }
    });
    
    const [calculateWasteEmission] = useMutation(CALCULATE_WASTE_EMISSIOSN); 

    const [averageWastehouseholdPersons, setAverageWastehouseholdPersons] = useState('')
    
    useEffect(() => {        
        if (averageWasteData) {
            setAverageWastehouseholdPersons(averageWasteData.getAverageWaste);
        }
    }, [averageWasteData, setCalculateWasteEmissionsOutput, setCarbonFootprintSummary]);

    const handleCheckboxChange  = (event) => {
        const { name, checked  } = event.target;
        const updatedInputs = {
            ...calculateWasteEmissionsInput,
            [name]: checked
        };
        setCalculateWasteEmissionsInputs(updatedInputs);
        calculateEmissions(updatedInputs);
    };    

    const calculateEmissions = async (input) => {
        try {
            const convertedInput = convertInputFields(input);

            const { data } = await calculateWasteEmission({
                variables: {
                    input: convertedInput
                },
            });                       
            setCalculateWasteEmissionsOutput(data.calculateWasteEmission.waste);  
            setCarbonFootprintSummary(data.calculateWasteEmission.carbonFootprintSummary);
        } catch (error) {
            console.error('Error calculating emissions:', error);
        }
    };
    
    
    return (
        
        <CalculatorLayout>            
            <Typography variant="h4" gutterBottom>
                Waste
            </Typography>
            
            <Grid container spacing={1} sx={{ marginTop: theme.spacing(4) }} alignItems="center">          
                <Grid container spacing={1} alignItems="center"> 
                    <Grid item xs={1} sx={{textAlign: 'center'}}>
                        <DeleteIcon fontSize="large" />
                    </Grid>   
                    <Grid item xs={9}>
                        <Typography sx={ theme.typography.gridTitle }>
                            Waste
                        </Typography>
                    </Grid>             
                    <Grid item xs={2}>
                        <Typography variant="h6">
                            Estimated CO2 Emissions
                        </Typography>     
                    </Grid>       
                
                    <Grid item xs={1}></Grid>   
                    <Grid item xs={9}>
                        <Typography>
                            Average waste emissions for a household of 2 people:
                        </Typography>
                    </Grid>       
                    <Grid item xs={2}>
                        <Typography>{averageWastehouseholdPersons} lbs.</Typography>
                    </Grid>     

                    <Grid item xs={1} sx={{textAlign: 'center'}}>
                        <Typography>
                            FREE
                        </Typography>    
                    </Grid>   
                    <Grid item xs={9}>
                        <Typography>
                            Which of the following products do you currently recycle in your household? 
                        </Typography>
                        <FormControl component="fieldset" variant="standard">
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={calculateWasteEmissionsInput.recycleAluminumSteelCans}
                                            onChange={handleCheckboxChange}
                                            name="recycleAluminumSteelCans"
                                        />
                                    }
                                    label="Aluminum & steel cans"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={calculateWasteEmissionsInput.recyclePlastic}
                                            onChange={handleCheckboxChange}
                                            name="recyclePlastic"
                                        />
                                    }
                                    label="Plastic"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={calculateWasteEmissionsInput.recycleGlass}
                                            onChange={handleCheckboxChange}
                                            name="recycleGlass"
                                        />
                                    }
                                    label="Glass"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={calculateWasteEmissionsInput.recycleNewspaper}
                                            onChange={handleCheckboxChange}
                                            name="recycleNewspaper"
                                        />
                                    }
                                    label="Newspaper"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={calculateWasteEmissionsInput.recycleMagazines}
                                            onChange={handleCheckboxChange}
                                            name="recycleMagazines"
                                        />
                                    }
                                    label="Magazines"
                                />
                            </FormGroup>
                        </FormControl>
                    </Grid>       
                    <Grid item xs={2}>
                        <Typography>{calculateWasteEmissionsOutput.wasteRecycling} lbs.</Typography>
                    </Grid>               
                
                    <Grid item xs={1}></Grid>   
                    <Grid item xs={9}>
                        <Typography>
                            Your total waste emissions after recycling:
                        </Typography>
                    </Grid>       
                    <Grid item xs={2}>
                        <Typography>{calculateWasteEmissionsOutput.emissionAfterRecycling} lbs.</Typography>
                    </Grid>  
                                   
                    
                    <Grid item xs={12}><Divider /></Grid>
                </Grid>
            </Grid>

            <Typography variant="h4" gutterBottom sx={{ marginTop: theme.spacing(4) }} >
                [-] Reduce Your Emissions
            </Typography>

            <Grid container spacing={1} sx={{ marginTop: theme.spacing(4) }} alignItems="center">          
                <Grid container spacing={1} alignItems="center"> 
                    <Grid item xs={1} sx={{textAlign: 'center'}}>
                        <LoopIcon fontSize="large" />
                    </Grid>   
                    <Grid item xs={9}>
                        <Typography sx={ theme.typography.gridTitle }>
                            Start recycling the materials you don&apos;t currently recycle 
                        </Typography>
                    </Grid>             
                    <Grid item xs={2}>
                        <Typography variant="h6">
                            Estimated anual savings
                        </Typography>     
                    </Grid>                               

                    <Grid item xs={1} sx={{textAlign: 'center'}}>
                        <Typography>
                            $
                        </Typography>    
                    </Grid>   
                    <Grid item xs={9}>                        
                        <FormControl component="fieldset" variant="standard">
                            <FormGroup>
                                {!calculateWasteEmissionsInput.recycleAluminumSteelCans && (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={calculateWasteEmissionsInput.startRecycleAluminumSteelCans}
                                                onChange={handleCheckboxChange}
                                                name="startRecycleAluminumSteelCans"
                                            />
                                        }
                                        label="Aluminum & steel cans"
                                    />
                                )}
                                {!calculateWasteEmissionsInput.recyclePlastic && (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={calculateWasteEmissionsInput.startRecyclePlastic}
                                                onChange={handleCheckboxChange}
                                                name="startRecyclePlastic"
                                            />
                                        }
                                        label="Plastic"
                                    />
                                )}
                                {!calculateWasteEmissionsInput.recycleGlass && (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={calculateWasteEmissionsInput.startRecycleGlass}
                                                onChange={handleCheckboxChange}
                                                name="startRecycleGlass"
                                            />
                                        }
                                        label="Glass"
                                    />
                                )}
                                {!calculateWasteEmissionsInput.recycleNewspaper && (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={calculateWasteEmissionsInput.startRecycleNewspaper}
                                                onChange={handleCheckboxChange}
                                                name="startRecycleNewspaper"
                                            />
                                        }
                                        label="Newspaper"
                                    />
                                )}
                                {!calculateWasteEmissionsInput.recycleMagazines && (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={calculateWasteEmissionsInput.startRecycleMagazines}
                                                onChange={handleCheckboxChange}
                                                name="startRecycleMagazines"
                                            />
                                        }
                                        label="Magazines"
                                    />
                                )}
                            </FormGroup>                                
                        </FormControl>
                    </Grid>       
                    <Grid item xs={2}>
                        <Typography>{calculateWasteEmissionsOutput.wasteReduction} lbs.</Typography>
                    </Grid>                                                                  
                    
                    <Grid item xs={12}><Divider /></Grid>
                </Grid>
            </Grid>
            
            <Divider sx={{marginTop: theme.spacing(8)}} />

            {carbonFootprintSummary && (
                <SummaryBox carbonFootprintSummary={carbonFootprintSummary} />
            )}            
            
        </CalculatorLayout>
        
    );
};

export default WasteSection;
