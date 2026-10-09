'use client'
import { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import config from '@/config'

export default function Providers({ children }: { children: ReactNode }) {
  return <ThemeProvider defaultTheme={config.theme} attribute="class" enableSystem={false} themes={['light', 'dark']}>
    {children}
  </ThemeProvider>
}
