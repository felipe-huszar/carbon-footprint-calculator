const transportationResolvers = require('../../../src/graphql/domains/transportation/transportationResolvers');
const transportationService = require('../../../src/graphql/domains/transportation/transportationService');
const transportationMocks = require('../../mocks/transportationMocks');

jest.mock('../../../src/graphql/domains/transportation/transportationService', () => ({
    calculateEmissions: jest.fn()
}));

const input = transportationMocks.defaultCalculationMock;

describe('Transportation Resolvers', () => {

    it('calls calculateEmissions with the correct input', async () => {        
        const result = await transportationResolvers.Mutation.calculateTransportationEmission(null, { input });
        
        expect(transportationService.calculateEmissions).toHaveBeenCalledWith(input);
        expect(result).not.toBeNull();
    });

    it('handles exceptions from the service', async () => {        
        const errorMessage = 'An error occurred';
        
        transportationService.calculateEmissions.mockRejectedValue(new Error(errorMessage));
        
        await expect(transportationResolvers.Mutation.calculateTransportationEmission(null, { input })).rejects.toThrow(errorMessage);
        expect(transportationService.calculateEmissions).toHaveBeenCalledWith(input);
    });
});