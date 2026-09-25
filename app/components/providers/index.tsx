'use client'
import { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import { SidebarProvider } from './sidebar'
import config from '@/config'

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider defaultTheme={config.theme} attribute='class' enableSystem={false} themes={['light', 'dark']}>
      <SidebarProvider>
        {children}
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default Providers
