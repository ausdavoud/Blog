<<<<<<< HEAD:config.blog.ts
import { Config } from "./app/utils/types"
const config: Config = {
    blog_name: 'TheWood',
    description: 'Random Computer Science Stuff',
    author: { name: 'Davooud Nosrati', url: 'https://github.com/thewoood' },
    theme: 'auto',
    navLinks: [
        {
            name: 'About',
            href: '/pages/about'
        }
    ],
=======
const config = {
    blog_name: 'Blogger',
    description: 'Your favorite blog template',
    theme: 'system',
    logo: "/logo.png",
    header: {
        nav_links: [],
        blog_name: true,
        logo: false,
        theme_toggle: true,
    },
>>>>>>> 79d0aec227d88bb776716389c716e8274c09b5a4:config.blog.js
    lang: 'en',
    direction: 'ltr',
    content_entry: "./public",
    // These are default values for metadata base. If you have your domain,
    // you can either set it in environment variables or set it here.
    // These will be used for open graph images (sharing preview).
    metadata_base: process.env.DOMAIN || `https://${process.env.VERCEL_URL}` || `http://localhost:${process.env.PORT || 3000}`
}

<<<<<<< HEAD:config.blog.ts
export default config
=======
module.exports =  config;
>>>>>>> 79d0aec227d88bb776716389c716e8274c09b5a4:config.blog.js
