import React, { memo, useReducer, useState } from 'react'
import ReactDOM from 'react-dom'
import { ApolloClient, ApolloProvider, gql, InMemoryCache, makeVar, useQuery } from '@apollo/client'
import './wdyr'

const cartItemsVar = makeVar([])
const typeDefs = gql`
  directive @client on FIELD_DEFINITION
  extend type Query {
    dogs: [Dog]
    dog(id: ID!): Dog
    cartItems: [String]
  }
  type Dog {
    id: ID!
    breed: String
    displayImage: String
  }
  type Product {
    isInCart: Int
  }
`

const cache = new InMemoryCache({
  typePolicies: {
    Product: {
      fields: { // Field policy map for the Product type
        isInCart: { // Field policy for the isInCart field
          read (_, { variables }) { // The read function for the isInCart field
            return variables.id * 2
          },
        },
      },
    },
    Query: {
      fields: {
        dog (_, { args, toReference }) {
          return toReference({
            __typename: 'Dog',
            id: args.id,
          })
        },
        cartItems: {
          read () {
            return cartItemsVar()
          },
        },
      },
      cartItems: {
        read () {
          return cartItemsVar()
        },
      },
    },
  },
})

const client = new ApolloClient({ cache, typeDefs, uri: 'http://localhost:4000/graphql' })

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
const GET_PRODUCT_DETAILS = gql`
  query ProductDetails($id: ID!) {
    product(id: $id) {
      name
      price
      isInCart @client
    }
  }
`

export const GET_CART_ITEMS = gql`
  query GetCartItems {
    cartItems @client
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

// eslint-disable-next-line react/display-name
const AddToCartButtonWhy = () => {
  const cartItems = cartItemsVar()
  console.log('%cRENDER_BUTTON', 'color: orange')
  return (
    <div>
      <button
        onClick={() => cartItemsVar([...cartItems, String(new Date())])}
      >
        Add to Cart
      </button>
    </div>
  )
}
AddToCartButtonWhy.whyDidYouRender = true
// eslint-disable-next-line react/display-name
const AddToCartButton2Why = memo(({ dispatch }) => {
  console.log('%cRENDER_BUTTON2', 'color: pink')
  return (
    <div>
      <button
        onClick={() => dispatch({ type: 'setVal', payload: String(new Date()) })}
      >
        Button to Cart 2
      </button>
    </div>
  )
})

AddToCartButton2Why.whyDidYouRender = true

function reducer (state, action) {
  switch (action.type) {
    case 'setVal':
      return [...state, action.payload]
    default:
      return state
  }
}

function Cart () {
  const [render, setRender] = useState('')
  const { data, loading, error } = useQuery(GET_CART_ITEMS)
  const [state, dispatch] = useReducer(reducer, [])
  console.log('state:', state)
  console.log('render:', render)
  if (loading) {
    return <span>Loading...</span>
  }
  if (error) {
    return <p>ERROR: {error.message}</p>
  }
  return (
    <div className="cart">
      <div>My Cart</div>
      <AddToCartButtonWhy/>
      <AddToCartButton2Why dispatch={dispatch}/>
      <button onClick={() => setRender(new Date())}>Render</button>
      {
        data && data.cartItems.length === 0 ? (
          <p>No items in your cart</p>
        ) : (
          <>
            {
              data && data.cartItems.map(productId => (
                <div key={productId}>{productId}</div>
              ))
            }
          </>
        )
      }
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
const MyApp = () => {
  console.log('%cRENDER_COMP', 'color: yellow')
  const { dogs } = client.readQuery({ query: GET_ALL_DOGS })
  const { dog } = client.readQuery({ query: GET_DOG, variables: { id: 7 } })
  const { data } = useQuery(GET_PRODUCT_DETAILS, { variables: { id: 12 } })
  console.log('dog:', dog)
  console.log('data:', data)
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
      <Cart/>
    </ApolloProvider>
  )
}

ReactDOM.render(<App/>, document.getElementById('root'))
