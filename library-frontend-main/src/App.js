import { useEffect, useState } from "react"
import { useQuery } from "@apollo/client"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import LoginForm from "./components/LoginForm"
import { ALL_AUTHORS, BOOK_ADDED, ALL_BOOKS } from "./queries"
import { useApolloClient, useSubscription } from "@apollo/client"

const App = () => {
  const [page, setPage] = useState("authors")
  const [user, setUser] = useState(null)
  const client = useApolloClient()
  const result = useQuery(ALL_AUTHORS)

  useEffect(() => {
    const loggedUser = localStorage.getItem("user-token")
    if (loggedUser) {
      setUser(loggedUser)
    }
  }, [])

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      alert(`New book ${addedBook.title} added to booklist`)
      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(addedBook),
        }
      })
    },
  })

  const logout = () => {
    setUser(null)
    localStorage.clear()
    client.resetStore()
  }

  if (result.loading) {
    return <div>loading...</div>
  }
  if (user === null) {
    return (
      <div>
        <LoginForm setUser={setUser} />
      </div>
    )
  }
  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
        <button onClick={logout}>logout</button>
      </div>

      <Authors show={page === "authors"} authors={result.data.allAuthors} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />
    </div>
  )
}

export default App
