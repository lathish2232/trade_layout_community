'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { API_URLS } from '@/config/api'

export default function GoogleCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Connecting to Google...')

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // Check if we have token directly from backend redirect
        const token = searchParams.get('token')
        const user_id = searchParams.get('user_id')
        const display_name = searchParams.get('display_name')
        const email = searchParams.get('email')
        const avatar_url = searchParams.get('avatar_url')
        const is_active = searchParams.get('is_active')
        const created_at = searchParams.get('created_at')
        const auth_provider = searchParams.get('auth_provider')
        const is_oauth_user = searchParams.get('is_oauth_user')
        const email_verified = searchParams.get('email_verified')

        console.log('=== GOOGLE OAUTH URL PARAMETERS ===')
        console.log('📥 Received from backend:')
        console.log('token:', token ? 'Present' : 'Missing')
        console.log('user_id:', user_id)
        console.log('display_name:', display_name)
        console.log('email:', email)
        console.log('===================================')

        if (token) {
          // Direct token flow - backend already processed OAuth
          setMessage('Setting up your account...')
          
          // Create user object from URL parameters
          const userData = {
            id: parseInt(user_id || '1') || 1,
            user_id: user_id || '',
            display_name: display_name || '',
            email: email || '',
            avatar_url: avatar_url || '',
            is_active: is_active === 'True',
            created_at: created_at || '',
            auth_provider: auth_provider || '',
            is_oauth_user: is_oauth_user === 'True',
            email_verified: email_verified === 'True'
          }

          // Store authentication data
          console.log('=== STORING IN LOCAL STORAGE ===')
          console.log('📦 Storing User Data:')
          console.log('isAuthenticated:', 'true')
          console.log('token:', 'Present')
          console.log('user:', JSON.stringify(userData, null, 2))
          console.log('================================')

          localStorage.setItem('isAuthenticated', 'true')
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(userData))

          // Update authentication status
          setStatus('success')
          setMessage('Successfully signed in with Google!')

          // Redirect to community feed after a short delay
          setTimeout(() => {
            router.push('/community_feed')
          }, 1500)

        } else {
          // Check for error parameters
          const error = searchParams.get('error')
          const error_description = searchParams.get('error_description')
          
          if (error) {
            throw new Error(`Google authentication failed: ${error} - ${error_description}`)
          }

          // Check for code (original flow - fallback)
          const code = searchParams.get('code')
          if (!code) {
            throw new Error('No authorization code or token received')
          }

          // Original flow - make POST request to backend
          setMessage('Exchanging code for access token...')
          
          // Get additional URL parameters that Google might provide
          const state = searchParams.get('state')
          const scope = searchParams.get('scope')
          const authuser = searchParams.get('authuser')
          const prompt = searchParams.get('prompt')
          const hd = searchParams.get('hd') // hosted domain
          const session_state = searchParams.get('session_state')
          
          const requestData = {
            code: code,
            state: state,
            scope: scope,
            authuser: authuser,
            prompt: prompt,
            hd: hd,
            session_state: session_state
          }
          
          // Log what we're sending to backend
          console.log('=== GOOGLE OAUTH CALLBACK DEBUG ===')
          console.log('📤 Sending to Backend:')
          console.log('URL:', API_URLS.GOOGLE_OAUTH_CALLBACK)
          console.log('Method:', 'POST')
          console.log('Headers:', { 'Content-Type': 'application/json' })
          console.log('Body (Request Data):', JSON.stringify(requestData, null, 2))
          console.log('==========================================')
          
          // Send authorization code and additional data to backend
          const response = await fetch(API_URLS.GOOGLE_OAUTH_CALLBACK, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
          })

          console.log('Backend response status:', response.status)
          console.log('Backend response headers:', Object.fromEntries(response.headers.entries()))
          
          if (!response.ok) {
            const errorData = await response.json()
            console.error('❌ Backend Error Response:')
            console.error('Status:', response.status)
            console.error('Status Text:', response.statusText)
            console.error('Error Data:', JSON.stringify(errorData, null, 2))
            console.error('====================================')
            
            throw new Error(errorData.detail || 'Failed to authenticate with Google')
          }

          const data = await response.json()
          console.log('✅ Backend Success Response:')
          console.log('Status:', response.status)
          console.log('Response Data:', JSON.stringify(data, null, 2))
          console.log('===================================')
          
          setMessage('Setting up your account...')
          
          // Log what we're storing in localStorage
          console.log('=== STORING IN LOCAL STORAGE ===')
          console.log('📦 Storing User Data:')
          console.log('isAuthenticated:', 'true')
          console.log('token:', data.access_token ? 'Present' : 'Missing')
          console.log('user:', JSON.stringify(data.user, null, 2))
          console.log('================================')
          
          // Store JWT token and user data in localStorage
          localStorage.setItem('isAuthenticated', 'true')
          localStorage.setItem('token', data.access_token)
          localStorage.setItem('user', JSON.stringify(data.user))
          
          // Update authentication status
          setStatus('success')
          setMessage('Successfully signed in with Google!')
          
          // Redirect to community feed after a short delay
          setTimeout(() => {
            router.push('/community_feed')
          }, 1500)
        }
        
      } catch (error) {
        console.error('Google OAuth callback error:', error)
        setStatus('error')
        setMessage(error instanceof Error ? error.message : 'An unexpected error occurred')
        
        // Redirect to sign-in page after a delay
        setTimeout(() => {
          router.push('/auth/signin?error=oauth_failed')
        }, 3000)
      }
    }

    handleGoogleCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Status Icon */}
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-pink-100 mb-4">
            {status === 'loading' && (
              <svg className="animate-spin h-8 w-8 text-pink-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {status === 'success' && (
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {status === 'error' && (
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>

          {/* Status Message */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {status === 'loading' && 'Authenticating...'}
            {status === 'success' && 'Success!'}
            {status === 'error' && 'Authentication Failed'}
          </h2>
          
          <p className="text-gray-600 mb-4">
            {message}
          </p>

          {/* Additional Info */}
          {status === 'loading' && (
            <div className="text-sm text-gray-500">
              Please wait while we complete your sign-in...
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-sm text-green-600">
              Redirecting you to the forum...
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-2">
              <p className="text-sm text-red-600">
                You will be redirected to the sign-in page shortly.
              </p>
              <button
                onClick={() => router.push('/auth/signin')}
                className="text-sm text-pink-600 hover:text-pink-500 font-medium"
              >
                Go to Sign In
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar for Loading State */}
        {status === 'loading' && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-pink-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
          </div>
        )}
      </div>
    </div>
  )
}
