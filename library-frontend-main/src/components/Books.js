import { useQuery } from "@apollo/client"
import { ALL_BOOKS, BY_GENRE } from "../queries"
import { useState } from "react"

const Books = (props) => {
  const [filter, setFilter] = useState(null)
  const result = useQuery(ALL_BOOKS)
  const filteredBooks = useQuery(BY_GENRE, {
    variables: { filter },
  })

  if (!props.show) {
    return null
  }

  const booklist = result.data.allBooks
  let allGenres = []

  if (result.loading) {
    return <div>loading...</div>
  } else {
    booklist.forEach((a) => {
      let temp = a.genres
      let i = 0
      while (i < temp.length) {
        allGenres.push(temp[i])
        i++
      }
    })
  }

  const filteredList = () => {
    if (filter !== null) {
      if (filteredBooks.loading) {
        return <div>loading...</div>
      }
      return (
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>author</th>
              <th>published</th>
            </tr>
            {filteredBooks.data.allBooks.map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td></td>
                <td>{a.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    } else {
      return (
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>author</th>
              <th>published</th>
            </tr>
            {booklist.map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td></td>
                <td>{a.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }
  }
  return (
    <div>
      <h2>books</h2>
      {filteredList()}
      <br></br>
      {allGenres
        .filter((a, b, self) => self.indexOf(a) === b)
        .map((filter) => (
          <button
            key={filter}
            onClick={() => {
              setFilter(filter)
            }}
            type="button"
          >
            {filter}
          </button>
        ))}
      <button onClick={() => setFilter(null)}>All Genres</button>
    </div>
  )
}

export default Books
