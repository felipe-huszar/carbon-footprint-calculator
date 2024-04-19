const transportationService = require('./transportationService');

const resolvers = {
    Mutation: {
        calculateTransportationEmission: async (_, { input }) => {
            try {
                const emissions = await transportationService.calculateEmissions(input);
                return emissions;
            } catch (error) {
                console.log(error);
                throw new Error(error.message);
            }
        },
    },
};

module.exports = resolvers;
