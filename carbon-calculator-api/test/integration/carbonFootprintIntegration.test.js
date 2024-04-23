// tests/integration/homeEnergy.test.js
const request = require('supertest');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('../../src/graphql/schema');
const rootResolvers = require('../../src/graphql/rootResolvers');

let expressApp;

const query = `
    mutation ConfigureInitialParameters($input: ConfigureInitialParametersInput!) {
        configureInitialParameters(input: $input) {
            carbonFootprintSummary {
                currentTotalEmission
                currentTotalEmissionAfterPlannedActions
                usAverage
            }
        }
    }
  
`;

const variables = {
    input: {    
        numberOfPeoplehousehold: 1,
        zipCode: "94114",        
    },
};

const variableswithNegativeNumberOfPeople = {
    input: {    
        numberOfPeoplehousehold: -1,
        zipCode: "94114",        
    },
};

const variableswithInvalidZipCode = {
    input: {    
        numberOfPeoplehousehold: 1,
        zipCode: "99999999",        
    },
};

const expectedOutput = {
    "data": {
        "configureInitialParameters": {
            "carbonFootprintSummary": {
                "currentTotalEmission": 692,
                "currentTotalEmissionAfterPlannedActions": 692,
                "usAverage": 580
            }
        }
    }
}

describe('Carbon Footprint Integration', () => {
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

    describe('configureInitialParametersIntegration', () => {
        it('returns 200 when correctly passing parameters', (done) => {
            request(expressApp)
                .post('/graphql')
                .send({
                    operationName: 'ConfigureInitialParameters',
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
                    operationName: 'ConfigureInitialParameters',
                    query: 'random query',
                    variables
                })
                .expect(400)
                .end((err, res) => {
                    return done(err);
                });
        });
    
        it('returns 200 and correct error message when number of people is negative', (done) => {            
            request(expressApp)
                .post('/graphql')
                .send({
                    operationName: 'ConfigureInitialParameters',
                    query,
                    variables: variableswithNegativeNumberOfPeople
                })
                .expect(200)
                .end((err, res) => {                    
                    expect(res.body.errors[0].message).toEqual('Number of people cannot be lower than zero');
                    return done();
                });
        });
    
        it('returns 200 and correct error message when the zipcode is invalid', (done) => {
            request(expressApp)
                .post('/graphql')
                .send({
                    operationName: 'ConfigureInitialParameters',
                    query,
                    variables: variableswithInvalidZipCode
                })
                .expect(400)
                .end((err, res) => {
                    expect(res.body.errors[0].message).toEqual('Invalid zip code');
                    return done();
                });
        });            
    })
    
    
});
