import axios from 'axios'
import { QueryClient } from '@tanstack/react-query'
import { getAuthHeaders, removeStoredToken } from './auth'
import toast from 'react-hot-toast'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
})

// Request interceptor to add auth headers
api.interceptors.request.use(
  (config) => {
    const authHeaders = getAuthHeaders()
    config.headers = { ...config.headers, ...authHeaders }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeStoredToken()
      toast.error('Session expired. Please log in again.')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Default query function
const defaultQueryFn = async ({ queryKey }: { queryKey: string[] }) => {
  const url = queryKey[0]
  const { data } = await api.get(url)
  return data
}

// API request function for mutations
export const apiRequest = async (url: string, options: {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  data?: any
  params?: any
} = {}) => {
  const { method = 'GET', data, params } = options
  
  const response = await api.request({
    url,
    method,
    data,
    params,
  })
  
  return response.data
}

// Create and export query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      retry: (failureCount, error: any) => {
        // Don't retry on 401, 403, 404
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false
        }
        return failureCount < 3
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
})

export default api