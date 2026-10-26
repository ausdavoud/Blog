// Plain <script> tags rather than next/script: next/script's afterInteractive strategy injects
// on the client at the end of <body>, while Google asks for the tag right after <head>.
export default function GoogleAnalytics() {
    const id = process.env.ANALYTICS_ID
    if (!id) return null
    return <>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${id}`} />
        <script
            id="google-analytics"
            dangerouslySetInnerHTML={{
                __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', "${id}");
        `,
            }}
        />
    </>
}
