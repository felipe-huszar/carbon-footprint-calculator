const wasteService = require('./wasteService');

const resolvers = {
    Query: {
        getAverageWaste: async (_, { numberOfPersons }) => {
            try {                
                return await wasteService.getAverageWaste(numberOfPersons);                
            } catch (error) {                
                console.log(error);
                throw new Error(error.message);
            }
        },
    },
    Mutation: {
        calculateWasteEmission: async (_, { input }) => {
            try {
                return await wasteService.calculateEmissions(input);                
            } catch (error) {                
                console.log(error);
                throw new Error(error.message);
            }
        },
    },
};

module.exports = resolvers;
