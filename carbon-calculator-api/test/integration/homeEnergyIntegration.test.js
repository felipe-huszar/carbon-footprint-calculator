// tests/integration/homeEnergy.test.js
const request = require('supertest');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('../../src/graphql/schema');
const rootResolvers = require('../../src/graphql/rootResolvers');

let expressApp;

const query = `
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
        }
    }
`;

const variables = {
    input: {    
        naturalGasAmount: 100,
        naturalGasUnit: 'DOLLARS',
        electricityAmount: 500,
        electricityUnit: 'KWH',
        electricityGreenPercentage: 20,
        fuelOilAmount: 200,
        fuelOilUnit: 'GALLONS',
        propaneAmount: 150,
        propaneUnit: 'GALLONS',
        reductions: {
            reduceThermostatSummerDegrees: 3,
            reduceThermostatWinterNightsDegrees: 2,
            ledBulbsReplacementCount: 10,
            enablePowerManagementOnPCCommitment: 'WILL_DO',
            greenPowerUsageIncrease: 5,
            washingClothesColdWaterCommitment: 'WILL_DO',
            washingClothesColdWaterLoadsPerWeek: 3,
            lineDryClothingCommitment: 'WILL_DO',
            lineDryClothingPercentage: 50,
            energyStarRefrigeratorCommitment: 'WILL_DO',
            energyStarFurnaceCommitment: 'WILL_NOT_DO',
            energyStarWindowsCommitment: 'ALREADY_DONE'
        },
    },
};

const expectedOutput = {
    "data": {
        "calculateHomeEnergyEmission": {
            "homeEnergyEmission": {
                "naturalGas": 380,
                "electricity": 960,
                "fuelOil": 4480,
                "propane": 1905,
                "reductions": {
                    "reduceThermostatSummer": 6,
                    "reduceThermostatWinterNights": 8,
                    "ledBulbsReplacement": 15,
                    "enablePowerManagementOnPC": 150,
                    "greenPowerUsageIncrease": 1.5,
                    "washingClothesColdWater": 1.5,
                    "lineDryClothing": 200,
                    "energyStarRefrigerator": 10,
                    "energyStarFurnace": null,
                    "energyStarWindows": 3
                }
            },            
        }
    }
}

describe('Home Energy Emission Integration', () => {
    beforeAll(() => {
        expressApp = express();
        expressApp.use(
            '/graphql',
            graphqlHTTP({
                schema: schema,
                rootValue: rootResolvers,
                graphiql: false,
            })
        );    
        jest.setTimeout(10000);
    });
    
    it('returns 200 when correctly passing parameters and calculates emissions correctly', (done) => {
        request(expressApp)
            .post('/graphql')
            .send({
                operationName: 'CalculateHomeEnergyEmission',
                query,
                variables
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                // Assertions to verify the response                
                expect(res.body).toEqual(expectedOutput);                
                done();
            });
    });

    it('returns 400 when the query is malformed', (done) => {
        request(expressApp)
            .post('/graphql')
            .send({
                operationName: 'CalculateHomeEnergyEmission',
                query: 'random query',
                variables
            })
            .expect(400)
            .end((err, res) => {
                return done(err);
            });
    });

    it('returns 500 when the input is malformed', (done) => {
        request(expressApp)
            .post('/graphql')
            .send({
                operationName: 'CalculateHomeEnergyEmission',
                query,
                variables: { randomData: 'abc' }
            })
            .expect(500)
            .end((err, res) => {
                return done(err);
            });
    });
});
