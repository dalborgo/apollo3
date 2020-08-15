import React from 'react'
import { graphql } from '@apollo/client/react/hoc'
import myImportedQuery from './products.graphql'

const ProductsPage = props => {
  if (props.data.loading) {return <h3>Loading...</h3>}
  return <div>{`This is my data: ${JSON.stringify(props.data.products, null, 2)}`}</div>
}

export default graphql(myImportedQuery)(ProductsPage)
