const { makeExecutableSchema } = require('@graphql-tools/schema');
const { loadFilesSync } = require('@graphql-tools/load-files');
const { mergeTypeDefs } = require('@graphql-tools/merge');
const resolvers = require('./rootResolvers');
const path = require('path');

const typesArray = loadFilesSync(path.join(__dirname, 'domains'), { extensions: ['graphql'] });

const typeDefs = mergeTypeDefs(typesArray);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports = schema;
