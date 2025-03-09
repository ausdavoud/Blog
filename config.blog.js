const config = {
    blog_name: 'ausdavoud',
    description: 'Random Computer Science Stuff',
    theme: 'system',
    logo: "/logo.png",
    author: "Davoud Nosrati",
    header: {
        nav_links: [
        ],
        blog_name: true,
        logo: false,
        theme_toggle: true,
    },
    lang: 'en',
    direction: 'ltr',
    content_entry: "./public",
    global_sidebar: false,
    // These are default values for metadata base. If you have your domain,
    // you can either set it in environment variables or set it here.
    // These will be used for open graph images (sharing preview).
    site_url: process.env.SITE_URL || "https://example.com"
}

module.exports = config;