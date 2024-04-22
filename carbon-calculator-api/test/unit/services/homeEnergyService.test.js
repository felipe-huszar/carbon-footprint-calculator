const homeEnergyService = require('../../../src/graphql/domains/homeEnergy/homeEnergyService');
const emissionFactorsClient = require('../../../src/infrastructure/client/emissionFactorsClient');
const carbonFootprintRepository = require('../../../src/infrastructure/repository/carbonFootprintRepository');
const homeEnergyMocks = require('../../mocks/homeEnergyMocks');
const emissionFactorsMocks = require('../../mocks/emissionFactorsMocks');
const summaryMocks = require('../../mocks/summaryMocks');

jest.mock('../../../src/infrastructure/client/emissionFactorsClient', () => ({
    fetchEmissionFactors: jest.fn(),
}));

jest.mock('../../../src/infrastructure/repository/carbonFootprintRepository', () => ({
    getInitialParameters: jest.fn().mockReturnValue({ numberOfPeoplehousehold: 1, zipCode: '11111' }),
    setSectionSummary: jest.fn(),
    getTotalSummary: jest.fn(),
}));

describe('Home Energy Service', () => {
    beforeEach(() => {        
        jest.clearAllMocks();
    });

    it('calculates emissions correctly', async () => {
        const input = homeEnergyMocks.defaultCalculationMock;
        const mockEmissionFactors = emissionFactorsMocks.emissionFactors;    
        const mockSummary = summaryMocks.carbonFootprintSummary;

        const expectOutput = homeEnergyMocks.defaultCalculationReturnMock;
        expectOutput.carbonFootprintSummary = mockSummary;
        
        emissionFactorsClient.fetchEmissionFactors.mockResolvedValue(mockEmissionFactors); 
        carbonFootprintRepository.getTotalSummary.mockReturnValue(mockSummary);
        
        const result = await homeEnergyService.calculateEmissions(input);
        
        expect(emissionFactorsClient.fetchEmissionFactors).toHaveBeenCalledTimes(1);
        expect(carbonFootprintRepository.setSectionSummary).toHaveBeenCalledTimes(1);
        expect(carbonFootprintRepository.getTotalSummary).toHaveBeenCalledTimes(1);
        
        expect(result).toEqual(expectOutput);
    });

    it('generates an error when input has negative numbers', async () => {
        const input = homeEnergyMocks.defaultCalculationMock;
        input.electricityAmount = -100;
        const mockEmissionFactors = emissionFactorsMocks.emissionFactors;    
        const mockSummary = summaryMocks.carbonFootprintSummary;

        const expectOutput = homeEnergyMocks.defaultCalculationReturnMock;
        expectOutput.carbonFootprintSummary = mockSummary;
        
        emissionFactorsClient.fetchEmissionFactors.mockResolvedValue(mockEmissionFactors);        
        carbonFootprintRepository.getTotalSummary.mockReturnValue(mockSummary);
        
        await expect(homeEnergyService.calculateEmissions(input)).rejects.toThrow("Input data cannot have negative numbers");
                
        expect(emissionFactorsClient.fetchEmissionFactors).not.toHaveBeenCalled();
        expect(carbonFootprintRepository.setSectionSummary).not.toHaveBeenCalled();
        expect(carbonFootprintRepository.getTotalSummary).not.toHaveBeenCalled();
    });    
});