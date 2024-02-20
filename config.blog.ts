import { Config } from "./app/utils/types"
const config: Config = {
    blog_name: 'TheWood',
    description: 'Random Computer Science Sh*t',
    author: { name: 'Davooud Nosrati', url: 'https://github.com/thewoood' },
    theme: 'auto',
    navLinks: [
        {
            name: 'About',
            href: '/pages/about'
        }
    ],
    lang: 'en',
    direction: 'ltr',
    posts_dir: './public/posts',
    pages_dir: './public/pages',
    // These are default values for metadata base. If you have your domain,
    // you can either set it in environment variables or set it here.
    // These will be used for open graph images (sharing preview).
    metadata_base: process.env.DOMAIN || `https://${process.env.VERCEL_URL}` || `http://localhost:${process.env.PORT || 3000}`
}

export default config