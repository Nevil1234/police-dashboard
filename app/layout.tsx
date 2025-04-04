// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import type React from 'react'

import CustomSessionProvider from '@/components/providers/session-provider'
import { SidebarProvider } from '@/components/ui/sidebar'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { OfficerDashboard } from '@/components/officer-dashboard'

export const metadata: Metadata = {
  title: 'Police Portal',
  description: 'Dashboard for Police Stations and Officers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <CustomSessionProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <SidebarProvider>
              <OfficerDashboard>{children}</OfficerDashboard>
              <Toaster />
            </SidebarProvider>
          </ThemeProvider>
        </CustomSessionProvider>
      </body>
    </html>
  )
}
