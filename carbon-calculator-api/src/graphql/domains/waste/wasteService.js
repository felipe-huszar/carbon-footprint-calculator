const { fetchEmissionFactors } = require('../../../infrastructure/client/emissionFactorsClient');
const { CarbonFootprintCategory } = require('../../../enums/carbonFootprintEnums');
const  carbonFootprintRepository  = require('../../../infrastructure/repository/carbonFootprintRepository');
const  utils  = require('../../../utils/utils');

async function calculateEmissions(input, reusesSummary = true) {
    const numberOfPeoplehousehold = carbonFootprintRepository.getInitialParameters().numberOfPeoplehousehold;

    if (!numberOfPeoplehousehold) {
        throw new Error('Initial parameters have not been configured');
    }

    if (utils.hasNegativeValues(input)) {
        throw new Error('Input data cannot have negative numbers');
    }

    await validateWasteInput(input);
    
    const factors = await fetchEmissionFactors();

    const { 
        totalEmission,        
        totalReductionsDone,
        totalReductionsPlanned 
    } = await calculateWasteEmissions(input, factors.waste, numberOfPeoplehousehold);    

    const totalEmissionDone = totalEmission - totalReductionsDone;
    const totalEmissionPlanned = totalEmissionDone - totalReductionsPlanned;

    const summaryWaste = {
        currentTotalEmission: totalEmissionDone,
        currentTotalEmissionAfterPlannedActions:  totalEmissionPlanned,      
        usAverage: factors.usAverages.waste,  
    }
    
    carbonFootprintRepository.setSectionSummary(CarbonFootprintCategory.WASTE, summaryWaste);

    let carbonFootprintSummary = summaryWaste;
    if(reusesSummary) {
        carbonFootprintSummary = utils.roundDeep(carbonFootprintRepository.getTotalSummary()); 
    }

    return {        
        waste: {
            wasteRecycling: totalReductionsDone,
            emissionAfterRecycling: totalEmissionDone,
            wasteReduction: totalReductionsPlanned,
        },
        carbonFootprintSummary
    };
}

async function calculateWasteEmissions(input, factors, numberOfPersons) {        
    let totalHouseholdEmission = factors.standardWasteEmission.perPerson * numberOfPersons;    
    let totalReductionsDone = 0;
    let totalReductionsPlanned = 0;

    if(input.recycleAluminumSteelCans) {
        totalReductionsDone += factors.reduction.recyclingAluminum
    } else if(input.reduction.recycleAluminumSteelCans) {
        totalReductionsPlanned += factors.reduction.recyclingAluminum
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
        
    totalReductionsDone = totalReductionsDone * numberOfPersons;
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
    const factors = await fetchEmissionFactors();

    let sumaryWaste = utils.roundDeep({
        currentTotalEmission: averageWaste,
        currentTotalEmissionAfterPlannedActions: averageWaste,
        usAverage: factors.usAverages.waste,
    });    

    carbonFootprintRepository.setSectionSummary(CarbonFootprintCategory.WASTE, sumaryWaste);
}

async function validateWasteInput(input) {
    const invalidCombinationMessage = 'Invalid input data. Cannot recycle and reduce the same item';
    
    if (input.recycleAluminumSteelCans && input.reduction.recycleAluminumSteelCans) {
        throw new Error(invalidCombinationMessage);
    }

    if (input.recyclePlastic && input.reduction.recyclePlastic) {
        throw new Error(invalidCombinationMessage);
    }

    if (input.recycleGlass && input.reduction.recycleGlass) {
        throw new Error(invalidCombinationMessage);
    }

    if (input.recycleNewspaper && input.reduction.recycleNewspaper) {
        throw new Error(invalidCombinationMessage);
    }

    if (input.recycleMagazines && input.reduction.recycleMagazines) {
        throw new Error(invalidCombinationMessage);
    }
}

module.exports = {
    calculateEmissions,
    getAverageWaste,
    configureInitialWasteEmission
};