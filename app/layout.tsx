import type { Metadata } from 'next'
import './globals.css'
import config from '@/config'
import Providers from './components/providers'
import fonts from './utils/font'
import GoogleAnalytics from './components/GoogleAnalytics'

export const metadata: Metadata = {
  metadataBase: new URL(config.site_url),
  title: {
    default: [config.site_title_prefix, config.blog_name].filter(Boolean).join(' | '),
    template: `%s | ${config.blog_name}`,
  },
  icons: {
    icon: '/logo.png',
  },
  description: config.description
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const fontFamily = Array.isArray(fonts)
    ? fonts.map(f => f.style.fontFamily.split(",")[0]).join(", ")
    : fonts.style.fontFamily
  return (
    <html lang="en" className="overflow-y-scroll" suppressHydrationWarning>
      <GoogleAnalytics />
      <body className="flex h-full min-h-svh w-full flex-col items-center bg-zinc-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200"
        style={{ fontFamily }}>
        <Providers>
          <div className="flex flex-1 w-full justify-center gap-8">
            {children}
          </div>
          <footer className="self-stretch px-8 py-2 text-center text-sm text-neutral-500 dark:text-zinc-400">
            2026 · Made on top of <a target="_blank" rel="noopener noreferrer" href="https://github.com/mohammad-mallaee/blogger" className="underline hover:text-neutral-800 dark:hover:text-neutral-200">blogger</a>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
