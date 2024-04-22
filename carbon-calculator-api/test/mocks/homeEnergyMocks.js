const { HomeEmissionsUnit } = require('../../src/enums/homeEnergyEnums');
const { ReductionCommitmentEnum } = require('../../src/enums/carbonFootprintEnums');

const defaultCalculationMock = {    
    naturalGasAmount: 120,
    naturalGasUnit: HomeEmissionsUnit.DOLLARS,
    electricityAmount: 180,
    electricityGreenPercentage: 5,
    electricityUnit: HomeEmissionsUnit.DOLLARS,
    fuelOilAmount: 290,
    fuelOilUnit: HomeEmissionsUnit.DOLLARS,
    propaneAmount: 120,
    propaneUnit: HomeEmissionsUnit.DOLLARS,
    reductions: {
        reduceThermostatSummerDegrees: 5,
        reduceThermostatWinterNightsDegrees: 10,
        ledBulbsReplacementCount: 5,
        enablePowerManagementOnPCCommitment: ReductionCommitmentEnum.WILL_DO,
        greenPowerUsageIncrease: 10,
        washingClothesColdWaterCommitment: ReductionCommitmentEnum.WILL_NOT_DO,
        washingClothesColdWaterLoadsPerWeek: 0,
        lineDryClothingCommitment: ReductionCommitmentEnum.ALREADY_DONE,
        lineDryClothingPercentage: 20,
        energyStarRefrigeratorCommitment: ReductionCommitmentEnum.WILL_DO,
        energyStarFurnaceCommitment: ReductionCommitmentEnum.WILL_NOT_DO,
        energyStarWindowsCommitment: ReductionCommitmentEnum.ALREADY_DONE
    }
};

const defaultCalculationReturnMock = {
    homeEnergyEmission: {
        naturalGas: 456,
        electricity: 93.6,
        fuelOil: 3451,
        propane: 1094.4,
        reductions: {
            reduceThermostatSummer: 10,
            reduceThermostatWinterNights: 40,
            ledBulbsReplacement: 7.5,
            enablePowerManagementOnPC: 15,
            greenPowerUsageIncrease: 3,
            washingClothesColdWater: 0,
            lineDryClothing: 80,
            energyStarRefrigerator: 10,
            energyStarFurnace: 0,
            energyStarWindows: 3,
        },
    },
    carbonFootprintSummary: {
        currentTotalEmission: 6395,
        currentTotalEmissionAfterPlannedActions: 6309.5,
        usAverage: 5600,
    },
};

module.exports = { defaultCalculationMock, defaultCalculationReturnMock };