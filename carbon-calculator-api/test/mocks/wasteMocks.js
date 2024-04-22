const defaultCalculationMock = {
    recycleAluminumSteelCans: true,
    recyclePlastic: true,
    recycleGlass: false,
    recycleNewspaper: false,
    recycleMagazines: false,
    reduction: {
        recycleAluminumSteelCans: false,
        recyclePlastic: false,
        recycleGlass: true,
        recycleNewspaper: true,
        recycleMagazines: true
    }
}

const defaultCalculationReturnMock = {    
    waste: {
        wasteRecycling: 126,
        emissionAfterRecycling: 1131,
        wasteReduction: 332,
    },
    carbonFootprintSummary: {
        currentTotalEmission: 1131,
        currentTotalEmissionAfterPlannedActions: 799,
        usAverage: 5600,
    },    
};

module.exports = { defaultCalculationMock, defaultCalculationReturnMock };