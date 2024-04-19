const { fetchEmissionFactors } = require('../../../infrastructure/client/emissionFactorsClient');
const { HomeEmissionsUnit } = require('../../../enums/homeEnergyEnums');
const { ReductionCommitmentEnum, CarbonFootprintCategory } = require('../../../enums/carbonFootprintEnums');
const  carbonFootprintRepository  = require('../../../infrastructure/repository/carbonFootprintRepository');
const  utils  = require('../../../utils/utils');

async function generateEmissionsSummary(input) {
  
    if (utils.hasNegativeValues(input)) {
        throw new Error('Input data cannot have negative numbers');
    }
    
    const factors = await fetchEmissionFactors();

    const naturalGasEmissions = await calculateNaturalGasEmissions(input.naturalGasAmount, input.naturalGasUnit, factors.homeEnergy);
    const electricityEmissions = await calculateEletricityEmissions(input.electricityAmount, input.electricityGreenPercentage, input.electricityUnit, factors.homeEnergy);
    const fuelOilEmissions = await calculateFuelOilEmissions(input.fuelOilAmount, input.fuelOilUnit, factors.homeEnergy);
    const propaneEmissions = await calculatePropaneEmissions(input.propaneAmount, input.propaneUnit, factors.homeEnergy);

    const calculatedReductions = await calculateReductions(input.reductions, factors.homeEnergy.reduction);
  
    const totalEmissions = electricityEmissions + naturalGasEmissions + fuelOilEmissions + propaneEmissions;
    const totalEmissionsDone = totalEmissions - calculatedReductions.totals.reductionsDone;
    const totalEmissionsPlanned = totalEmissionsDone - calculatedReductions.totals.reductionsPlanned;        

    const sumaryHomeEnergy = {
        currentTotalEmission: totalEmissionsDone,
        currentTotalEmissionAfterPlannedActions: totalEmissionsPlanned,
    };

    const homeEnergyEmission = {
        naturalGas: naturalGasEmissions,
        electricity: electricityEmissions,
        fuelOil: fuelOilEmissions,
        propane: propaneEmissions,
        reductions: calculatedReductions.reductions,
    };

    carbonFootprintRepository.setSectionSummary(CarbonFootprintCategory.HOME_ENERGY, sumaryHomeEnergy);

    const homeEnergyEmissionOutput = utils.roundDeep(homeEnergyEmission);
    const carbonFootprintSummaryOutput = utils.roundDeep(carbonFootprintRepository.getTotalSummary());

    return {        
        homeEnergyEmission: homeEnergyEmissionOutput,
        carbonFootprintSummary: carbonFootprintSummaryOutput,
    };
}

async function calculateNaturalGasEmissions(naturalGasAmount, naturalGasUnit, factors) {
    switch(naturalGasUnit) {
    case HomeEmissionsUnit.DOLLARS:
        return naturalGasAmount * factors.naturalGas.dollars;            
    case HomeEmissionsUnit.THERMS:
        return naturalGasAmount * factors.naturalGas.therms;            
    case HomeEmissionsUnit.THOUSAND_CUBIC_FEET:
        return naturalGasAmount * factors.naturalGas.thousandCubicFeet;            
    } 
}

async function calculateEletricityEmissions(electricityAmount, greenPercentage, electricityUnit, factors) {
    const greenFactor = greenPercentage / 100;
    const totalNonGreen = electricityAmount * (1 - greenFactor);
    const totalGreen = electricityAmount * greenFactor;

    switch(electricityUnit) {
    case HomeEmissionsUnit.DOLLARS:        
        const totalNonGreenDollars = totalNonGreen * factors.electricity.green.dollars;
        const totalGreenDollars = totalGreen * factors.electricity.green.dollars;
        return totalNonGreenDollars + totalGreenDollars;
    case HomeEmissionsUnit.KWH:        
        const totalNonGreenKwh = totalNonGreen * factors.electricity.notGreen.kwh;
        const totalGreenKwh = totalGreen * factors.electricity.notGreen.kwh;
        return totalNonGreenKwh + totalGreenKwh;
    } 
}

async function calculateFuelOilEmissions(fuelOilAmount, fuelOilUnit, factors) {
    switch(fuelOilUnit) {
    case HomeEmissionsUnit.DOLLARS:
        return fuelOilAmount * factors.fuelOil.dollars;
    case HomeEmissionsUnit.GALLONS:
        return fuelOilAmount * factors.fuelOil.gallons;        
    } 
}

async function calculatePropaneEmissions(propaneAmount, propaneUnit, factors) {
    switch(propaneUnit) {
    case HomeEmissionsUnit.DOLLARS:
        return propaneAmount * factors.propane.dollars;
    case HomeEmissionsUnit.GALLONS:
        return propaneAmount * factors.propane.gallons;        
    } 
}

