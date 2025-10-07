import { useState, useEffect } from 'react'
import AppRoutes from "./routes/AppRoutes"

const App = () => {
  const [user, setUser] = useState(null)
  console.log('App rendering, user:', user) // Para debugging

  useEffect(() => {
    console.log('App useEffect running') // Para debugging
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
      position: 'relative',
      padding: '20px'
    }}>
      <h1 style={{ marginBottom: '20px' }}>Mafiest</h1>
      <AppRoutes user={user} setUser={setUser} />
    </div>
  )
}

export default App