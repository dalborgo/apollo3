import React from 'react'
import { gql, useQuery } from '@apollo/client'

const GET_PRODUCTS = gql`
  query Products {
    products {
      name
      price
    }
  }
`

const Component = props => {
  const { data } = useQuery(GET_PRODUCTS)
  console.log(data)
  return (
    <div>
      PROVA
    </div>
  )
}

export default Component
