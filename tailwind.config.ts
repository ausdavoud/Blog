import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx,md}',
    './components/**/*.{js,ts,jsx,tsx,mdx,md}',
    './app/**/*.{js,ts,jsx,tsx,mdx,md}',
    './public/**/*.{js,ts,jsx,tsx,mdx,md}',
  ],
  darkMode: 'class',
}

export default config
