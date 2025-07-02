import { useEffect, useState } from 'react'
import { Router, Route, Switch } from 'wouter'
import { Toaster } from 'react-hot-toast'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import OTPVerification from './pages/OTPVerification'
import Courses from './pages/Courses'
import Faculty from './pages/Faculty'
import News from './pages/News'
import Contact from './pages/Contact'
import AuthCallback from './pages/AuthCallback'
import NotFound from './pages/NotFound'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Hooks
import { useAuth } from './hooks/useAuth'

// Utils
import { getStoredToken } from './lib/auth'

function App() {
  const { isAuthenticated, isLoading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Handle authentication from URL params (for OAuth callbacks)
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    if (token) {
      localStorage.setItem('authToken', token)
      window.history.replaceState({}, document.title, window.location.pathname)
      window.location.reload()
    }
  }, [])

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          
          <main className="flex-1">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/verify-otp" component={OTPVerification} />
              <Route path="/courses" component={Courses} />
              <Route path="/faculty" component={Faculty} />
              <Route path="/news" component={News} />
              <Route path="/contact" component={Contact} />
              <Route path="/auth/callback" component={AuthCallback} />
              <Route component={NotFound} />
            </Switch>
          </main>
          
          <Footer />
        </div>
      </Router>
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </>
  )
}

export default App