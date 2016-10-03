# graphql-document-collector
Load up smartly, in one location, all of the GraphQL queries/mutations/subscriptions of your project

## Installation

```
npm i -g graphql-document-collector
```

## Usage

`collect-gql` has a straightforward CLI interface to precompile all of your GraphQL documents in one definition file:

```
collect-gql '$glob' > $dest
```

## Example

Collect all `.graphql` files of your project in a single `documents.json` definition file:

```
collect-gql '**/*.graphql' > documents.json
```

This can be exploited afterwards like this:

```js
// Note: if you are using webpack, you will need to setup a 'json-loader'
const graphqlDocs = require('./documents.json');

// You can use any client able to read some graphql document AST
apolloClient.query({query: graphqlDocs['queries/ListMovies.graphql']})
.then(({data}) => {/* ... */});
```

> Note: you don't have to worry about loading fragments, they are already resolved in the document.
