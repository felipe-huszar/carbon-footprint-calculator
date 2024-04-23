const { fetchEmissionFactors } = require('../../../infrastructure/client/emissionFactorsClient');
const { MileageUnit, CarbonFootprintCategory } = require('../../../enums/carbonFootprintEnums');
const  carbonFootprintRepository  = require('../../../infrastructure/repository/carbonFootprintRepository');
const  utils  = require('../../../utils/utils');

async function calculateEmissions(input) {    
    if (utils.hasNegativeValues(input)) {
        throw new Error('Input data cannot have negative numbers');
    }
    
    const factors = await fetchEmissionFactors();

    const { vehicleEmissions, totalEmission } = await calculateWasteEmissions(input.vehicles, factors.transportation);
    

    const calculatedReductions = await calculateReductions(input.vehicles, factors.transportation);        
    
    const totalEmissionsDone = totalEmission - calculatedReductions.totals.reductionsDone;
    const totalEmissionsPlanned = totalEmissionsDone - calculatedReductions.totals.reductionsPlanned;

    const summaryTransportation = {
        currentTotalEmission: totalEmission,
        currentTotalEmissionAfterPlannedActions: totalEmissionsPlanned
    }    

    carbonFootprintRepository.setSectionSummary(CarbonFootprintCategory.TRANSPORTATION, summaryTransportation);

    const transportationEmissionOutput = utils.roundDeep(vehicleEmissions);
    const carbonFootprintSummaryOutput = utils.roundDeep(carbonFootprintRepository.getTotalSummary());
    const reductionsOutput = utils.roundDeep(calculatedReductions.vehicleReductionsPlanned);

    return {        
        vehicleEmissions: transportationEmissionOutput,
        reductions: reductionsOutput,
        carbonFootprintSummary: carbonFootprintSummaryOutput,
    };
}

async function calculateWasteEmissions(vehicles, factors) {
    let totalEmission = 0;
    let vehicleEmissions = [];

    for(vehicle of vehicles) {
        const periodicityFactor = vehicle.mileageUnit === MileageUnit.MILES_PER_YEAR ? 12 : 1
        const totalStandardMiles = vehicle.milesDriven - vehicle.gasMileage;
        const totalGasMiles = vehicle.gasMileage;
        const standardMilesEmission = totalStandardMiles * factors.perStandardMile * periodicityFactor;
        const gasMilesEmission = totalGasMiles * factors.perGasMile * periodicityFactor;        
        const emission = standardMilesEmission + gasMilesEmission;

        vehicleEmissions.push(emission);
        totalEmission += emission;
    }

    return {
        vehicleEmissions,
        totalEmission,
    }
}

async function calculateReductions(vehicles, factors) {
    let vehicleReductionsPlanned = [];
    let totalReductionPlanned = 0;

    for (const vehicle of vehicles) {
        // Determine the periodicity factor based on whether the reduction is reported annually or monthly.
        const periodicityFactor = vehicle.reduction.reducedMilesUnit === MileageUnit.MILES_PER_YEAR ? 1 : 12;

        // Calculate the emissions reduction from reduced miles driven.
        const milesReduction = vehicle.reduction.reducedMiles * factors.perGasMile / periodicityFactor;

        // Use the current gas mileage provided for each vehicle and the proposed new MPG from the reduction section.
        const oldMPG = vehicle.gasMileage;
        const newMPG = vehicle.reduction.milesperGaloonVehicleReplacement;

        // Calculate the vehicle replacement reduction if a new MPG is provided.
        const vehicleReplacementReduction = newMPG && oldMPG ? 
            (1 - (oldMPG / newMPG)) * vehicle.milesDriven * factors.perGasMile
            : 0;

        const plannedReduction = milesReduction + vehicleReplacementReduction;
        
        vehicleReductionsPlanned.push({ 
            milesDriven: milesReduction, 
            replacedVehicle: vehicleReplacementReduction
        });
        totalReductionPlanned += plannedReduction;
    }
  
    return {   
        vehicleReductionsPlanned,      
        totals: {
            reductionsDone: 0,
            reductionsPlanned: totalReductionPlanned
        }
    };
}

module.exports = {
    calculateEmissions
};