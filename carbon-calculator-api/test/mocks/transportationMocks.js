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
            milesDriven: 8520,
            replacedVehicle: 8520,
        },
        {
            milesDriven: 5112,
            replacedVehicle: 25560,
        },
    ],
    carbonFootprintSummary: {
        currentTotalEmission: 30096,
        currentTotalEmissionAfterPlannedActions: -17616,
        usAverage: 5600,
    },
};

module.exports = { defaultCalculationMock, defaultCalculationReturnMock };