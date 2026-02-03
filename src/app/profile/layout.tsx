import { Metadata } from 'next'
import ProfileNavigation from '@/components/ProfileNavigation'

export const metadata: Metadata = {
  title: 'Profile - Trade Layout Community',
  description: 'User profile page',
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileNavigation />
      
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
