import { useAuth } from './contexts/AuthContext'
import AuthForm from './components/AuthForm'
import './App.css'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <AuthForm />
  }

  return (
    <div className="app">
      <h1>Welcome, {user.username}!</h1>
      <p>Future DashBoard</p>
    </div>
  )
}

export default App
