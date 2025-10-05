import { useState, useEffect } from 'react'
import AppRoutes from "./routes/AppRoutes"

const App = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#f6f8fa',
      position: 'relative'
    }}>
      <AppRoutes user={user} setUser={setUser} />
    </div>
  )
}

export default App