// tests/integration/homeEnergy.test.js
const request = require('supertest');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('../../src/graphql/schema');
const rootResolvers = require('../../src/graphql/rootResolvers');

let expressApp;

const query = `
    mutation CalculateWasteEmission($input: CalculateWasteInput!) {
        calculateWasteEmission(input: $input) {
            wasteEmission
            wasteReduction
        }
    }
`;

const variables = {
    input: {
        recycleAluminumSteelCans: true,
        recyclePlastic: true,
        recycleGlass: true,
        recycleNewspaper: true,
        recycleMagazines: true,
        reduction: {
            recycleAluminumSteelCans: true,
            recyclePlastic: true,
            recycleGlass: true,
            recycleNewspaper: true,
            recycleMagazines: true
        }
    }
};

const expectedOutput = {
    "data": {
        "calculateWasteEmission": {
            "wasteEmission": 925,
            "wasteReduction": 458            
        }
    }
}

describe('Waste Emission Integration', () => {
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
                operationName: 'CalculateWasteEmission',
                query,
                variables
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                              
                expect(res.body).toEqual(expectedOutput);
                done();
            });
    });

    it('returns 400 when the query is malformed', (done) => {
        request(expressApp)
            .post('/graphql')
            .send({
                operationName: 'CalculateWasteEmission',
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
                operationName: 'CalculateWasteEmission',
                query,
                variables: { randomData: 'abc' }
            })
            .expect(500)
            .end((err, res) => {
                return done(err);
            });
    });
});
