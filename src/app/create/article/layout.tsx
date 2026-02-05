import { Metadata } from 'next'
import Sidebar from '@/components/Sidebar'
import AuthenticatedNavigation from '@/components/AuthenticatedNavigation'

export const metadata: Metadata = {
  title: 'Create Article - Trade Layout Community',
  description: 'Publish a detailed guide, analysis, or research article',
}

export default function CreateArticleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthenticatedNavigation />
      
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
