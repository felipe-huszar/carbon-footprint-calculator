const carbonFootprintService = require('./carbonFootprintService');

const resolvers = {
    Mutation: {
        configureInitialParameters: async (_, { input }) => {
            try {
                return await carbonFootprintService.configureInitialParameters(input);                
            } catch (error) {                
                console.log(error);
                throw new Error(error.message);
            }
        },
        generateEmissionsReport: async (_, { input }) => {
            try {
                return await carbonFootprintService.generateEmissionsReport(input);                
            } catch (error) {                
                console.log(error);
                throw new Error(error.message);
            }
        },
    },
};

module.exports = resolvers;