async function calculateReductions(input, factors) {
    let reductionsDone = 0;
    let reductionsPlanned = 0;    
    let reductions = {};

    reductions.reduceThermostatSummer = input.reduceThermostatSummerDegrees * factors.thermostatAdjustment.perDegreeSummer;
    reductions.reduceThermostatWinterNights = input.reduceThermostatWinterNightsDegrees * factors.thermostatAdjustment.perDegreeWinterNights;
    reductions.ledBulbsReplacement = input.ledBulbsReplacementCount * factors.ledBulbReplacement.perBulb;
    reductions.greenPowerUsageIncrease = input.greenPowerUsageIncrease * factors.greenPowerUsage.perUnit;    
    reductions.washingClothesColdWater = input.washingClothesColdWaterLoadsPerWeek * factors.washClothesInColdWater.perLoad;
    reductions.lineDryClothing = input.lineDryClothingPercentage * factors.useClothesLineOrDryigRack;

    if (input.reduceThermostatSummerDegrees) {        
        reductionsPlanned += reductions.reduceThermostatSummer;
    }

    if (input.reduceThermostatWinterNightsDegrees) {        
        reductionsPlanned += reductions.reduceThermostatWinterNights;
    }

    if (input.ledBulbsReplacementCount) {        
        reductionsPlanned += reductions.ledBulbsReplacement
    }

    if (input.greenPowerUsageIncrease) {        
        reductionsPlanned += reductions.greenPowerUsageIncrease;
    }

    const enablePowerManagementOnPCCommitment = input.enablePowerManagementOnPCCommitment;
    if (enablePowerManagementOnPCCommitment !== ReductionCommitmentEnum.WILL_NOT_DO) {        
        reductions.enablePowerManagementOnPC = factors.powerManagementFeatureOnPc;
        if (enablePowerManagementOnPCCommitment === ReductionCommitmentEnum.ALREADY_DONE) {
            reductionsDone += reductions.enablePowerManagementOnPC;
        } else if (enablePowerManagementOnPCCommitment === ReductionCommitmentEnum.WILL_DO) {
            reductionsPlanned += reductions.enablePowerManagementOnPC;
        }            
    } else { reductions.enablePowerManagementOnPC = 0; }

    const washingClothesColdWaterCommitment = input.washingClothesColdWaterCommitment;
    if (washingClothesColdWaterCommitment !== ReductionCommitmentEnum.WILL_NOT_DO) {        
        if (washingClothesColdWaterCommitment === ReductionCommitmentEnum.ALREADY_DONE) {
            reductionsDone += reductions.washingClothesColdWater;
        } else if (washingClothesColdWaterCommitment === ReductionCommitmentEnum.WILL_DO) {
            reductionsPlanned += reductions.washingClothesColdWater;
        }            
    } 

    const lineDryClothingCommitment = input.lineDryClothingCommitment;
    if (lineDryClothingCommitment !== ReductionCommitmentEnum.WILL_NOT_DO) {        
        if (lineDryClothingCommitment === ReductionCommitmentEnum.ALREADY_DONE) {
            reductionsDone += reductions.lineDryClothing;
        } else if (lineDryClothingCommitment === ReductionCommitmentEnum.WILL_DO) {
            reductionsPlanned += reductions.lineDryClothing;
        }            
    }

    const energyStarRefrigeratorCommitment = input.energyStarRefrigeratorCommitment;
    if (energyStarRefrigeratorCommitment !== ReductionCommitmentEnum.WILL_NOT_DO) {
        reductions.energyStarRefrigerator = factors.energyStartProducts.refrigerator;
        if (energyStarRefrigeratorCommitment === ReductionCommitmentEnum.ALREADY_DONE) {
            reductionsDone += reductions.energyStarRefrigerator;
        } else if (energyStarRefrigeratorCommitment === ReductionCommitmentEnum.WILL_DO) {
            reductionsPlanned += reductions.energyStarRefrigerator;
        }            
    } else { reductions.energyStarRefrigerator = 0 }

    const energyStarFurnaceCommitment = input.energyStarFurnaceCommitment;
    if (energyStarFurnaceCommitment !== ReductionCommitmentEnum.WILL_NOT_DO) {
        reductions.energyStarFurnace = factors.energyStartProducts.furnanceOrBoiler;
        if (energyStarFurnaceCommitment === ReductionCommitmentEnum.ALREADY_DONE) {
            reductionsDone += reductions.energyStarFurnace;
        } else if (energyStarFurnaceCommitment === ReductionCommitmentEnum.WILL_DO) {
            reductionsPlanned += reductions.energyStarFurnace;
        }            
    }  else { reductions.energyStarFurnace = 0 }

    const energyStarWindowsCommitment = input.energyStarWindowsCommitment;
    if (energyStarWindowsCommitment !== ReductionCommitmentEnum.WILL_NOT_DO) {
        reductions.energyStarWindows = factors.energyStartProducts.windows;
        if (energyStarWindowsCommitment === ReductionCommitmentEnum.ALREADY_DONE) {
            reductionsDone += reductions.energyStarWindows;
        } else if (energyStarWindowsCommitment === ReductionCommitmentEnum.WILL_DO) {
            reductionsPlanned += reductions.energyStarWindows;
        }            
    } else { reductions.energyStarWindows = 0 }
  
    return { 
        reductions,
        totals: {
            reductionsDone,
            reductionsPlanned
        }
    };
}

module.exports = {
    calculateEmissions: generateEmissionsSummary
};