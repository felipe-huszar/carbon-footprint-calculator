
const defaultEmissionFactors = {
    // Reference document: https://www.epa.gov/system/files/documents/2023-03/ghg_emission_factors_hub.pdf
    // Most of the information for Home Energy CO2 emissions were extracted from the above document
    homeEnergy: {
        // CO2 emissions (lbs/kWh) = (CO2 Factor (lbs/MWh) / 1000)
        // Assuming a hypothetical green emission factor of 500 lbs/MWh
        electricity: {
            green: {
                dollars: 2.02, // CO2 emissions (lbs/dollar) = CO2 emissions per kWh / Price per kWh
                kwh: 0.24,     // Approximate CO2 emissions in pounds per kWh for green energy
            },
            notGreen: {
                dollars: 8.15, // CO2 emissions (lbs/dollar) = CO2 emissions per kWh / Price per kWh
                kwh: 0.97,     // Approximate CO2 emissions in pounds per kWh for not green energy
            }
        },
        naturalGas: {
            dollars: 11.24,  // CO2 emissions (lbs)=Dollars spent×11.24lbs
            therms: 11.7,  // CO2 emissions (lbs)=Therms used×0.1×117
            thousandCubicFeet: 120.042, // CO2 emissions (lbs)=MCF used×1.026×117
        },
        fuelOil: {
            dollars: 5.57, // CO2 emissions (lbs/dollar) = (CO2 per gallon / Price per gallon) 
            // Conversion Factor: Convert kg to lbs with a factor of 2.20462 lbs/kg.
            gallons: 22.4, // CO2 emissions (lbs/gallon) = Energy Content (mmBtu/gallon) * CO2 Factor (kg CO2/mmBtu) * Conversion factor (lbs/kg)
        },
        propane: {
            dollars: 5.14, // CO2 emissions (lbs/dollar) = CO2 per gallon / Price per gallon ($2.47)
            gallons: 12.7, // CO2 emissions (lbs/gallon) = 0.091 mmBtu/gallon * 62.87 kg CO2/mmBtu * 2.20462 lbs/kg
        },

        reduction: {            
            // References for energy savings and CO2 reductions:            
            // U.S. Department of Energy (DOE) - Thermostat settings and savings
            // https://www.energy.gov/energysaver/thermostats
            // https://www.energystar.gov/products/lighting_fans/light_bulbs/learn_about_led_bulbs
            // https://www.epa.gov/greenpower
            thermostatAdjustment: { 
                perDegreeSummer: 20,  // Approx. 20 lbs of CO2 saved per year per degree adjusted in summer.
                perDegreeWinterNights: 20,  // Approx. 20 lbs of CO2 saved per year per degree adjusted in winter.
            },
            // LED bulbs are much more energy-efficient than traditional incandescent bulbs, using about 75% less energy.
            // This translates directly to reduced CO2 emissions from lower electricity consumption.                        
            ledBulbReplacement: { 
                perBulb: 82  // Approx. 82 lbs of CO2 saved per year per LED bulb replaced, assuming 5 hours of daily use.
            },
            // Utilizing green power reduces reliance on non-renewable energy sources, directly decreasing CO2 emissions.
            // The savings can be nearly complete, depending on the proportion of green to non-green energy used.            
            greenPowerUsage: {
                perUnit: 1000,  // Approx. 1000 lbs of CO2 saved per MWh of green power used, aligning with typical fossil fuel power emissions.
            },
            // Power management on computers reduces their idle and active energy use, which accumulates significant savings over time.
            powerManagementFeatureOnPc: 50,  // Approx. 50 lbs of CO2 saved per year with power management.
            // Washing clothes in cold water eliminates the need for heating water, which is one of the largest energy users in homes.
            washClothesInColdWater: {
                perLoad: 0.65  // Approx. 0.65 lbs of CO2 saved per load washed in cold water.
            },
            // Air-drying clothes instead of using a dryer avoids all the energy consumption of the dryer, which is typically high.
            useClothesLineOrDryigRack: 2,  // Approx. 2 lbs of CO2 saved per load by avoiding the dryer.
            // Energy Star products are significantly more efficient than standard appliances, leading to lower energy use and CO2 emissions.
            energyStartProducts: {
                refrigerator: 60,  // Approx. 60 lbs of CO2 saved per year with an Energy Star refrigerator.
                furnanceOrBoiler: 300,  // Approx. 300 lbs of CO2 saved per year with an Energy Star furnace or boiler.
                windows: 150,  // Approx. 150 lbs of CO2 saved per year with Energy Star windows.
            }
        },
    },
    // Reference document: https://www.epa.gov/system/files/documents/2023-03/ghg_emission_factors_hub.pdf    
    transportation: {
        perStandardMile: 0.69,  // Approx. 0.69 lbs CO2 per mile for passenger cars
        perGasMile: 1.03, // Approx. 1.03 lbs CO2 per mile for light-duty trucks     
    },
    // Reference document: https://www.epa.gov/system/files/documents/2023-03/ghg_emission_factors_hub.pdf    
    waste: {
        // Using the average of 692 lbs CO2 equivalent per year for a household of 1 person
        standardWasteEmission: {
            perPerson: 692
        },
        reduction: {              
            recyclingAluminum: 12, // Recycling aluminum saves 120 lbs of CO2e per ton based on EPA factors.
            // Plastic production is energy-intensive, and recycling it reduces the need for new material production and the associated emissions.
            recyclingPlastic: 46,  // Recycling plastic, particularly PET plastic, can save 460 lbs of CO2e per ton.            
            // While less energy-intensive than aluminum or plastic, recycling still offers energy savings over new glass production.
            recyclingGlass: 10,   // Recycling glass saves 100 lbs of CO2e per ton.            
            recyclingMagazine: 4,  // CO2e = 0.2 * 2000
            recyclingNewspaper: 4, // CO2e = 0.2 * 2000
        },
    },
    usAverages: {
        homeEnergy: 2667,
        transportation: 2645,
        waste: 580,
    }
};

const fetchEmissionFactors = async (zipCode) => {
    const regionEmissionFactors = {
        'CAMX': { // WECC California
            co2Factor: 531.7 // lbs/MWh
        },
        'ERCT': { // ERCOT All
            co2Factor: 813.6 // lbs/MWh
        },
        'NYUP': { // NPCC Upstate NY
            co2Factor: 233.1 // lbs/MWh
        }
    };

    let regionalFactor;
    
    if (zipCode >= 90000 && zipCode < 93000) {
        regionalFactor = regionEmissionFactors['CAMX'];
    } else if (zipCode >= 75000 && zipCode < 80000) {
        regionalFactor = regionEmissionFactors['ERCT'];
    } else if (zipCode >= 12000 && zipCode < 15000) {
        regionalFactor = regionEmissionFactors['NYUP'];
    } else { // Default average factor for other regions        
        regionalFactor = { co2Factor: 852.3 }; // US Average lbs/MWh
    }

    // Adjust the default emission factors for electricity based on region
    const adjustedEmissionFactors = {
        ...defaultEmissionFactors,
        homeEnergy: {
            ...defaultEmissionFactors.homeEnergy,
            electricity: {
                ...defaultEmissionFactors.homeEnergy.electricity,
                notGreen: {
                    ...defaultEmissionFactors.homeEnergy.electricity.notGreen,
                    kwh: regionalFactor.co2Factor / 1000 // Convert from lbs/MWh to lbs/kWh
                }
            }
        }
    };

    return adjustedEmissionFactors;
};

module.exports = {
    fetchEmissionFactors,
};