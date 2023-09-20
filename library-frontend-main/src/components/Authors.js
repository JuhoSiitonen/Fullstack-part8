import { useState } from "react"
import { useMutation } from "@apollo/client"

import { UPDATE_AUTHOR, ALL_AUTHORS } from "../queries"

const Authors = (props) => {
  const [author, setAuthor] = useState("")
  const [yearBorn, setYearBorn] = useState("")

  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      const errors = error.graphQLErrors[0].extensions.error.errors
      const messages = Object.values(errors)
        .map((e) => e.message)
        .join("\n")
      console.log(messages)
    },
  })

  const submit = async (event) => {
    event.preventDefault()
    let year = Number(yearBorn)
    updateAuthor({ variables: { author, year } })

    setYearBorn("")
    setAuthor("")
  }

  if (!props.show) {
    return null
  }
  const authors = props.authors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br></br>
      <h2>set birthyear</h2>
      <form onSubmit={submit}>
        name
        <select value={author} onChange={({ target }) => setAuthor(target.value)}>
          <option value={""}></option>
          {authors.map((a) => (
            <option value={a.name} key={a.name}>
              {a.name}
            </option>
          ))}
        </select>
        born
        <input
          value={yearBorn}
          onChange={({ target }) => setYearBorn(target.value)}
        ></input>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
