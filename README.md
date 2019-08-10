# Apollo New Relic Extension Plus
Creates newrelic transaction for graphql queries.

This is a forked repository of `apollo-newrelic-extension`. We created this plus package because
the previous package uses `operationName` as the `transactionName` which is an optional
 attribute in a graphql request and can be `null` at times. 

This package always uses graphql query name as the name of the transaction.

## Usage
```javascript
const newrelic = require('newrelic')
const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const ApolloNewrelicExtensionPlus = require('apollo-newrelic-extension')
const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // ...additional configuration...

  // Thunk for creating the newrelic extension
  extensions: [() => new ApolloNewrelicExtensionPlus(newrelic)],

  // Be sure to enable tracing
  tracing: true
})

const app = express()
server.applyMiddleware({ app })

app.listen(3000, () => console.log('Server listening on port 3000'))
```
