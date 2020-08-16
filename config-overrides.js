/*const { override } = require('customize-cra')
const { addReactRefresh } = require('customize-cra-react-refresh')
*/
const rewireInlineImportGraphqlAst = require('react-app-rewire-inline-import-graphql-ast')

module.exports = function override (config, env) {
  config = rewireInlineImportGraphqlAst(config, env)
  return config
}
/*
module.exports = override(
  addReactRefresh()
)

*/
