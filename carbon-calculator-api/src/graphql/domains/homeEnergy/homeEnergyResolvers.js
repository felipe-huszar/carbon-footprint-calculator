const homeEnergyService = require('./homeEnergyService');

const resolvers = {
    Mutation: {
        calculateHomeEnergyEmission: async (_, { input }) => {
            try {
                return await homeEnergyService.calculateEmissions(input);                
            } catch (error) {                
                console.log(error);
                throw new Error(error.message);
            }
        },
    },
};

module.exports = resolvers;
