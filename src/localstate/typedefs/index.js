import { gql } from '@apollo/client'

const typeDefs = gql`
  directive @client on FIELD_DEFINITION
  type Query {
    dogs: [Dog]
  }
  type Dog {
    id: ID!
    breed: String
    displayImage: String
  }
`
export default typeDefs
