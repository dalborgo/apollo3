import React from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'

const BOOK_WITH_AUTHOR_NAME = gql`
  query BookWithAuthorName {
    favoriteBook {
      isbn
      title
      numeri
      author {
        name
      }
    }
  }
`
const BOOK_WITH_AUTHOR_LANGUAGE = gql`
  query BookWithAuthorLanguage  {
    favoriteBook {
      isbn
      title
      numeri
      author {
        language
      }
    }
  }
`
const CHANGE_BOOK = gql`
  mutation ChangeBook($input: EditBookInput!) {
    changeBook(input:$input) {
      isbn
      title
      numeri
      author {
        name
        language
      }
    }
  }
`
const Norm = () => {
  const { data } = useQuery(BOOK_WITH_AUTHOR_NAME)
  const { data: data2 } = useQuery(BOOK_WITH_AUTHOR_LANGUAGE)
  const [changeBook] = useMutation(CHANGE_BOOK, {
    variables: {
      input: { title: String(Math.random()), numeri: [77, 122], author: { language: 'it', name: 'nuovo' } },
    },
  })
  if (data) {
    return (
      <>
        <button onClick={changeBook}>Premi</button>
        <pre>{JSON.stringify(data, null, 2)}</pre>
        <pre style={{ color: 'blue' }}>{JSON.stringify(data2, null, 2)}</pre>
      </>
    )
  } else {
    return <div>Loading...</div>
  }
}

export default Norm

