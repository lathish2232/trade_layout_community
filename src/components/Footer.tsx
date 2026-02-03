'use client'

import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    {
      title: 'Platform',
      links: [
        { name: 'About', href: '/about' },
        { name: 'Features', href: '/features' },
        { name: 'Status', href: '/status' },
        { name: 'Careers', href: '/careers' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Safety', href: '/safety' },
        { name: 'Blog', href: '/blog' },
        { name: 'API', href: '/api' },
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'Legal', href: '/legal' },
      ]
    },
    {
      title: 'Community',
      links: [
        { name: 'Developers', href: '/developers' },
        { name: 'Designers', href: '/designers' },
        { name: 'Partners', href: '/partners' },
        { name: 'Investors', href: '/investors' },
      ]
    }
  ]

  const socialLinks = [
    { name: 'X', href: '#', icon: '𝕏' },
    { name: 'Facebook', href: '#', icon: 'f' },
    { name: 'Instagram', href: '#', icon: '📷' },
    { name: 'LinkedIn', href: '#', icon: 'in' },
    { name: 'YouTube', href: '#', icon: '▶' },
  ]

  return (
    <footer className="bg-pink-500 text-white shadow-lg shadow-pink-500/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-pink-100 hover:text-white transition-colors duration-200 hover:underline hover:underline-offset-2"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-pink-600">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-6 mb-4 md:mb-0">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg shadow-white/50">
                    <span className="text-pink-500 font-bold text-sm">T</span>
                  </div>
                  <span className="text-xl font-bold">Tradelayout</span>
                </div>
                <span className="text-pink-100 text-sm">
                  &copy; {currentYear} Tradelayout. All rights reserved.
                </span>
              </div>

              <div className="flex items-center space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-pink-100 hover:text-white transition-colors duration-200 text-lg font-medium hover:scale-110 hover:shadow-lg hover:shadow-white/50 px-2 py-1 rounded-md"
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-pink-100 text-sm">
              The real-time trading community platform. Share insights, strategies, and connect with traders worldwide.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
