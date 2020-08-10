import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloClient, ApolloProvider, gql, InMemoryCache } from '@apollo/client'

const typeDefs = gql`
  directive @client on FIELD_DEFINITION
  extend type Query {
    dogs: [Dog]
    dog(id: ID!): Dog
  }
  type Dog {
    id: ID!
    breed: String
    displayImage: String
  }
`

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        dog (_, { args, toReference }) {
          return toReference({
            __typename: 'Dog',
            id: args.id,
          })
        },
      },
    },
  },
})

const client = new ApolloClient({ cache, typeDefs })

const newDog = {
  id: 6,
  breed: 'lucky',
  displayImage: 'miao',
  __typename: 'Dog',
}
const newDog2 = {
  id: 7,
  breed: 'lucky2',
  displayImage: 'miao2',
  __typename: 'Dog',
}

const GET_ALL_DOGS = gql`
  query GetAllDogs {
    dogs {
      id
      breed
      displayImage
    }
  }
`
const GET_DOG = gql`
  query GetAllDogs ($id: ID!) {
    dog(id: $id) {
      id
      breed
      displayImage
    }
  }
`

client.writeQuery({
  query: GET_ALL_DOGS,
  data: {
    dogs: [newDog, newDog2],
  },
})

const MY_FRAG = gql`
  fragment MyDog on Dog {
    id
    breed
    displayImage
  }
`
client.writeFragment({
  id: '9',
  fragment: MY_FRAG,
  data: {
    id: 9,
    breed: 'sec',
    displayImage: 'mio',
    __typename: 'Dog',
  },
})

const MyApp = () => {
  const { dogs } = client.readQuery({ query: GET_ALL_DOGS })
  const { dog } = client.readQuery({ query: GET_DOG, variables: { id: 7 } })
  //console.log('dog:', dog)
  
  const dog2 = client.readFragment({
    id: 9,
    fragment: MY_FRAG,
  })
  console.log('dog2:', dog2)
  return dogs.map(({ breed, displayImage }) => (
    <div key={breed}>
      <p>
        {breed}: {displayImage}
      </p>
    </div>
  ))
}

function App () {
  return (
    <ApolloProvider client={client}>
      <MyApp/>
    </ApolloProvider>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('root')
)
