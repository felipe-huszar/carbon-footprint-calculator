const homeEnergyResolvers = require('./domains/homeEnergy/homeEnergyResolvers');
const transportationResolvers = require('./domains/transportation/transportationResolvers');
const wasteResolvers = require('./domains/waste/wasteResolvers');
const reportResolvers = require('./domains/carbonFootprint/carbonFootprintResolvers');

module.exports = {
    Query: {
        ...homeEnergyResolvers.Query,
        ...transportationResolvers.Query,
        ...wasteResolvers.Query,
        ...reportResolvers.Query,
    },
    Mutation: {
        ...homeEnergyResolvers.Mutation,
        ...transportationResolvers.Mutation,
        ...wasteResolvers.Mutation,
        ...reportResolvers.Mutation,
    },
};
