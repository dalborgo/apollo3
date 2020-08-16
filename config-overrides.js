const rewireInlineImportGraphqlAst = require('react-app-rewire-inline-import-graphql-ast')

module.exports = function override (config, env) {
  config = rewireInlineImportGraphqlAst(config, env)
  return config
}

/*
const { NODE_ENV } = process.env
if(NODE_ENV !== 'production') {
  const { override } = require('customize-cra')
  const { addReactRefresh } = require('customize-cra-react-refresh')
  module.exports = override(
    addReactRefresh()
  )
}
*/
