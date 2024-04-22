const wasteService = require('../../../src/graphql/domains/waste/wasteService');
const emissionFactorsClient = require('../../../src/infrastructure/client/emissionFactorsClient');
const carbonFootprintRepository = require('../../../src/infrastructure/repository/carbonFootprintRepository');
const wasteMocks = require('../../mocks/wasteMocks');
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

describe('Waste Service', () => {
    const input = wasteMocks.defaultCalculationMock;
    const mockEmissionFactors = emissionFactorsMocks.emissionFactors;    
    const mockSummary = summaryMocks.carbonFootprintSummary;
    
    beforeEach(() => {        
        jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.clearAllMocks();
    });

    it('calculates emissions correctly', async () => {                
        const expectOutput = wasteMocks.defaultCalculationReturnMock;
        expectOutput.carbonFootprintSummary = mockSummary;
        
        emissionFactorsClient.fetchEmissionFactors.mockResolvedValue(mockEmissionFactors);        
        carbonFootprintRepository.getTotalSummary.mockReturnValue(mockSummary);
        
        const result = await wasteService.calculateEmissions(input);
        
        expect(emissionFactorsClient.fetchEmissionFactors).toHaveBeenCalledTimes(1);
        expect(carbonFootprintRepository.setSectionSummary).toHaveBeenCalledTimes(1);
        expect(carbonFootprintRepository.getTotalSummary).toHaveBeenCalledTimes(1);
        
        expect(result).toEqual(expectOutput);
    });

    const invalidCombinations = [
        { recycleAluminumSteelCans: true, reduction: { recycleAluminumSteelCans: true } },
        { recyclePlastic: true, reduction: { recyclePlastic: true } },
        { recycleGlass: true, reduction: { recycleGlass: true } },
        { recycleNewspaper: true, reduction: { recycleNewspaper: true } },
        { recycleMagazines: true, reduction: { recycleMagazines: true } },
    ];

    invalidCombinations.forEach((input) => {
        it(`throws an error when recycling and reducing the same item`, async () => {
            return expect(wasteService.calculateEmissions(input)).rejects.toThrow('Invalid input data. Cannot recycle and reduce the same item');
        });
    });

    afterEach(() => {
        console.error.mockRestore();
    });


    
});