  import type { Config } from 'tailwindcss'
  
  const config: Config = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx,md}',
      './components/**/*.{js,ts,jsx,tsx,mdx,md}',
      './app/**/*.{js,ts,jsx,tsx,mdx,md}',
      './public/**/*.{js,ts,jsx,tsx,mdx,md}',
    ],
    theme: {
      extend: {
        screens: {
          nav: '460px',
          md: '724px',
          tablet: '724px',
        },
        colors: {
          'nav-surface': 'color-mix(in srgb, var(--background) var(--nav-surface-opacity), transparent)',
          'nav-border': 'color-mix(in srgb, var(--outline) 55%, transparent)',
          'nav-current': 'color-mix(in srgb, var(--on-background-muted) 12%, transparent)',
          'nav-panel': 'color-mix(in srgb, var(--background) var(--nav-panel-opacity), transparent)',
          'nav-panel-border': 'color-mix(in srgb, var(--outline) 70%, transparent)',
          'background': 'var(--background)',
          'on-background': 'var(--on-background)',
          'on-background-stronger': 'var(--on-background-stronger)',
          'on-background-muted': 'var(--on-background-muted)',
          'primary': 'var(--primary)',
          'outline': 'var(--outline)',
          'code-bg': 'var(--code-bg)',
          'on-code': 'var(--on-code)',
          'surface': 'var(--surface)',
          'code-bg-highlight': 'var(--code-bg-highlight)',
          'code-border-highlight': 'var(--code-border-highlight)',
          'inlineCode-bg': 'var(--inlineCode-bg)',
          'inlineCode-text': 'var(--inlineCode-text)',
          'link': 'var(--link)',
          'link-hover': 'var(--link-hover)',
        },
        // Measurements and motion from the deployed navbar, exposed as Tailwind utilities.
        borderRadius: { nav: '11px', 'nav-item': '7px' },
        boxShadow: { nav: '0 2px 8px rgb(0 0 0 / 4%)' },
        gridTemplateColumns: {
          nav: 'max-content auto',
          'drawer-open': 'minmax(0, 1fr)',
          'drawer-closed': 'minmax(0, 0fr)',
        },
        transitionProperty: { drawer: 'grid-template-columns', brand: 'grid-template-columns, opacity' },
        transitionDuration: { nav: '320ms' },
        transitionTimingFunction: { nav: 'ease' },
        maxWidth: {
          "post": 'var(--max-post-width)',
        },
        width: {
          "logo": "var(--logo-size)",
          "logo-sm": "var(--logo-size-sm)",
        },
        height: {
          'nav-stacked': '94px',
          "logo": "var(--logo-size)",
          "logo-sm": "var(--logo-size-sm)",
        },
        fontSize: {
          'nav-tooltip': '9px',
          "body": "var(--font-body)",
          "label": "var(--font-label)",
          "label-sm": "var(--font-label-small)",
          "h1": "var(--font-h1)",
          "h2": "var(--font-h2)",
          "h3": "var(--font-h3)",
          "h4": "var(--font-h4)",
          "name": "var(--font-name)",
          "name-sm": "var(--font-name-small)",
        }
      }
    },
    plugins: [],
    darkMode: "class"
  }
  export default config
