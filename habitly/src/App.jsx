import { useAuth } from './contexts/AuthContext'
import AuthForm from './components/AuthForm'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  return <Dashboard />
}

export default App
