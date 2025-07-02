import { useEffect } from 'react'
import { useLocation } from 'wouter'
import { setStoredToken } from '@/lib/auth'

const AuthCallback = () => {
  const [, setLocation] = useLocation()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    const error = urlParams.get('error')

    if (token) {
      setStoredToken(token)
      setLocation('/')
    } else if (error) {
      console.error('OAuth error:', error)
      setLocation('/login?error=' + encodeURIComponent(error))
    } else {
      setLocation('/login')
    }
  }, [setLocation])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Processing authentication...</p>
      </div>
    </div>
  )
}

export default AuthCallback