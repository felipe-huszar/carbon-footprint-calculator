const emissionFactors = {
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
            recyclingAluminum: 55,
            recyclingPlastic: 71,
            recyclingGlass: 51,
            recyclingMagazine: 55,
            recyclingNewspaper: 226
        },
    },
    usAverages: {
        homeEnergy: 2667,
        transportation: 2645,
        waste: 580,
    }
};

module.exports = { emissionFactors };