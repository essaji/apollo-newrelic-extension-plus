const R = require('ramda')
const { GraphQLExtension } = require('graphql-extensions/dist/index')
const gql = require('graphql-tag')
const newrelic = require('newrelic')
const fieldTraceSummary = require('./field-trace-summary')

const errorCount = R.pipe(R.propOr([], 'errors'), R.length)

class NewRelicExtensionPlus extends GraphQLExtension {
    requestDidStart ({ queryString, variables, persistedQueryHit }) {
        const queryObject = gql`${queryString}`
        const transactionName = queryObject.definitions[0].selectionSet.selections
            .reduce((init, q, idx) => idx === 0 ? `${q.name.value}` : `${init}, ${q.name.value}` , '')
        newrelic.setTransactionName(`graphql (${transactionName})`)
        newrelic.addCustomAttribute('gqlQuery', queryString)
        newrelic.addCustomAttribute('gqlVars', JSON.stringify(variables))
        newrelic.addCustomAttribute('persistedQueryHit', persistedQueryHit)
    }

    willSendResponse ({ graphqlResponse }) {
        const tracingSummary = R.pipe(
            R.pathOr([], ['extensions', 'tracing']),
            fieldTraceSummary
        )(graphqlResponse)
        newrelic.addCustomAttribute('traceSummary', tracingSummary)
        newrelic.addCustomAttribute('errorCount', errorCount(graphqlResponse))
    }
}

module.exports = NewRelicExtensionPlus
