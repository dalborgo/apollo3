import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloClient, ApolloProvider, gql, InMemoryCache } from '@apollo/client'

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

const client = new ApolloClient({ cache })

const newDog = {
  id: '6',
  breed: 'lucky',
  displayImage: 'miao',
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
    query GetAllDogs {
        dog(id: 6) {
            id
            breed
            displayImage
        }
    }
`

client.writeQuery({
  query: GET_ALL_DOGS,
  data: {
    dogs: [newDog],
  },
})

const MyApp = () => {
  const { dogs } = client.readQuery({ query: GET_ALL_DOGS })
  const { dog } = client.readQuery({ query: GET_DOG })
  console.log('dog:', dog)
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
