const R = require('ramda')
const { GraphQLExtension } = require('graphql-extensions/dist/index')
const gql = require('graphql-tag')
const fieldTraceSummary = require('./field-trace-summary')

const errorCount = R.pipe(R.propOr([], 'errors'), R.length)

class NewRelicExtensionPlus extends GraphQLExtension {
    constructor(newrelic) {
        super()
        this.newrelic = newrelic
    }
    requestDidStart ({ queryString, variables, persistedQueryHit }) {
        const queryObject = gql`${queryString}`
        const transactionName = queryObject.definitions[0].selectionSet.selections
            .reduce((init, q, idx) => idx === 0 ? `${q.name.value}` : `${init}, ${q.name.value}` , '')
        this.newrelic.setTransactionName(`graphql (${transactionName})`)
        this.newrelic.addCustomAttribute('gqlQuery', queryString)
        this.newrelic.addCustomAttribute('gqlVars', JSON.stringify(variables))
        this.newrelic.addCustomAttribute('persistedQueryHit', persistedQueryHit)
    }

    willSendResponse ({ graphqlResponse }) {
        const tracingSummary = R.pipe(
            R.pathOr([], ['extensions', 'tracing']),
            fieldTraceSummary
        )(graphqlResponse)
        this.newrelic.addCustomAttribute('traceSummary', tracingSummary)
        this.newrelic.addCustomAttribute('errorCount', errorCount(graphqlResponse))
    }
}

module.exports = NewRelicExtensionPlus
