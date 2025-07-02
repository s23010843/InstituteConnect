import { useState, useEffect } from 'react'
import { useLocation } from 'wouter'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

import { apiRequest } from '@/lib/queryClient'
import { setStoredToken } from '@/lib/auth'
import { otpSchema } from '@shared/schema'
import type { OtpData } from '@shared/schema'

const OTPVerification = () => {
  const [, setLocation] = useLocation()
  const [email, setEmail] = useState('')
  const [countdown, setCountdown] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<OtpData>({
    resolver: zodResolver(otpSchema)
  })

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const emailParam = urlParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
      setValue('email', emailParam)
    } else {
      setLocation('/login')
    }
  }, [setLocation, setValue])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const verifyMutation = useMutation({
    mutationFn: async (data: OtpData) => {
      return await apiRequest('/api/auth/verify-otp', {
        method: 'POST',
        data
      })
    },
    onSuccess: (response) => {
      setStoredToken(response.token)
      toast.success('Email verified successfully!')
      setLocation('/')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'OTP verification failed')
    }
  })

  const resendMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/auth/resend-otp', {
        method: 'POST',
        data: { email }
      })
    },
    onSuccess: () => {
      toast.success('New OTP sent to your email')
      setCountdown(60)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to resend OTP')
    }
  })

  const onSubmit = (data: OtpData) => {
    verifyMutation.mutate(data)
  }

  const handleResendOTP = () => {
    if (countdown === 0) {
      resendMutation.mutate()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a 6-digit verification code to{' '}
            <span className="font-medium text-gray-900">{email}</span>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <div className="mt-1">
              <input
                {...register('otp')}
                type="text"
                maxLength={6}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm text-center text-2xl tracking-widest"
                placeholder="000000"
                autoComplete="one-time-code"
              />
            </div>
            {errors.otp && (
              <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={verifyMutation.isPending}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {verifyMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Verify Email'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={countdown > 0 || resendMutation.isPending}
                className="font-medium text-blue-600 hover:text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {resendMutation.isPending ? (
                  <span className="inline-flex items-center">
                    <RefreshCw className="h-4 w-4 animate-spin mr-1" />
                    Sending...
                  </span>
                ) : countdown > 0 ? (
                  `Resend in ${countdown}s`
                ) : (
                  'Resend OTP'
                )}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OTPVerification