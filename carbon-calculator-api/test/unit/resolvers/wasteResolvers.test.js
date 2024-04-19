const wasteResolvers = require('../../../src/graphql/domains/waste/wasteResolvers');
const wasteService = require('../../../src/graphql/domains/waste/wasteService');
const wasteMocks = require('../../mocks/wasteMocks');

// Mock the homeEnergyService
jest.mock('../../../src/graphql/domains/waste/wasteService', () => ({
    calculateEmissions: jest.fn()
}));

const input = wasteMocks.defaultCalculationMock;

describe('Waste Resolvers', () => {

    it('calls calculateEmissions with the correct input', async () => {        
        const result = await wasteResolvers.Mutation.calculateWasteEmission(null, { input });
        
        expect(wasteService.calculateEmissions).toHaveBeenCalledWith(input);
        expect(result).not.toBeNull();
    });

    it('handles exceptions from the service', async () => {        
        const errorMessage = 'An error occurred';
        
        wasteService.calculateEmissions.mockRejectedValue(new Error(errorMessage));
        
        await expect(wasteResolvers.Mutation.calculateWasteEmission(null, { input })).rejects.toThrow(errorMessage);
        expect(wasteService.calculateEmissions).toHaveBeenCalledWith(input);
    });
});