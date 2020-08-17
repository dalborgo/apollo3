import React, { memo, useReducer, useState } from 'react'
import ReactDOM from 'react-dom'
import { ApolloClient, ApolloProvider, gql, InMemoryCache, makeVar, useQuery } from '@apollo/client'
import './wdyr'
import Norm from './norm'

const cartItemsVar = makeVar(false)
const typeDefs = gql`
  #basta anche solo field, FIELD_DEFINITION per schema e FIELD per query
  directive @client on FIELD
  extend type Query {
    dogs: [Dog]
    dog(id: ID!): Dog
    cartItems: Boolean
    isLoggedIn: Boolean
  }
  type Dog {
    id: ID!
    breed: String
    displayImage: String
  }
  extend type Product {
    isInCart: Int
  }
`

const cache = new InMemoryCache({
  typePolicies: {
    Book: {
      // If one of the keyFields is an object with fields of its own, you can
      // include those nested keyFields by using a nested array of strings:
      keyFields: ['isbn'],
      fields: {
        /* author: {
          merge(existing, incoming) {
            // Equivalent to what happens if there is no custom merge function.
            return incoming;
          },
        },*/
        title: {
          read (title = 'UNKNOWN NAME') {
            return title + ' @title'
          },
          merge (existing, incoming) {
            return incoming ? incoming + ' ' + (new Date()).toString() : existing
          },
        },
      },
    },
    Product: {
      fields: { // Field policy map for the Product type
        isInCart: { // Field policy for the isInCart field
          read (_, { variables }) { // The read function for the isInCart field
            return variables.id * 2 || 100
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

const MyContext = React.createContext()

// eslint-disable-next-line react/display-name
const AddToCartButtonWhy = memo(({ cartItems }) => {
  
  console.log('%cRENDER_BUTTON', 'color: orange')
  return (
    <div>
      <button
        onClick={() => cartItemsVar(!cartItems)}
      >
        {cartItems ? 'Spegni uno' : 'Accendi uno'}
      </button>
    </div>
  )
})
AddToCartButtonWhy.whyDidYouRender = true
// eslint-disable-next-line react/display-name
const AddToCartButton2Why = memo(({ state }) => {
  const dispatch = React.useContext(MyContext)
  console.log('%cRENDER_BUTTON2', 'color: pink')
  return (
    <div>
      <button
        onClick={() => dispatch({ type: 'setVal', payload: !state })}
      >
        {state ? 'Spegni due' : 'Accendi due'}
      </button>
    </div>
  )
})

AddToCartButton2Why.whyDidYouRender = true

// eslint-disable-next-line react/display-name
const AddToCartButton3Why = memo(() => {
  const { isLoggedIn } = client.readQuery({ query: IS_LOGGED_IN })
  return (
    <div>
      <button
        onClick={
          () => cache.modify({
            fields: {
              isLoggedIn (cachedIsLoggedIn) {
                return !cachedIsLoggedIn
              },
            },
          })
        }
      >
        {isLoggedIn ? 'Spegni tre' : 'Accendi tre'}
      </button>
    </div>
  )
})

AddToCartButton3Why.whyDidYouRender = true

function reducer (state, action) {
  switch (action.type) {
    case 'setVal':
      return action.payload
    default:
      return state
  }
}

const Cart = memo(({ state, cartItems: cRes, isLoggedIn }) => {
  console.log('%cRENDER_CART', 'color: cyan')
  const cartItems = cartItemsVar()
  return (
    <div className="cart">
      <div>My Cart</div>
      <AddToCartButtonWhy cartItems={cartItems}/>
      <AddToCartButton2Why state={state}/>
      <AddToCartButton3Why isLoggedIn={isLoggedIn}/>
      {
        cRes === false ?
          (
            <p>SPENTO UNO</p>
          )
          : (
            <p>ACCESO UNO</p>
          )
      }
      {
        state === false ?
          (
            <p>SPENTO DUE</p>
          ) :
          (
            <p>ACCESO DUE</p>
          )
      }
      {
        isLoggedIn === false ?
          (
            <p>SPENTO TRE</p>
          ) :
          (
            <p>ACCESO TRE</p>
          )
      }
    </div>
  )
})

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

// eslint-disable-next-line react/display-name
const HeaderWhy = memo(({ cartItems }) => {
  console.log('%cRENDER_HEADER1', 'color: yellow')
  return (
    <div style={{ width: '100%', backgroundColor: cartItems ? 'red' : 'yellow' }}>
      HEADER UNO
    </div>
  )
})
HeaderWhy.whyDidYouRender = true

// eslint-disable-next-line react/display-name
const Header2Why = memo(({ state }) => {
  console.log('%cRENDER_HEADER2', 'color: yellow')
  return (
    <div style={{ width: '100%', backgroundColor: state ? 'red' : 'yellow' }}>
      HEADER DUE
    </div>
  )
})

Header2Why.whyDidYouRender = true
// eslint-disable-next-line react/display-name
const Header3Why = memo(({ isLoggedIn }) => {
  console.log('%cRENDER_HEADER3', 'color: yellow')
  return (
    <div style={{ width: '100%', backgroundColor: isLoggedIn ? 'red' : 'yellow' }}>
      HEADER TRE
    </div>
  )
})

Header3Why.whyDidYouRender = true

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`

cache.writeQuery({
  query: IS_LOGGED_IN,
  data: {
    isLoggedIn: false,
  },
})

// eslint-disable-next-line no-unused-vars
const Main = () => {
  const { data } = useQuery(GET_CART_ITEMS)
  const { data: data2 } = useQuery(IS_LOGGED_IN)
  const [render, setRender] = useState('')
  console.log('render:', render)
  const [state, dispatch] = useReducer(reducer, false)
  return (
    <MyContext.Provider value={dispatch}>
      <button onClick={() => setRender(new Date())}>Render</button>
      <HeaderWhy cartItems={data.cartItems}/>
      <Header2Why state={state}/>
      <Header3Why isLoggedIn={data2.isLoggedIn}/>
      <br/>
      <div>
        {
          data && data2 &&
          <Cart cartItems={data.cartItems} isLoggedIn={data2.isLoggedIn} state={state}/>
        }
      </div>
    </MyContext.Provider>
  )
}

function App () {
  return (
    <ApolloProvider client={client}>
      <Norm/>
    </ApolloProvider>
  )
}

ReactDOM.render(<App/>, document.getElementById('root'))
