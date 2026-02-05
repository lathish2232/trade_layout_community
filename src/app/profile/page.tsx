'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AuthGuard from '@/components/AuthGuard'
import ProfileNavigation from '@/components/ProfileNavigation'
import { API_URLS, API_CONFIG } from '@/config/api'

interface User {
  id: number
  user_id: string
  email: string
  first_name?: string
  last_name?: string
  display_name?: string
  full_name?: string
  avatar_url?: string
  phone_number?: string
  trading_experience?: string
  income_range?: string
  trading_interest?: string
  trading_interest_stock?: boolean
  trading_interest_futures?: boolean
  trading_interest_none?: boolean
  automation_interest?: string
  auth_provider: 'google' | 'email'
  provider_id?: string
  is_oauth_user: boolean
  created_at: string
  updated_at: string
  is_active: boolean
  email_verified: boolean
  last_login: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<User>>({})

  useEffect(() => {
    // Get user data from localStorage and fetch fresh data from backend
    const getUserData = async () => {
      try {
        // First get data from localStorage for immediate display
        const userStr = localStorage.getItem('user')
        if (userStr) {
          const userData = JSON.parse(userStr)
          setUser(userData)
          setFormData(userData)
        }

        // Then fetch fresh data from backend
        const token = localStorage.getItem('token')
        if (token) {
          console.log('Fetching fresh user data from backend...')
          console.log('Token present:', token ? 'Yes' : 'No')
          console.log('API URL:', API_URLS.USER_PROFILE)
          
          const response = await fetch(API_URLS.USER_PROFILE, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          })

          console.log('GET Profile Response Status:', response.status)
          console.log('GET Profile Response OK:', response.ok)

          if (response.ok) {
            const result = await response.json()
            console.log('Fresh user data from backend:', result)
            
            // Backend returns data directly, not wrapped in {success: true, data: ...}
            if (result && result.id) {
              console.log('Updating user state with fresh data...')
              // Update state with fresh backend data (direct response)
              setUser(result)
              setFormData(result)
              // Also update localStorage with fresh data
              localStorage.setItem('user', JSON.stringify(result))
              console.log('User state updated successfully')
            } else {
              console.log('API response format unexpected:', result)
            }
          } else {
            console.error('Failed to fetch fresh user data:', response.status)
            const errorText = await response.text()
            console.error('Error response:', errorText)
          }
        } else {
          console.log('No token found, skipping backend fetch')
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getUserData()
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  const handleNavigateToForum = () => {
    // Navigate directly to community feed
    router.push('/community_feed')
  }

  const handleEdit = () => {
    setIsEditing(true)
    setFormData(user || {})
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData(user || {})
  }

  const handleSave = async () => {
    console.log('=== PROFILE SAVE STARTED ===')
    setIsSaving(true)
    try {
      console.log('Step 1: Getting token...')
      // Get token from localStorage
      const token = localStorage.getItem('token')
      
      if (!token) {
        console.error('No authentication token found')
        throw new Error('No authentication token found')
      }

      console.log('Step 2: Token found, validating fields...')

      // Validate required fields before saving
      const requiredFields = [
        { field: 'display_name', label: 'Display Name' },
        { field: 'first_name', label: 'First Name' },
        { field: 'last_name', label: 'Last Name' },
        { field: 'phone_number', label: 'Phone Number' },
        { field: 'trading_experience', label: 'Trading Experience' },
        { field: 'income_range', label: 'Income Range' }
      ]

      const missingFields = requiredFields.filter(
        requiredField => {
          const value = formData[requiredField.field as keyof typeof formData]
          return !value || (typeof value === 'string' && value.trim() === '')
        }
      )

      // Validate phone number format (Indian numbers only)
      const phoneNumber = formData.phone_number as string
      if (phoneNumber) {
        // Remove all non-digit characters for validation
        const cleanPhone = phoneNumber.replace(/\D/g, '')
        
        // Indian phone number validation (10 digits without +91)
        if (cleanPhone.length !== 10) {
          alert('Phone number must be exactly 10 digits long')
          return
        }
        
        // Check if it starts with valid Indian mobile prefix (6, 7, 8, 9)
        if (!/^[6-9]/.test(cleanPhone)) {
          alert('Phone number must start with 6, 7, 8, or 9')
          return
        }
      }

      // Check if at least one trading interest is selected
      const hasTradingInterest = 
        (formData.trading_interest_stock === true) || 
        (formData.trading_interest_futures === true) || 
        (formData.trading_interest_none === true)

      if (!hasTradingInterest) {
        missingFields.push({ field: 'trading_interest', label: 'Trading Interest' })
      }

      if (missingFields.length > 0) {
        const missingFieldLabels = missingFields.map(f => f.label).join(', ')
        alert(`Please fill in all required fields: ${missingFieldLabels}`)
        return
      }

      console.log('Step 3: Fields validated, preparing API call...')
      console.log('API URL:', API_URLS.USER_PROFILE)
      console.log('Full API URL will be:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_PROFILE}`)
      
      // Prepare data for API - only send fields that backend expects
      const profileData = {
        display_name: formData.display_name || '',
        first_name: formData.first_name || '',
        last_name: formData.last_name || '',
        phone_number: formData.phone_number || '',
        trading_experience: formData.trading_experience || '',
        income_range: formData.income_range || '',
        trading_interest_stock: formData.trading_interest_stock || false,
        trading_interest_futures: formData.trading_interest_futures || false,
        trading_interest_none: formData.trading_interest_none || false,
        automation_interest: formData.automation_interest || ''
      }

      console.log('=== DEBUGGING AUTOMATION_INTEREST ===')
      console.log('formData.automation_interest:', formData.automation_interest)
      console.log('Type of automation_interest:', typeof formData.automation_interest)
      console.log('Final automation_interest in profileData:', profileData.automation_interest)
      console.log('Type of final automation_interest:', typeof profileData.automation_interest)
      console.log('=====================================')

      console.log('Sending profile data to backend:', profileData)
      console.log('Token present:', token ? 'Yes' : 'No')
      console.log('Token length:', token ? token.length : 0)

      console.log('Step 4: Making API call...')
      // Make actual API call to backend
      const response = await fetch(API_URLS.USER_PROFILE, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      })

      console.log('Step 5: Got response!')
      console.log('Response status:', response.status)
      console.log('Response statusText:', response.statusText)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))
      
      // Handle token expiration
      if (response.status === 403) {
        const errorData = await response.json()
        console.error('Token expired or invalid:', errorData)
        
        // Clear local storage and redirect to login
        localStorage.removeItem('isAuthenticated')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        
        alert('Your session has expired. Please sign in again.')
        router.push('/auth/signin')
        return
      }
      
      // Get response text first to handle non-JSON responses
      const responseText = await response.text()
      console.log('Raw response text:', responseText)
      
      let result
      try {
        result = JSON.parse(responseText)
        console.log('Parsed backend response:', result)
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError)
        console.log('Response was not JSON. Raw text:', responseText)
        throw new Error(`Invalid response from server: ${responseText.substring(0, 200)}`)
      }

      if (!response.ok) {
        console.error('HTTP Error:', {
          status: response.status,
          statusText: response.statusText,
          body: result
        })
        throw new Error(result.message || result.error || `HTTP error! status: ${response.status}`)
      }

      if (result.success) {
        // Update local state with backend response
        const updatedUser: User = {
          ...(user as User),
          ...result.data,
          updated_at: new Date().toISOString()
        } as User
        
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setIsEditing(false)
        
        // Show success message
        alert('Profile updated successfully!')
        
        // Navigate to community feed page after successful update
        router.push('/community_feed')
      } else {
        throw new Error(result.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      console.error('Error type:', typeof error)
      console.error('Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'No stack trace'
      })
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Error updating profile: ${errorMessage}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      </AuthGuard>
    )
  }

  // Debug: Log current user state
  console.log('=== CURRENT USER STATE IN RENDER ===')
  console.log('User data:', user)
  console.log('User phone_number:', user?.phone_number)
  console.log('User trading_experience:', user?.trading_experience)
  console.log('User income_range:', user?.income_range)
  console.log('=========================================')

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Profile Notice - Only show if phone number is not set */}
          {!user?.phone_number && (
            <div className="bg-transparent border border-purple-200 rounded-lg p-6 mb-6 shadow-sm backdrop-blur-sm bg-white/30">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="animate-pulse">
                    <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3">
                    Complete Your Profile
                  </h3>
                  
                  <div className="bg-white rounded-md p-4 mb-4 border border-purple-100">
                    <p className="text-sm text-purple-800 font-medium mb-2">
                      Please complete your profile using the Edit option.
                      <span className="text-pink-600 font-bold"> All fields are mandatory</span> and are required to provide you with personalized services and accurate trading recommendations.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="animate-fade-in">
                      <h4 className="text-sm font-bold text-purple-900 mb-2 flex items-center">
                        <svg className="h-4 w-4 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                        </svg>
                        Why we collect this information
                      </h4>
                      <p className="text-xs text-purple-700 mb-3">
                        We collect this data to support our algorithmic trading platform, Trade Layout. Using this platform, you can:
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center space-x-2 bg-purple-50 rounded-md p-2 transform hover:scale-105 transition-transform">
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-purple-800 font-medium">Automate your trades</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-pink-50 rounded-md p-2 transform hover:scale-105 transition-transform">
                          <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-pink-800 font-medium">Build custom trading strategies</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-orange-50 rounded-md p-2 transform hover:scale-105 transition-transform">
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-orange-800 font-medium">Backtest strategies on real market data</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-yellow-50 rounded-md p-2 transform hover:scale-105 transition-transform">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-yellow-800 font-medium">Create strategies without coding using drag-and-drop interface</span>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-md p-3 border border-purple-200">
                        <p className="text-xs text-purple-900 font-medium flex items-center">
                          <svg className="h-4 w-4 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100-4h-.5a1 1 0 000-2H8a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                          </svg>
                          When you subscribe to our service, this data will be helpful to serve you better
                        </p>
                      </div>
                    </div>

                    <div className="animate-fade-in-delayed">
                      <h4 className="text-sm font-bold text-purple-900 mb-2 flex items-center">
                        <svg className="h-4 w-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Platform Features
                      </h4>
                      <div className="bg-green-50 rounded-md p-3 border border-green-100">
                        <p className="text-xs text-green-800 mb-2">
                          Trade Layout offers both <span className="font-semibold">free and premium plans</span>.
                        </p>
                        <p className="text-xs text-green-800">
                          If you face any difficulty during automation, you can book a <span className="font-semibold">free support session</span> with our team. We strongly recommend backtesting your strategy before deploying it in live markets.
                        </p>
                      </div>
                    </div>

                    <div className="animate-fade-in-delayed-2">
                      <h4 className="text-sm font-bold text-purple-900 mb-2 flex items-center">
                        <svg className="h-4 w-4 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Data Privacy & Security
                      </h4>
                      <div className="bg-indigo-50 rounded-md p-3 border border-indigo-100">
                        <ul className="space-y-1">
                          <li className="flex items-start text-xs text-indigo-800">
                            <svg className="h-3 w-3 mr-1 text-indigo-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Your data is stored on secure services
                          </li>
                          <li className="flex items-start text-xs text-indigo-800">
                            <svg className="h-3 w-3 mr-1 text-indigo-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            We do not use your data for marketing, promotions, or calls without your explicit consent
                          </li>
                          <li className="flex items-start text-xs text-indigo-800">
                            <svg className="h-3 w-3 mr-1 text-indigo-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Your information is used only to improve platform functionality and user experience
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <style jsx>{`
            @keyframes fade-in {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fade-in-delayed {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fade-in-delayed-2 {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
              animation: fade-in 0.6s ease-out;
            }
            .animate-fade-in-delayed {
              animation: fade-in-delayed 0.6s ease-out 0.3s both;
            }
            .animate-fade-in-delayed-2 {
              animation: fade-in-delayed-2 0.6s ease-out 0.6s both;
            }
          `}</style>

          {/* Profile Header */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  User Profile
                </h3>
                <div className="flex flex-col items-end space-y-2">
                  {!isEditing ? (
                    <button
                      onClick={handleEdit}
                      className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors duration-200 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          console.log('Save button clicked!')
                          handleSave()
                        }}
                        disabled={isSaving}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 disabled:opacity-50"
                      >
                        {isSaving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  )}
                  {/* Show Navigate to Forum button only if phone number exists */}
                  {user?.phone_number && !isEditing && (
                    <button
                      onClick={handleNavigateToForum}
                      className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
                    >
                      Go to Community Feed
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {user?.avatar_url ? (
                    <img
                      className="h-20 w-20 rounded-full"
                      src={user.avatar_url}
                      alt="Profile"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-pink-500 flex items-center justify-center">
                      <span className="text-white text-2xl font-medium">
                        {user?.display_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* User Info */}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user?.display_name || user?.full_name || 'User'}
                  </h1>
                  <p className="text-gray-600">{user?.email}</p>
                  <div className="mt-2 flex items-center space-x-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {user?.email_verified ? 'Verified' : 'Not Verified'}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {user?.auth_provider === 'google' ? 'Google Account' : 'Email Account'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="mt-6 bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                Personal Information
              </h3>
              
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-semibold text-gray-700 flex items-center">
                    Display Name 
                    <span className="ml-1 text-red-500 font-bold">*</span>
                  </dt>
                  <dd className="mt-1">
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.display_name || ''}
                        onChange={(e) => handleInputChange('display_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="Enter display name"
                      />
                    ) : (
                      <span className="text-sm text-gray-900">
                        {user?.display_name || 'Not set'}
                      </span>
                    )}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-semibold text-gray-700 flex items-center">
                    First Name 
                    <span className="ml-1 text-red-500 font-bold">*</span>
                  </dt>
                  <dd className="mt-1">
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.first_name || ''}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="Enter first name"
                      />
                    ) : (
                      <span className="text-sm text-gray-900">
                        {user?.first_name || 'Not set'}
                      </span>
                    )}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-semibold text-gray-700 flex items-center">
                    Last Name 
                    <span className="ml-1 text-red-500 font-bold">*</span>
                  </dt>
                  <dd className="mt-1">
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.last_name || ''}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="Enter last name"
                      />
                    ) : (
                      <span className="text-sm text-gray-900">
                        {user?.last_name || 'Not set'}
                      </span>
                    )}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-semibold text-gray-700 flex items-center">
                    Phone Number 
                    <span className="ml-1 text-red-500 font-bold">*</span>
                  </dt>
                  <dd className="mt-1">
                    {isEditing ? (
                      <div>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-100 text-gray-600 rounded-l-md">
                            +91
                          </span>
                          <input
                            type="tel"
                            value={formData.phone_number || ''}
                            onChange={(e) => handleInputChange('phone_number', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                            placeholder="Enter 10-digit mobile number"
                            maxLength={10}
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          📱 Enter 10-digit Indian mobile number (starts with 6, 7, 8, or 9)
                        </p>
                      </div>
                    ) : (
                      <div>
                        <span className="text-sm text-gray-900">
                          {user?.phone_number ? `+91 ${user.phone_number}` : 'Not set'}
                        </span>
                        {user?.phone_number && (
                          <p className="mt-1 text-xs text-gray-500">
                            📱 Linked with WhatsApp for verification
                          </p>
                        )}
                      </div>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Trading Information */}
          <div className="mt-6 bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                Trading Information
              </h3>
              
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-semibold text-gray-700 flex items-center">
                    Trading Experience 
                    <span className="ml-1 text-red-500 font-bold">*</span>
                  </dt>
                  <dd className="mt-1">
                    {isEditing ? (
                      <select
                        value={formData.trading_experience || ''}
                        onChange={(e) => handleInputChange('trading_experience', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        <option value="">Select experience</option>
                        <option value="beginner">Beginner (0-1 year)</option>
                        <option value="intermediate">Intermediate (1-3 years)</option>
                        <option value="advanced">Advanced (3-5 years)</option>
                        <option value="expert">Expert (5+ years)</option>
                      </select>
                    ) : (
                      <span className="text-sm text-gray-900 capitalize">
                        {user?.trading_experience || 'Not set'}
                      </span>
                    )}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-semibold text-gray-700 flex items-center">
                    Income Range 
                    <span className="ml-1 text-red-500 font-bold">*</span>
                  </dt>
                  <dd className="mt-1">
                    {isEditing ? (
                      <select
                        value={formData.income_range || ''}
                        onChange={(e) => handleInputChange('income_range', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        <option value="">Select income range</option>
                        <option value="below_5_lakh">Below 5 Lakh</option>
                        <option value="5_to_10_lakh">5 to 10 Lakh</option>
                        <option value="10_to_15_lakh">10 to 15 Lakh</option>
                        <option value="above_15_lakh">Above 15 Lakh</option>
                      </select>
                    ) : (
                      <span className="text-sm text-gray-900">
                        {user?.income_range === 'below_5_lakh' ? 'Below 5 Lakh' :
                         user?.income_range === '5_to_10_lakh' ? '5 to 10 Lakh' :
                         user?.income_range === '10_to_15_lakh' ? '10 to 15 Lakh' :
                         user?.income_range === 'above_15_lakh' ? 'Above 15 Lakh' :
                         'Not set'}
                      </span>
                    )}
                  </dd>
                </div>
                
                <div className="sm:col-span-2">
                  <dt className="text-sm font-semibold text-gray-700 flex items-center">
                    Trading Interest 
                    <span className="ml-1 text-red-500 font-bold">*</span>
                  </dt>
                  <dd className="mt-1">
                    {isEditing ? (
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="trading_interest_stock"
                            checked={(formData.trading_interest_stock || false)}
                            onChange={(e) => handleInputChange('trading_interest_stock', e.target.checked.toString())}
                            className="mr-2 text-pink-500 focus:ring-pink-500"
                          />
                          <span className="text-sm text-gray-700">Stock Trading</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="trading_interest_futures"
                            checked={(formData.trading_interest_futures || false)}
                            onChange={(e) => handleInputChange('trading_interest_futures', e.target.checked.toString())}
                            className="mr-2 text-pink-500 focus:ring-pink-500"
                          />
                          <span className="text-sm text-gray-700">Futures and Options Trading</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="trading_interest_none"
                            checked={(formData.trading_interest_none || false)}
                            onChange={(e) => handleInputChange('trading_interest_none', e.target.checked.toString())}
                            className="mr-2 text-pink-500 focus:ring-pink-500"
                          />
                          <span className="text-sm text-gray-700">Not interested in any of the above</span>
                        </label>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-900">
                        {(() => {
                          const interests = [];
                          if (user?.trading_interest_stock === true) interests.push('Stock Trading');
                          if (user?.trading_interest_futures === true) interests.push('Futures and Options Trading');
                          if (user?.trading_interest_none === true) interests.push('Not interested in any of the above');
                          return interests.length > 0 ? interests.join(', ') : 'Not set';
                        })()}
                      </span>
                    )}
                  </dd>
                </div>
                
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Trade Automation Interest</dt>
                  <dd className="mt-1">
                    {isEditing ? (
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="automation_interest"
                            value="interested"
                            checked={formData.automation_interest === 'interested'}
                            onChange={(e) => handleInputChange('automation_interest', e.target.value)}
                            className="mr-2 text-pink-500 focus:ring-pink-500"
                          />
                          <span className="text-sm text-gray-700">Interested - Automate trades with Tradelayout visual programming</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="automation_interest"
                            value="not_interested"
                            checked={formData.automation_interest === 'not_interested'}
                            onChange={(e) => handleInputChange('automation_interest', e.target.value)}
                            className="mr-2 text-pink-500 focus:ring-pink-500"
                          />
                          <span className="text-sm text-gray-700">Not interested</span>
                        </label>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-900">
                        {user?.automation_interest === 'interested' ? 'Interested - Automate trades with Tradelayout visual programming' :
                         user?.automation_interest === 'not_interested' ? 'Not interested' :
                         'Not set'}
                      </span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Account Details */}
          <div className="mt-6 bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                Account Details
              </h3>
              
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">User ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user?.user_id}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Account Type</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user?.is_oauth_user ? 'OAuth User' : 'Email User'}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Provider</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{user?.auth_provider}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Login</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user?.last_login ? new Date(user.last_login).toLocaleString() : 'Unknown'}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Account Status</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user?.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user?.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                Account Actions
              </h3>
              
              <div className="space-y-4">
                <button
                  onClick={handleSignOut}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
