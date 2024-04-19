const homeEnergyResolvers = require('../../../src/graphql/domains/homeEnergy/homeEnergyResolvers');
const homeEnergyService = require('../../../src/graphql/domains/homeEnergy/homeEnergyService');
const homeEnergyMocks = require('../../mocks/homeEnergyMocks');

jest.mock('../../../src/graphql/domains/homeEnergy/homeEnergyService', () => ({
    calculateEmissions: jest.fn()
}));

const input = homeEnergyMocks.defaultCalculationMock;

describe('Home Energy Resolvers', () => {

    it('calls calculateEmissions with the correct input', async () => {        
        const result = await homeEnergyResolvers.Mutation.calculateHomeEnergyEmission(null, { input });
        
        expect(homeEnergyService.calculateEmissions).toHaveBeenCalledWith(input);
        expect(result).not.toBeNull();
    });

    it('handles exceptions from the service', async () => {        
        const errorMessage = 'An error occurred';
        
        homeEnergyService.calculateEmissions.mockRejectedValue(new Error(errorMessage));
        
        await expect(homeEnergyResolvers.Mutation.calculateHomeEnergyEmission(null, { input })).rejects.toThrow(errorMessage);
        expect(homeEnergyService.calculateEmissions).toHaveBeenCalledWith(input);
    });
});