import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/utils/AuthContext'

export const metadata: Metadata = {
  title: 'Tapper',
  description: 'Social network for EPAM IT Marathon 3.0',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
        {children}
        </AuthProvider>
        </body>
    </html>
  )
}
