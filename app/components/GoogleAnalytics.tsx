// Plain <script> tags rather than next/script: next/script's afterInteractive strategy injects
// on the client at the end of <body>, while Google asks for the tag right after <head>.
export default function GoogleAnalytics() {
    // public measurement ID; the ANALYTICS_ID set on Vercel pointed at a stream Google no longer serves
    const id = "G-ZM10MERF3E"
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
