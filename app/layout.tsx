import type { Metadata } from 'next'
import './globals.css'
import './utils/colors.css'
import './utils/variables.css'
import './utils/extra.css'
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
      <body className="flex h-full min-h-svh w-full flex-col items-center bg-[var(--background)] text-[color:var(--on-background)]"
        style={{ fontFamily }}>
        <Providers>
          <div className="flex flex-1 w-full justify-center gap-8">
            {children}
          </div>
          <footer className="w-[calc(100%-4rem)] max-w-[var(--max-post-width)] py-2 text-center text-sm text-[color:var(--on-background-muted)]">
            2026 · Made on top of <a target="_blank" rel="noopener noreferrer" href="https://github.com/mohammad-mallaee/blogger" className="underline hover:text-[color:var(--on-background)]">blogger</a>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
