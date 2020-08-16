import React from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'

const BOOK_WITH_AUTHOR_NAME = gql`
  query BookWithAuthorName {
    favoriteBook {
      isbn
      title
      author {
        name
      }
    }
  }
`
const CHANGE_BOOK = gql`
  mutation ChangeBook($input: EditBookInput!) {
    changeBook(input:$input) {
      isbn
      title
      author {
        name
      }
    }
  }
`
const Norm = () => {
  const { data } = useQuery(BOOK_WITH_AUTHOR_NAME)
  const [changeBook] = useMutation(CHANGE_BOOK, {
    variables: {
      input: { title: String(new Date()) },
    },
  })
  if (data) {
    return (
      <>
        <button onClick={changeBook}>Premi</button>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </>
    )
  } else {
    return <div>Loading...</div>
  }
}

export default Norm

