import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useAuth } from './contexts/AuthContext.jsx'
import AuthForm from './components/AuthForm.jsx'

function App() {
  const { user, logout, loading } = useAuth()
  const [count, setCount] = useState(0)

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <AuthForm />
  }

  return (
    <>
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <span style={{ marginRight: '15px' }}>Welcome, {user.username}!</span>
        <button onClick={logout} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
