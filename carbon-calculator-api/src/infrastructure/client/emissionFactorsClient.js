const defaultEmissionFactors = {
    homeEnergy: {
        electricity: {
            green: {
                dollars: 0.52,
                kwh: 0.92,
            },
            notGreen: {
                dollars: 1.52,
                kwh: 1.92,
            }
        },
        naturalGas: {
            dollars: 3.8,
            therms: 5.3,
            thousandCubicFeet: 11.2,
        },
        fuelOil: {
            dollars: 11.9,
            gallons: 22.4,
        },
        propane: {
            dollars: 9.12,
            gallons: 12.7,
        },
        reduction: {
            thermostatAdjustment: { 
                perDegreeSummer: 2.0,
                perDegreeWinterNights: 4.0,
            },
            ledBulbReplacement: { 
                perBulb: 1.5 
            },
            greenPowerUsage: {
                perUnit: 0.3,
            },
            powerManagementFeatureOnPc: 15.0,
            washClothesInColdWater: {
                perLoad: 0.5
            },
            useClothesLineOrDryigRack: 4.0,
            energyStartProducts: {
                refrigerator: 10.0,
                furnanceOrBoiler: 6.0,
                windows: 3.0,
            }

        },

    },
    transportation: {
        perStandardMile: 19.6,
        perGasMile: 14.2,        
    },
    waste: {
        standardWasteEmission: {
            perPerson: 1383
        },
        reduction: {
            recyclingAlumnium: 55,
            recyclingPlastic: 71,
            recyclingGlass: 51,
            recyclingMagazine: 55,
            recyclingNewspaper: 226
        },
    },
};



