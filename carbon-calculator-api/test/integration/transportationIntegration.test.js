// tests/integration/transportation.test.js
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

const transportationMutation = `
    mutation CalculateTransportationEmission($input: CalculateTransportationInput!) {
        calculateTransportationEmission(input: $input) {
            vehicleEmissions
            reductions {
                milesDriven
                replacedVehicle
            }
        }
    }
`;

const transportationVariables = { 
    input: {
        vehicles: [
            {
                milesDriven: 12000,
                mileageUnit: "MILES_PER_YEAR",
                gasMileage: 25,
                reduction: {
                    reducedMiles: 1000,
                    reducedMilesUnit: "MILES_PER_YEAR",
                    milesperGaloonVehicleReplacement: 30
                }
            },
            {
                milesDriven: 6000,
                mileageUnit: "MILES_PER_YEAR",
                gasMileage: 30,
                reduction: {
                    reducedMiles: 300,
                    reducedMilesUnit: "MILES_PER_YEAR",
                    milesperGaloonVehicleReplacement: 35
                }
            }
        ]
    }
};

const expectedTransportationOutput = {
    "data": {
        "calculateTransportationEmission": {
            "vehicleEmissions": [2820780, 1409256],
            "reductions": [
                {
                    "milesDriven": 170400,
                    "replacedVehicle": 5112
                },
                {
                    "milesDriven": 51120,
                    "replacedVehicle": 5964
                }
            ],
        }
    }
};

describe('Transportation Emission Integration', () => {
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
        
        it('returns 200 without any errors as the parameters are not required for transportation calculation', (done) => {
            request(expressApp)
                .post('/graphql')
                .send({
                    operationName: 'CalculateTransportationEmission',
                    query: transportationMutation,
                    variables: transportationVariables
                })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
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
                    operationName: 'CalculateTransportationEmission',
                    query: transportationMutation,
                    variables: transportationVariables,
                })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
    
                    // Assertions to verify the response matches the expected output
                    expect(res.body).toEqual(expectedTransportationOutput);
                    done();
                });
        });
    
        it('returns 400 when the query is malformed', (done) => {
            request(expressApp)
                .post('/graphql')
                .send({
                    operationName: 'CalculateTransportationEmission',
                    query: 'random query',
                    variables: transportationVariables
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
                    operationName: 'CalculateTransportationEmission',
                    query: transportationMutation,
                    variables: { randomData: 'abc' }
                })
                .expect(500)
                .end((err, res) => {
                    return done(err);
                });
        });
    });        
});
