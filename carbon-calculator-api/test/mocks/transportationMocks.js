const defaultCalculationMock = {    
    vehicles: [
        {
            milesDriven: 12000, 
            mileageUnit: 'MILES_PER_YEAR',
            gasMileage: 25, 
            reduction: {
                reducedMiles: 1000, 
                reducedMilesUnit: 'MILES_PER_YEAR',
                milesperGaloonVehicleReplacement: 30 
            }
        },        
    ]
}

module.exports = { defaultCalculationMock };