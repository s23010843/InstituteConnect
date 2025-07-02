import { useQuery } from '@tanstack/react-query'
import { getStoredToken, isTokenExpired, type User } from '@/lib/auth'

export function useAuth() {
  const token = getStoredToken()
  
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ['/api/auth/me'],
    enabled: !!token && !isTokenExpired(token),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !!token && !isTokenExpired(token),
    error
  }
}