const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql/schema');
const rootResolvers = require('./graphql/rootResolvers');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:3001' }));

app.use(
    '/graphql',
    graphqlHTTP({
        schema: schema,
        rootValue: rootResolvers,
        graphiql: true, // Set to false if you don't want graphiql enabled
    })
);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
