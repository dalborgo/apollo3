import React, { memo, useReducer, useState } from 'react'
import ReactDOM from 'react-dom'
import { useImmerReducer } from 'use-immer'
import { ApolloClient, ApolloProvider, gql, InMemoryCache, makeVar, useQuery } from '@apollo/client'
import { atom, RecoilRoot, useRecoilState, useRecoilValue } from 'recoil'
import './wdyr'

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
        title (title) {
          return title + ' @title'
        },
        numeri: {
          merge (existing = [], incoming = []) {
            return [...existing, ...incoming]
          },
        },
        author: {
          merge: true,
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
  console.log('%cRENDER_BUTTON3', 'color: pink')
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

const AddToCartButton4Why = memo(({ state, dispatch }) => {
  console.log('%cRENDER_BUTTON4', 'color: pink')
  return (
    <div>
      <button
        onClick={() => dispatch({ type: 'setVal', payload: !state })}
      >
        {state ? 'Spegni quattro' : 'Accendi quattro'}
      </button>
    </div>
  )
})

AddToCartButton4Why.whyDidYouRender = true

const AddToCartButton5Why = memo(({ state, setStateRecoil }) => {
  console.log('%cRENDER_BUTTON5', 'color: pink')
  return (
    <div>
      <button
        onClick={() => setStateRecoil(!state)}
      >
        {state ? 'Spegni 5' : 'Accendi 5'}
      </button>
    </div>
  )
})

AddToCartButton5Why.displayName = 'CINQUE'
AddToCartButton5Why.whyDidYouRender = true

const Cart = memo(({ state, stateImmer, cartItems: cRes, isLoggedIn, dispatch, stateRecoil, setStateRecoil }) => {
  console.log('%cRENDER_CART', 'color: cyan')
  const cartItems = cartItemsVar()
  return (
    <div className="cart">
      <div>My Cart</div>
      <AddToCartButtonWhy cartItems={cartItems}/>
      <AddToCartButton2Why state={state}/>
      <AddToCartButton3Why isLoggedIn={isLoggedIn}/>
      <AddToCartButton4Why dispatch={dispatch} state={stateImmer}/>
      <AddToCartButton5Why setStateRecoil={setStateRecoil} state={stateRecoil}/>
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
      {
        stateImmer === false ?
          (
            <p>SPENTO qu</p>
          ) :
          (
            <p>ACCESO qu</p>
          )
      }
      {
        stateRecoil === false ?
          (
            <p>SPENTO 5</p>
          ) :
          (
            <p>ACCESO 5</p>
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

const HeaderWhy = memo(({ cartItems }) => {
  console.log('%cRENDER_HEADER1', 'color: yellow')
  return (
    <div style={{ width: '100%', backgroundColor: cartItems ? 'red' : 'yellow' }}>
      HEADER UNO
    </div>
  )
})
HeaderWhy.displayName = 'HeaderWhy'
HeaderWhy.whyDidYouRender = true

const Header2Why = memo(({ state }) => {
  console.log('%cRENDER_HEADER2', 'color: yellow')
  return (
    <div style={{ width: '100%', backgroundColor: state ? 'red' : 'yellow' }}>
      HEADER DUE
    </div>
  )
})
Header2Why.displayName = 'Header2Why'
Header2Why.whyDidYouRender = true

const Header3Why = memo(({ isLoggedIn }) => {
  console.log('%cRENDER_HEADER3', 'color: pink')
  return (
    <div style={{ width: '100%', backgroundColor: isLoggedIn ? 'red' : 'yellow' }}>
      HEADER TRE
    </div>
  )
})
Header3Why.displayName = 'Header3Why'
Header3Why.whyDidYouRender = true

const Header4Why = memo(({ state }) => {
  console.log('%cRENDER_HEADER4', 'color: yellow')
  return (
    <div style={{ width: '100%', backgroundColor: state ? 'red' : 'yellow' }}>
      HEADER qu
    </div>
  )
})
Header4Why.displayName = 'Header4Why'
Header4Why.whyDidYouRender = true

const loadingState = atom({
  key: 'loadingState',
  default: false,
})

const Header5Why = memo(() => {
  console.log('%cRENDER_HEADER5', 'color: yellow')
  const state = useRecoilValue(loadingState)
  return (
    <div style={{ width: '100%', backgroundColor: state ? 'red' : 'yellow' }}>
      HEADER cinque
    </div>
  )
})
Header5Why.displayName = 'Header5Why'
Header5Why.whyDidYouRender = true

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

function reducer (state, action) {
  switch (action.type) {
    case 'setVal':
      return true
    default:
      return state
  }
}

function immerReducer (draft, action) {
  switch (action.type) {
    case 'setVal':
      return action.payload
    default:
      throw new Error('Invalid action type!')
  }
}


// eslint-disable-next-line no-unused-vars
const Main = () => {
  const { data } = useQuery(GET_CART_ITEMS)
  const { data: data2 } = useQuery(IS_LOGGED_IN)
  const [render, setRender] = useState('')
  console.log('render:', render)
  const [state, dispatch] = useReducer(reducer, false)
  const [stateImmer, dispatchImmer] = useImmerReducer(immerReducer, false)
  const [stateRecoil, setStateRecoil] = useRecoilState(loadingState)
  return (
    <MyContext.Provider value={dispatch}>
      <button onClick={() => setRender(new Date())}>Render</button>
      <HeaderWhy cartItems={data.cartItems}/>
      <Header2Why state={state}/>
      <Header3Why isLoggedIn={data2.isLoggedIn}/>
      <Header4Why state={stateImmer}/>
      <Header5Why/>
      <br/>
      <div>
        {
          data && data2 &&
          <Cart
            cartItems={data.cartItems}
            dispatch={dispatchImmer}
            isLoggedIn={data2.isLoggedIn}
            setStateRecoil={setStateRecoil}
            state={state}
            stateImmer={stateImmer}
            stateRecoil={stateRecoil}
          />
        }
      </div>
    </MyContext.Provider>
  )
}

function App () {
  return (
    <ApolloProvider client={client}>
      <RecoilRoot>
        <Main/>
      </RecoilRoot>
    </ApolloProvider>
  )
}

ReactDOM.render(<App/>, document.getElementById('root'))
