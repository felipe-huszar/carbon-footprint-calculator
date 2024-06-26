// tests/integration/homeEnergy.test.js
const request = require('supertest');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('../../src/graphql/schema');
const rootResolvers = require('../../src/graphql/rootResolvers');

let expressApp;

const configureInitialParametersMutation = `
    mutation ConfigureInitialParameters {
        configureInitialParameters(input: {
            numberOfPeoplehousehold: 1,
            zipCode: "11111"    
        }) {
            carbonFootprintSummary {
                currentTotalEmission
                currentTotalEmissionAfterPlannedActions
                usAverage
            }
        }
    }
`;

const homeEnergyMutation = `
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

const homeEnergyVariables = {
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

const expectedHomeEnergyOutput = {
    "data": {
        "calculateHomeEnergyEmission": {
            "homeEnergyEmission": {
                "naturalGas": 1124,
                "electricity": 426.15,
                "fuelOil": 4480,
                "propane": 1905,
                "reductions": {
                    "reduceThermostatSummer": 60,
                    "reduceThermostatWinterNights": 40,
                    "ledBulbsReplacement": 820,
                    "enablePowerManagementOnPC": 50,
                    "greenPowerUsageIncrease": 5000,
                    "washingClothesColdWater": 1.95,
                    "lineDryClothing": 100,
                    "energyStarRefrigerator": 60,
                    "energyStarFurnace": 0,
                    "energyStarWindows": 150
                }
            }
        }
    }
}

describe('Home Energy Emission Integration', () => {    
    describe('without initial parameters configured', () => {
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
        
        it('returns 200 with correct error message when parameters have not been configured correctly', (done) => {
            request(expressApp)
                .post('/graphql')
                .send({
                    operationName: 'CalculateHomeEnergyEmission',
                    query: homeEnergyMutation,
                    variables: homeEnergyVariables
                })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                        
                    expect(res.body.errors).toBeDefined();
                    expect(res.body.errors[0].message).toEqual('Initial parameters have not been configured');
                    
                    done();
                });
        });        
    });
    
    describe('with initial parameters configured', () => {
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
        
        beforeEach((done) => {
            request(expressApp)
                .post('/graphql')
                .send({
                    operationName: 'ConfigureInitialParameters',
                    query: configureInitialParametersMutation,
                })
                .end((err, res) => {
                    if (err) return done(err);
                    done();
                });
        });

        it('returns 200 when correctly passing parameters and calculates emissions correctly', (done) => {
            request(expressApp)
                .post('/graphql')
                .send({
                    operationName: 'CalculateHomeEnergyEmission',
                    query: homeEnergyMutation,
                    variables: homeEnergyVariables
                })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                                 
                    expect(res.body).toEqual(expectedHomeEnergyOutput);                
                    done();
                });
        });
    
        it('returns 400 when the query is malformed', (done) => {
            request(expressApp)
                .post('/graphql')
                .send({
                    operationName: 'CalculateHomeEnergyEmission',
                    query: 'random query',
                    variables: homeEnergyVariables
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
                    query: homeEnergyMutation,
                    variables: { randomData: 'abc' }
                })
                .expect(500)
                .end((err, res) => {
                    return done(err);
                });
        });
        
    });
});