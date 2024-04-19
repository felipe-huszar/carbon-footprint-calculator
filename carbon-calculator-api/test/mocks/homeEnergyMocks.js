const defaultCalculationMock = {    
    naturalGasAmount: 100,
    naturalGasUnit: "DOLLARS",
    electricityAmount: 500,
    electricityUnit: "KWH",
    electricityGreenPercentage: 20,
    fuelOilAmount: 200,
    fuelOilUnit: "GALLONS",
    propaneAmount: 150, 
    propaneUnit: "GALLONS",
    reductions: {
        reduceThermostatSummerDegrees: 3,
        reduceThermostatWinterNightsDegrees: 2,
        ledBulbsReplacementCount: 10,
        enablePowerManagementOnPCCommitment: "WILL_DO",
        greenPowerUsageIncrease: 5,
        washingClothesColdWaterCommitment: "WILL_DO", 
        washingClothesColdWaterLoadsPerWeek: 3, 
        lineDryClothingCommitment: "WILL_DO",
        lineDryClothingPercentage: 50,
        energyStarRefrigeratorCommitment: "WILL_DO",
        energyStarFurnaceCommitment: "WILL_NOT_DO",
        energyStarWindowsCommitment: "ALREADY_DONE"
    }
};

const defaultCalculationReturnMock = {
    homeEnergyEmission: {
        naturalGas: 380,
        electricity: 960,
        fuelOil: 4480,
        propane: 1905,
        reductions: {
            reduceThermostatSummer: 6,
            reduceThermostatWinterNights: 8,
            ledBulbsReplacement: 15,
            enablePowerManagementOnPC: 150,
            greenPowerUsageIncrease: 1.5,
            washingClothesColdWater: 1.5,
            lineDryClothing: 200,
            energyStarRefrigerator: 10,
            //energyStarFurnace: null, ommited, since will not do
            energyStarWindows: 3
        }
    }
};

module.exports = { defaultCalculationMock, defaultCalculationReturnMock };