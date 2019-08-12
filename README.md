# Apollo New Relic Extension Plus
Creates newrelic transaction for graphql queries.

This is a forked repository of `apollo-newrelic-extension`. We decided to create this plus package as
the previous package uses `operationName` as the `transactionName` which is an optional
 attribute in a graphql request and can be `null` at times. 

This package always utilizes graphql query name as the name of the transaction which can never be `null`

Also `newrelic` libraries requires it to be imported as first thing in the project therefore we
decided to pass it as parameter to the `apollo-newrelic-extension-plus` extension.

## Usage
* Run `npm install --save apollo-newrelic-extension-plus`
* Import `newrelic` on top of app & pass it as parameter
* Enable tracing in your ApolloServer configuration by setting `tracing: true`
## Example
```javascript
const newrelic = require('newrelic')
const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const ApolloNewrelicExtensionPlus = require('apollo-newrelic-extension-plus')
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
