const  carbonFootprintRepository  = require('../../../infrastructure/repository/carbonFootprintRepository');
const  utils = require('../../../utils/utils');
const homeEnergyService = require('../homeEnergy/homeEnergyService');
const transportationService = require('../transportation/transportationService');
const wasteService = require('../waste/wasteService');

async function configureInitialParameters(input) {
    if (input.numberOfPeoplehousehold < 0) {
        throw new Error('Number of people cannot be lower than zero');
    }

    if (!utils.isValidUSZip(input.zipCode)) {
        throw new Error('Invalid zip code');
    }
   
    carbonFootprintRepository.init();
    carbonFootprintRepository.setInitialParameters(input.numberOfPeoplehousehold, input.zipCode);
    await wasteService.configureInitialWasteEmission(input.numberOfPeoplehousehold);
    
    const carbonFootprintSummary = utils.roundDeep(carbonFootprintRepository.getTotalSummary());

    return {        
        carbonFootprintSummary,
    };   
}

async function generateEmissionsReport(input) {    
    carbonFootprintRepository.init();
    const [homeEnergyEmissions, transportationEmissions, wasteEmissions] = await Promise.all([
        homeEnergyService.calculateEmissions(input.homeEnergyParameters),
        transportationService.calculateEmissions(input.transportationParameters),
        wasteService.calculateEmissions(input.wasteParameters),        
    ]);
    
    const totalSumary = await calculateTotalEmissions([
        homeEnergyEmissions.carbonFootprintSummary,
        transportationEmissions.carbonFootprintSummary,
        wasteEmissions.carbonFootprintSummary
    ]);        

    return {
        homeEnergySumary: homeEnergyEmissions.carbonFootprintSummary,
        transportationSumary: transportationEmissions.carbonFootprintSummary,
        wasteSumary: wasteEmissions.carbonFootprintSummary,
        totalSumary,
    };
}

async function calculateTotalEmissions (summaries) {    
    let totalEmission = 0;
    let totalEmissionAfterPlannedActions = 0;
    let usAverage = 0;
        
    summaries.forEach(summary => {
        totalEmission += summary.currentTotalEmission;
        totalEmissionAfterPlannedActions += summary.currentTotalEmissionAfterPlannedActions;
        usAverage += summary.usAverage;
    });

    return {
        currentTotalEmission: totalEmission,
        currentTotalEmissionAfterPlannedActions: totalEmissionAfterPlannedActions,
        usAverage: usAverage
    };
}



module.exports = {
    configureInitialParameters,
    generateEmissionsReport
};