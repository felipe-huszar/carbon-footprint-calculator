const { MileageUnit } = require('../../src/enums/carbonFootprintEnums');

const defaultCalculationMock = {    
    vehicles: [
        {
            milesDriven: 50,
            mileageUnit: MileageUnit.MILES_PER_YEAR,
            gasMileage: 50,
            reduction: {
                reducedMiles: 50,
                reducedMilesUnit: MileageUnit.MILES_PER_YEAR,
                milesperGaloonVehicleReplacement: 50
            }
        },
        {
            milesDriven: 100,
            mileageUnit: MileageUnit.MILES_PER_YEAR,
            gasMileage: 30,
            reduction: {
                reducedMiles: 30,
                reducedMilesUnit: MileageUnit.MILES_PER_YEAR,
                milesperGaloonVehicleReplacement: 150
            }
        }
    ]
};

const defaultCalculationReturnMock = {
    vehicleEmissions: [8520, 21576],
    reductions: [
        {
            milesDriven: 710,
            replacedVehicle: 0,
        },
        {
            milesDriven: 426,
            replacedVehicle: 1136,
        },
    ],
    carbonFootprintSummary: {
        currentTotalEmission: 30096,
        currentTotalEmissionAfterPlannedActions: 11123,
        usAverage: 5600,
    },
};

module.exports = { defaultCalculationMock, defaultCalculationReturnMock };