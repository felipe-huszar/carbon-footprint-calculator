import { ReductionCommitmentEnum } from "../../enums/calculatorEnums";

export const convertInputFields = (input) => {        
    const naturalGasAmount = parseFloat(input.naturalGasAmount);        
    const electricityAmount = parseFloat(input.electricityAmount);            
    const electricityGreenPercentage = parseFloat(input.electricityGreenPercentage);
    const fuelOilAmount = parseFloat(input.fuelOilAmount);        
    const propaneAmount = parseFloat(input.propaneAmount);
    const reduceThermostatSummerDegrees = parseFloat(input.reduceThermostatSummerDegrees);    
    const reduceThermostatWinterNightsDegrees = parseFloat(input.reduceThermostatWinterNightsDegrees);
    const ledBulbsReplacementCount = parseFloat(input.ledBulbsReplacementCount);
    const greenPowerUsageIncrease = parseFloat(input.greenPowerUsageIncrease);
    const washingClothesColdWaterLoadsPerWeek = parseFloat(input.washingClothesColdWaterLoadsPerWeek);
    const lineDryClothingPercentage = parseFloat(input.lineDryClothingPercentage);    

    const enumValues = Object.values(ReductionCommitmentEnum);
    
    const enablePowerManagementOnPCCommitment = enumValues.includes(input.enablePowerManagementOnPCCommitment) ? input.enablePowerManagementOnPCCommitment : ReductionCommitmentEnum.WILL_NOT_DO;
    const washingClothesColdWaterCommitment = enumValues.includes(input.washingClothesColdWaterCommitment) ? input.washingClothesColdWaterCommitment : ReductionCommitmentEnum.WILL_NOT_DO;
    const lineDryClothingCommitment = enumValues.includes(input.lineDryClothingCommitment) ? input.lineDryClothingCommitment : ReductionCommitmentEnum.WILL_NOT_DO;
    const energyStarRefrigeratorCommitment = enumValues.includes(input.energyStarRefrigeratorCommitment) ? input.energyStarRefrigeratorCommitment : ReductionCommitmentEnum.WILL_NOT_DO;
    const energyStarFurnaceCommitment = enumValues.includes(input.energyStarFurnaceCommitment) ? input.energyStarFurnaceCommitment : ReductionCommitmentEnum.WILL_NOT_DO;
    const energyStarWindowsCommitment = enumValues.includes(input.energyStarWindowsCommitment) ? input.energyStarWindowsCommitment : ReductionCommitmentEnum.WILL_NOT_DO;
        
    return {            
        naturalGasAmount,
        naturalGasUnit: input.naturalGasUnit,
        electricityAmount,
        electricityGreenPercentage,
        electricityUnit: input.electricityUnit,
        fuelOilAmount,
        fuelOilUnit: input.fuelOilUnit,
        propaneAmount,
        propaneUnit: input.propaneUnit,
        reductions: {                
            reduceThermostatSummerDegrees,
            reduceThermostatWinterNightsDegrees,
            ledBulbsReplacementCount,
            enablePowerManagementOnPCCommitment,
            greenPowerUsageIncrease,
            washingClothesColdWaterCommitment,
            washingClothesColdWaterLoadsPerWeek,
            lineDryClothingCommitment,
            lineDryClothingPercentage,
            energyStarRefrigeratorCommitment,
            energyStarFurnaceCommitment,
            energyStarWindowsCommitment,
        }
    };
};