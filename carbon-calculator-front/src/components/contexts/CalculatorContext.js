import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import { ReductionCommitmentEnum } from '../../enums/calculatorEnums';

// Creating the context
export const CalculatorContext = createContext();

export const CalculatorProvider = ({ children }) => {
    const [carbonFootprintSummary, setCarbonFootprintSummary] = useState({
        currentTotalEmission: 0,
        currentTotalEmissionAfterPlannedActions: 0,
        usAverage: 0,
    });

    const [calculateHomeEnergyEmissionsInput, setCalculateHomeEnergyEmissionInputs] = useState({
        naturalGasAmount: 0,
        naturalGasUnit: 'DOLLARS',
        electricityAmount: 0,
        electricityUnit: 'DOLLARS',
        electricityGreenPercentage: 0,
        fuelOilAmount: 0,
        fuelOilUnit: 'DOLLARS',
        propaneAmount: 0, 
        propaneUnit: 'DOLLARS',        
        reduceThermostatSummerDegrees: 0,
        reduceThermostatWinterNightsDegrees: 0,
        ledBulbsReplacementCount: 0,
        enablePowerManagementOnPCCommitment: ReductionCommitmentEnum.WILL_NOT_DO,
        greenPowerUsageIncrease: 0,
        washingClothesColdWaterCommitment: ReductionCommitmentEnum.WILL_NOT_DO,
        washingClothesColdWaterLoadsPerWeek: 0,
        lineDryClothingCommitment: ReductionCommitmentEnum.WILL_NOT_DO,
        lineDryClothingPercentage: 0,
        energyStarRefrigeratorCommitment: ReductionCommitmentEnum.WILL_NOT_DO,
        energyStarFurnaceCommitment: ReductionCommitmentEnum.WILL_NOT_DO,
        energyStarWindowsCommitment: ReductionCommitmentEnum.WILL_NOT_DO
        
    });

    const [calculateHomeEnergyEmissionsOutput, setCalculateHomeEnergyEmissionsOutput] = useState({
        naturalGas: 0,
        electricity: 0,
        fuelOil: 0,
        propane: 0,
        reductions: {
            reduceThermostatSummer: 0,
            reduceThermostatWinterNights: 0,
            ledBulbsReplacement: 0,
            enablePowerManagementOnPC: 0,
            greenPowerUsageIncrease: 0,
            washingClothesColdWater: 0,
            lineDryClothing: 0,
            energyStarRefrigerator: 0,
            energyStarFurnace: 0,
            energyStarWindows: 0,
        }
    });

    const [numVehicles, setNumVehicles] = useState(0); 

    const [calculateTransportationEmissionsInput, setCalculateTransportationEmissionsInputs] = useState({
        vehicles: []
    });

    const [calculateTransportationEmissionsOutput, setCalculateTransportationEmissionsOutput] = useState({
        vehicleEmissions: [],
        reductions: [],
    });

    const [numPeopleHousehold, setNumPeopleHousehold] = useState(0);

    const [calculateWasteEmissionsInput, setCalculateWasteEmissionsInputs] = useState({
        recycleAluminumSteelCans: false,
        recyclePlastic: false,
        recycleGlass: false,
        recycleNewspaper: false,
        recycleMagazines: false,    
        startrecycleAluminumSteelCans: false,
        startrecyclePlastic: false,
        startrecycleGlass: false,
        startrecycleNewspaper: false,
        startrecycleMagazines: false        
    });

    const [calculateWasteEmissionsOutput, setCalculateWasteEmissionsOutput] = useState({
        wasteRecycling: 0,
        emissionAfterRecycling: 0,
        wasteReduction: 0
    });

    return (
        <CalculatorContext.Provider value={{
            numPeopleHousehold, 
            setNumPeopleHousehold,
            carbonFootprintSummary, 
            setCarbonFootprintSummary,
            calculateHomeEnergyEmissionsInput, 
            setCalculateHomeEnergyEmissionInputs,
            calculateHomeEnergyEmissionsOutput, 
            setCalculateHomeEnergyEmissionsOutput,
            numVehicles,
            setNumVehicles,
            calculateTransportationEmissionsInput,
            setCalculateTransportationEmissionsInputs,
            calculateTransportationEmissionsOutput,
            setCalculateTransportationEmissionsOutput,
            calculateWasteEmissionsInput,
            setCalculateWasteEmissionsInputs,
            calculateWasteEmissionsOutput,
            setCalculateWasteEmissionsOutput
        }}>
            {children}
        </CalculatorContext.Provider>
    );
};

CalculatorProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