const fetchEmissionFactors = async (zipCode) => {
    // Mock function to return different emission factors based on zipCode
    const getEmissionFactorsByZipCode = (zipCode) => {
        if (zipCode >= 10000 && zipCode < 20000) {            
            return { 
                ...defaultEmissionFactors, 
                homeEnergy: { 
                    ...defaultEmissionFactors.homeEnergy, 
                    electricity: { 
                        green: { 
                            dollars: 0.62, 
                            kwh: 1.02 
                        },
                        notGreen: {
                            dollars: 1.62,
                            kwh: 2.02,
                        }
                    },
                    naturalGas: {
                        dollars: 4.0,
                        therms: 5.5,
                        thousandCubicFeet: 11.5,
                    },
                    fuelOil: {
                        dollars: 12.0,
                        gallons: 22.5,
                    },
                    propane: {
                        dollars: 9.22,
                        gallons: 12.8,
                    },
                },
                transportation: {
                    perStandardMile: 19.8,
                    perGasMile: 14.4,        
                },
                waste: {
                    standardWasteEmission: {
                        perPerson: 1385
                    },
                    reduction: {
                        recyclingAlumnium: 56,
                        recyclingPlastic: 72,
                        recyclingGlass: 52,
                        recyclingMagazine: 56,
                        recyclingNewspaper: 227
                    },
                },
            };
        } else if (zipCode >= 20000 && zipCode < 30000) {            
            return { 
                ...defaultEmissionFactors, 
                homeEnergy: { 
                    ...defaultEmissionFactors.homeEnergy, 
                    electricity: { 
                        green: { 
                            dollars: 0.72, 
                            kwh: 1.12 
                        },
                        notGreen: {
                            dollars: 1.72,
                            kwh: 2.12,
                        }
                    },
                    naturalGas: {
                        dollars: 4.2,
                        therms: 5.7,
                        thousandCubicFeet: 11.7,
                    },
                    fuelOil: {
                        dollars: 12.2,
                        gallons: 22.7,
                    },
                    propane: {
                        dollars: 9.32,
                        gallons: 12.9,
                    },
                },
                transportation: {
                    perStandardMile: 19.9,
                    perGasMile: 14.5,        
                },
                waste: {
                    standardWasteEmission: {
                        perPerson: 1386
                    },
                    reduction: {
                        recyclingAlumnium: 57,
                        recyclingPlastic: 73,
                        recyclingGlass: 53,
                        recyclingMagazine: 57,
                        recyclingNewspaper: 228
                    },
                },
            };
        } else if (zipCode >= 30000 && zipCode < 40000) {            
            return { 
                ...defaultEmissionFactors, 
                homeEnergy: { 
                    ...defaultEmissionFactors.homeEnergy, 
                    electricity: { 
                        green: { 
                            dollars: 0.82, 
                            kwh: 1.22 
                        },
                        notGreen: {
                            dollars: 1.82,
                            kwh: 2.22,
                        }
                    },
                    naturalGas: {
                        dollars: 4.4,
                        therms: 5.9,
                        thousandCubicFeet: 11.9,
                    },
                    fuelOil: {
                        dollars: 12.4,
                        gallons: 22.9,
                    },
                    propane: {
                        dollars: 9.42,
                        gallons: 13.0,
                    },
                },
                transportation: {
                    perStandardMile: 20.0,
                    perGasMile: 14.6,        
                },
                waste: {
                    standardWasteEmission: {
                        perPerson: 1387
                    },
                    reduction: {
                        recyclingAlumnium: 58,
                        recyclingPlastic: 74,
                        recyclingGlass: 54,
                        recyclingMagazine: 58,
                        recyclingNewspaper: 229
                    },
                },
            };
        } else if (zipCode >= 40000 && zipCode < 50000) {            
            return { 
                ...defaultEmissionFactors, 
                homeEnergy: { 
                    ...defaultEmissionFactors.homeEnergy, 
                    electricity: { 
                        green: { 
                            dollars: 0.92, 
                            kwh: 1.32 
                        },
                        notGreen: {
                            dollars: 1.92,
                            kwh: 2.32,
                        }
                    },
                    naturalGas: {
                        dollars: 4.6,
                        therms: 6.1,
                        thousandCubicFeet: 12.1,
                    },
                    fuelOil: {
                        dollars: 12.6,
                        gallons: 23.1,
                    },
                    propane: {
                        dollars: 9.52,
                        gallons: 13.1,
                    },
                },
                transportation: {
                    perStandardMile: 20.1,
                    perGasMile: 14.7,        
                },
                waste: {
                    standardWasteEmission: {
                        perPerson: 1388
                    },
                    reduction: {
                        recyclingAlumnium: 59,
                        recyclingPlastic: 75,
                        recyclingGlass: 55,
                        recyclingMagazine: 59,
                        recyclingNewspaper: 230
                    },
                },
            };
        } else if (zipCode >= 50000 && zipCode < 60000) {            
            return { 
                ...defaultEmissionFactors, 
                homeEnergy: { 
                    ...defaultEmissionFactors.homeEnergy, 
                    electricity: { 
                        green: { 
                            dollars: 1.02, 
                            kwh: 1.42 
                        },
                        notGreen: {
                            dollars: 2.02,
                            kwh: 2.42,
                        }
                    },
                    naturalGas: {
                        dollars: 4.8,
                        therms: 6.3,
                        thousandCubicFeet: 12.3,
                    },
                    fuelOil: {
                        dollars: 12.8,
                        gallons: 23.3,
                    },
                    propane: {
                        dollars: 9.62,
                        gallons: 13.2,
                    },
                },
                transportation: {
                    perStandardMile: 20.2,
                    perGasMile: 14.8,        
                },
                waste: {
                    standardWasteEmission: {
                        perPerson: 1389
                    },
                    reduction: {
                        recyclingAlumnium: 60,
                        recyclingPlastic: 76,
                        recyclingGlass: 56,
                        recyclingMagazine: 60,
                        recyclingNewspaper: 231
                    },
                },
            };
        } else {
            return defaultEmissionFactors;
        }
    }

    return getEmissionFactorsByZipCode(zipCode);
};

module.exports = {
    fetchEmissionFactors,
};