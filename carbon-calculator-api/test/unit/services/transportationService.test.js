const transportationService = require('../../../src/graphql/domains/transportation/transportationService');
const emissionFactorsClient = require('../../../src/infrastructure/client/emissionFactorsClient');
const carbonFootprintRepository = require('../../../src/infrastructure/repository/carbonFootprintRepository');
const transportationMocks = require('../../mocks/transportationMocks');
const emissionFactorsMocks = require('../../mocks/emissionFactorsMocks');
const summaryMocks = require('../../mocks/summaryMocks');

jest.mock('../../../src/infrastructure/client/emissionFactorsClient', () => ({
    fetchEmissionFactors: jest.fn(),
}));

jest.mock('../../../src/infrastructure/repository/carbonFootprintRepository', () => ({    
    setSectionSummary: jest.fn(),
    getTotalSummary: jest.fn(),
}));

describe('Transportation Service', () => {
    beforeEach(() => {        
        jest.clearAllMocks();
    });

    it('calculates emissions correctly', async () => {
        const input = transportationMocks.defaultCalculationMock;
        const mockEmissionFactors = emissionFactorsMocks.emissionFactors;    
        const mockSummary = summaryMocks.carbonFootprintSummary;

        const expectOutput = transportationMocks.defaultCalculationReturnMock;
        expectOutput.carbonFootprintSummary = mockSummary;
        
        emissionFactorsClient.fetchEmissionFactors.mockResolvedValue(mockEmissionFactors);        
        carbonFootprintRepository.getTotalSummary.mockReturnValue(mockSummary);
        
        const result = await transportationService.calculateEmissions(input);
        
        expect(emissionFactorsClient.fetchEmissionFactors).toHaveBeenCalledTimes(1);
        expect(carbonFootprintRepository.setSectionSummary).toHaveBeenCalledTimes(1);
        expect(carbonFootprintRepository.getTotalSummary).toHaveBeenCalledTimes(1);
        
        expect(result).toEqual(expectOutput);
    });

    it('generates an error when input has negative numbers', async () => {
        const input = transportationMocks.defaultCalculationMock;
        transportationMocks.defaultCalculationMock.vehicles[0].gasMileage = -100;
        const mockEmissionFactors = emissionFactorsMocks.emissionFactors;    
        const mockSummary = summaryMocks.carbonFootprintSummary;

        const expectOutput = transportationMocks.defaultCalculationReturnMock;
        expectOutput.carbonFootprintSummary = mockSummary;
        
        emissionFactorsClient.fetchEmissionFactors.mockResolvedValue(mockEmissionFactors);        
        carbonFootprintRepository.getTotalSummary.mockReturnValue(mockSummary);
        
        await expect(transportationService.calculateEmissions(input)).rejects.toThrow("Input data cannot have negative numbers");
                
        expect(emissionFactorsClient.fetchEmissionFactors).not.toHaveBeenCalled();
        expect(carbonFootprintRepository.setSectionSummary).not.toHaveBeenCalled();
        expect(carbonFootprintRepository.getTotalSummary).not.toHaveBeenCalled();
    });    
});