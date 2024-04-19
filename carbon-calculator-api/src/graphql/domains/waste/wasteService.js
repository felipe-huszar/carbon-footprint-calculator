const { fetchEmissionFactors } = require('../../../infrastructure/client/emissionFactorsClient');
const { CarbonFootprintCategory } = require('../../../enums/carbonFootprintEnums');
const  carbonFootprintRepository  = require('../../../infrastructure/repository/carbonFootprintRepository');
const  utils  = require('../../../utils/utils');

async function calculateEmissions(input) {
    
    if (utils.hasNegativeValues(input)) {
        throw new Error('Input data cannot have negative numbers');
    }
    
    const factors = await fetchEmissionFactors();

    const { 
        totalEmission,        
        totalReductionsDone,
        totalReductionsPlanned 
    } = await calculateWasteEmissions(input, factors.waste);    

    const totalEmissionDone = totalEmission - totalReductionsDone;
    const totalEmissionPlanned = totalEmissionDone - totalReductionsPlanned;

    const summaryTransportation = {
        currentTotalEmission: totalEmissionDone,
        currentTotalEmissionAfterPlannedActions:  totalEmissionPlanned,        
    }
    
    carbonFootprintRepository.setSectionSummary(CarbonFootprintCategory.WASTE, summaryTransportation);

    return {        
        waste: {
            wasteRecycling: totalReductionsDone,
            emissionAfterRecycling: totalEmissionDone,
            wasteReduction: totalReductionsPlanned,
        },
        carbonFootprintSummary: carbonFootprintRepository.getTotalSummary(),
    };
}

async function calculateWasteEmissions(input, factors) {
    const numberOfPersons = carbonFootprintRepository.getInitialParameters().numberOfPeoplehousehold;
    
    let totalHouseholdEmission = factors.standardWasteEmission.perPerson * numberOfPersons;    
    let totalReductionsDone = 0;
    let totalReductionsPlanned = 0;

    if(input.recycleAluminumSteelCans) {
        totalReductionsDone += factors.reduction.recyclingAlumnium
    } else if(input.reduction.recycleAluminumSteelCans) {
        totalReductionsPlanned += factors.reduction.recyclingAlumnium
    }
    if(input.recyclePlastic) {
        totalReductionsDone += factors.reduction.recyclingPlastic
    } else if(input.reduction.recyclePlastic) {
        totalReductionsPlanned += factors.reduction.recyclingPlastic
    }
    if(input.recycleGlass) {
        totalReductionsDone += factors.reduction.recyclingGlass
    } else if(input.reduction.recycleGlass) {
        totalReductionsPlanned += factors.reduction.recyclingGlass
    }
    if(input.recycleMagazines) {
        totalReductionsDone += factors.reduction.recyclingMagazine
    } else if(input.reduction.recycleMagazines) {
        totalReductionsPlanned += factors.reduction.recyclingMagazine
    }
    if(input.recycleNewspaper) {
        totalReductionsDone += factors.reduction.recyclingNewspaper
    } else if(input.reduction.recycleNewspaper) {
        totalReductionsPlanned += factors.reduction.recyclingNewspaper
    }
        
    const totalEmission = totalHouseholdEmission - totalReductionsDone;    

    return {
        totalEmission,        
        totalReductionsDone,
        totalReductionsPlanned
    }
}

async function getAverageWaste(numberOfPersons) {
    const factors = await fetchEmissionFactors();
    return numberOfPersons * factors.waste.standardWasteEmission.perPerson;
}

async function configureInitialWasteEmission(numberOfPeoplehousehold) {
    const averageWaste = await getAverageWaste(numberOfPeoplehousehold);
    
    const sumaryWaste = {
        currentTotalEmission: averageWaste,
        currentTotalEmissionAfterPlannedActions: averageWaste,
    }

    carbonFootprintRepository.setSectionSummary(CarbonFootprintCategory.WASTE, sumaryWaste);
}


module.exports = {
    calculateEmissions,
    getAverageWaste,
    configureInitialWasteEmission
};