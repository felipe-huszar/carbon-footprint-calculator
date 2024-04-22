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

const wasteMutation = `
    mutation CalculateWasteEmission($input: CalculateWasteInput!) {
        calculateWasteEmission(input: $input) {
            waste {
                wasteRecycling,
                emissionAfterRecycling,
                wasteReduction
            }
        }
    }
`;

const wasteVariables = {
    input: {
        recycleAluminumSteelCans: true,
        recyclePlastic: true,
        recycleGlass: true,
        recycleNewspaper: true,
        recycleMagazines: false,
        reduction: {
            recycleAluminumSteelCans: false,
            recyclePlastic: false,
            recycleGlass: false,
            recycleNewspaper: false,
            recycleMagazines: true
        }
    }
};

const expectedWasteOutput = {
    "data": {
        "calculateWasteEmission": {
            "waste": {
                "wasteRecycling": 403,
                "emissionAfterRecycling": 577,
                "wasteReduction": 55
            },
        }
    }    
};

describe('Waste Emission Integration', () => {
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
                    operationName: 'CalculateWasteEmission',
                    query: wasteMutation,
                    variables: wasteVariables
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
                    operationName: 'CalculateWasteEmission',
                    query: wasteMutation,
                    variables: wasteVariables
                })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                                  
                    expect(res.body).toEqual(expectedWasteOutput);
                    done();
                });
        });
    
        it('returns 400 when the query is malformed', (done) => {
            request(expressApp)
                .post('/graphql')
                .send({
                    operationName: 'CalculateWasteEmission',
                    query: 'random query',
                    variables: wasteVariables
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
                    operationName: 'CalculateWasteEmission',
                    query: wasteMutation,
                    variables: { randomData: 'abc' }
                })
                .expect(500)
                .end((err, res) => {
                    return done(err);
                });
        });        
    });      
});
