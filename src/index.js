import React from 'react'
import ReactDOM from 'react-dom'

import { ApolloClient, ApolloProvider, gql, InMemoryCache, useQuery } from '@apollo/client'

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        dogs (_, { args, toReference }) {
          return [{
            id: 'id',
            breed: 'breed',
            displayImage: 'displayImage',
          }]
        },
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

const client = new ApolloClient({
  cache,
})

const GET_ALL_DOGS = gql`
  query GetAllDogs {
    dogs {
      id
      breed
      displayImage
    }
  }
`

/*const GET_DOG = gql`
  query GetAllDogs {
    dog(id: "id") {
      id
      breed
      displayImage
    }
  }
`*/

// eslint-disable-next-line react/display-name
const MyApp = () => {
  const { loading, error, data } = useQuery(GET_ALL_DOGS)
  console.log('data:', data)
  console.log('loading:', loading)
  if (loading) {return <p>Loading...</p>}
  if (error) {return <p>Error :(</p>}
  
  return data.dogs.map(({ breed, displayImage }) => (
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
