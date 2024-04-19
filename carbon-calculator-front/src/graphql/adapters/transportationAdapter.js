export const convertInputFields = (input) => {        
    const vehiclesData = input.vehicles.map(vehicle => ({
        milesDriven: parseFloat(vehicle.milesDriven) || 0,
        mileageUnit: vehicle.mileageUnit || 'MILES_PER_YEAR',
        gasMileage: parseFloat(vehicle.gasMileage) || 0,
        reduction: {
            reducedMiles: parseFloat(vehicle.reducedMiles) || 0,
            reducedMilesUnit: vehicle.reducedMilesUnit || 'MILES_PER_YEAR',
            milesperGaloonVehicleReplacement: parseFloat(vehicle.milesperGaloonVehicleReplacement) || 0,
        }
    }));                        
        
    return {
        vehicles: vehiclesData
    };
};