import { gql } from "@apollo/client"

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`
export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author {
        name
      }
      published
      genres
    }
  }
`
export const ADD_BOOK = gql`
  mutation addBook(
    $title: String!
    $published: Int!
    $author: String!
    $genres: [String]!
  ) {
    addBook(title: $title, published: $published, name: $author, genres: $genres) {
      title
      published
      author {
        name
      }
      genres
    }
  }
`
export const BY_GENRE = gql`
  query by_genre($filter: String!) {
    allBooks(genre: $filter) {
      title
      author {
        name
      }
      published
      genres
    }
  }
`

export const UPDATE_AUTHOR = gql`
  mutation editAuthor($author: String!, $year: Int) {
    editAuthor(name: $author, setBornTo: $year) {
      name
      born
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`
export const CREATE_USER = gql`
  mutation createUser($username: String!) {
    createUser(username: $username) {
      username
      id
    }
  }
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
      author {
        name
      }
      published
      genres
    }
  }
`
