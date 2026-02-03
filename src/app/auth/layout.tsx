import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Auth - Trade Layout Community',
  description: 'Authentication pages for Trade Layout Community',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-pink-500 border-b border-pink-600 shadow-lg shadow-pink-500/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-white">
                Trade Layout Community
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/"
                className="text-white hover:text-pink-100 transition-colors duration-200 font-medium"
              >
                Home
              </a>
              <a
                href="/auth/signin"
                className="text-white hover:text-pink-100 transition-colors duration-200 font-medium"
              >
                Sign In
              </a>
              <a
                href="/auth/signup"
                className="bg-white text-pink-500 hover:bg-gray-100 px-4 py-2 rounded-md font-medium transition-colors duration-200"
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
