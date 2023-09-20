import { LOGIN } from "../queries"
import { useMutation } from "@apollo/client"
import { useState, useEffect } from "react"

const LoginForm = ({ setUser }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message)
    },
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setUser(token)
      localStorage.setItem("user-token", token)
    }
  }, [result.data]) // eslint-disable-line

  const handleLogin = async (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        username
        <input
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
        password
        <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
