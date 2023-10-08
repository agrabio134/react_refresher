
import './App.css'
import { AuthProvider } from './components/Auth/AuthContext'
import MainLayout from './components/layout/MainLayout'

function App() {

  return (
    <>
  <AuthProvider>
  <MainLayout />

  </AuthProvider>,

    </>
  )
}

export default App
