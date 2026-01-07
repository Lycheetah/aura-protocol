import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Navigation } from '@/components/layout/navigation'
import { CascadeChat } from '@/components/cascade-chat'
import { CommandPalette } from '@/components/command-palette'
import { NotificationProvider, ToastContainer } from '@/components/notifications'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono'
})

export const metadata: Metadata = {
  title: 'CASCADE Living OS',
  description: 'AURA × VEYRA: A sovereign, living personal operating system',
  icons: {
    icon: '/favicon.ico',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-zinc-950 text-zinc-100 min-h-screen`}>
        <Providers>
          <NotificationProvider>
            <div className="flex min-h-screen">
              <Navigation />
              <main className="flex-1 overflow-auto">
                {children}
              </main>
            </div>
            <CascadeChat />
            <CommandPalette />
            <ToastContainer />
          </NotificationProvider>
        </Providers>
      </body>
    </html>
  )
}
