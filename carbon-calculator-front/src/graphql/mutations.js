
import { gql } from '@apollo/client';

export const CONFIGURE_INITIAL_PARAMETERS = gql`
    mutation ConfigureInitialParameters($input: ConfigureInitialParametersInput!) {
        configureInitialParameters(input: $input) {
            carbonFootprintSummary {
                currentTotalEmission
                currentTotalEmissionAfterPlannedActions
                usAverage
            }
        }
}`;

export const CALCULATE_HOME_ENERGY_EMISSION = gql`
    mutation CalculateHomeEnergyEmission($input: CalculateHomeEnergyInput!) {
        calculateHomeEnergyEmission(input: $input) {
            homeEnergyEmission {
                naturalGas
                electricity
                fuelOil
                propane
                reductions {
                    reduceThermostatSummer
                    reduceThermostatWinterNights
                    ledBulbsReplacement
                    enablePowerManagementOnPC
                    greenPowerUsageIncrease
                    washingClothesColdWater
                    lineDryClothing
                    energyStarRefrigerator
                    energyStarFurnace
                    energyStarWindows
                }                
            }
            carbonFootprintSummary {
                currentTotalEmission
                currentTotalEmissionAfterPlannedActions
                usAverage
            }
        }
    } 
`;

export const CALCULATE_TRANSPORTATION_EMISSIOSN = gql`
    mutation CalculateTransportationEmission($input: CalculateTransportationInput!) {
        calculateTransportationEmission(input: $input) {
            vehicleEmissions
            reductions {
                milesDriven
                replacedVehicle
            }
            carbonFootprintSummary {
                currentTotalEmission
                currentTotalEmissionAfterPlannedActions
                usAverage
            }
        }
    }
`;

export const CALCULATE_WASTE_EMISSIOSN = gql`
    mutation CalculateWasteEmission($input: CalculateWasteInput!) {
        calculateWasteEmission(input: $input) {
         waste {
                wasteRecycling
                emissionAfterRecycling
                wasteReduction
            }
            carbonFootprintSummary {
                currentTotalEmission
                currentTotalEmissionAfterPlannedActions
                usAverage
            }
        }
    }  
`;

export const GENERATE_EMISSIONS_REPORT = gql`
    mutation GenerateEmissionsReport($input: EmissionReportInput!) {
        generateEmissionsReport(input: $input) {
            homeEnergySumary {
                currentTotalEmission
                currentTotalEmissionAfterPlannedActions
                usAverage
            }
            transportationSumary {
                currentTotalEmission
                currentTotalEmissionAfterPlannedActions
                usAverage
            }
            wasteSumary {
                currentTotalEmission
                currentTotalEmissionAfterPlannedActions
                usAverage
            }
            totalSumary {
                currentTotalEmission
                currentTotalEmissionAfterPlannedActions
                usAverage
            }
        }
    }
`;

