import { getAllPosts, getPost } from "@/app/actions/posts"
import { notFound } from "next/navigation"
import Markdown from "@/app/components/Markdown/Markdown"

import { getMdAuthors, getMdDirection, getMdLanguage } from "@/app/actions/mdProperties";
import config from "@/config";
import { PostData } from "../types";
import path from "path";
import Header from "../components/Header";

export async function generateMetadata({ params: routeParams }: { params: Promise<{ slug?: string | string[] }> }) {
    const params = await routeParams
    if (params.slug === undefined)
        params.slug = ""
    else if (Array.isArray(params.slug))
        params.slug = params.slug.join(path.sep)

    const { data } = await getPost(params.slug).catch(() => notFound())

    return {
        ...(params.slug ? { title: data.title } : {}),
        description: data.spoiler || `${config.blog_name}'s post`,
        keywords: data.keywords || "",
        authors: getMdAuthors(data),
        openGraph: {
            images: data.image || "",
            publishedTime: data.date ? new Date(data.date).toISOString() : "",
            type: "article",
            authors: getMdAuthors(data)
        }
    }
}

export default async function Page({ params: routeParams }: { params: Promise<{ slug?: string | string[] }> }) {
    const params = await routeParams
    if (params.slug === undefined)
        params.slug = ""
    if (Array.isArray(params.slug))
        params.slug = params.slug.join(path.sep)

    const { data, content, components } = await getPost(params.slug).catch(() => { notFound() })
    const isSectionPage = config.header.nav_links?.some(link =>
        [link, ...(link.children ?? [])].some(item => item.href === "/" + params.slug))

    return <>
        <div className="flex flex-col items-center max-w-[var(--max-post-width)] w-[calc(100%-4rem)]">
            <Header />
            <main className={`${params.slug === "" ? "flex flex-col justify-center py-2" : "pt-2 pb-8"} flex-1 w-full`} style={{ direction: getMdDirection(data) }}>
                {data.image && <img src={data.image} alt={isSectionPage ? "" : data.title} className="w-full mb-4 rounded-md object-cover" />}
                {(data.title || data.date) &&
                    <div className={(data.image ? "mb-2" : "my-6")}>
                        {data.title && <h1 className={`text-[length:var(--font-h2)] sm:text-[length:var(--font-h1)] text-center ${isSectionPage ? "" : "min-[724px]:text-start"} leading-9 mb-1 block font-medium text-[color:var(--on-background-stronger)]`}>{isSectionPage  ? <span className="select-none">•</span> : data.title}</h1>}
                        {data.date &&
                            <h2 className="text-sm sm:text-base">
                                {new Date(data.date || "").toLocaleDateString(getMdLanguage(data), {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </h2>
                        }
                    </div>
                }
                <article className="
                    markdown
                    [&_:not(pre)_>_code]:text-[0.9375rem] [&_:not(pre)_>_code]:bg-[var(--inlineCode-bg)] [&_:not(pre)_>_code]:text-[color:var(--inlineCode-text)] [&_:not(pre)_>_code]:mx-[2px] [&_:not(pre)_>_code]:whitespace-normal [&_:not(pre)_>_code]:rounded [&_:not(pre)_>_code]:[overflow-wrap:anywhere] [&_:not(pre)_>_code]:pt-[0.15em] [&_:not(pre)_>_code]:px-[0.4em] [&_:not(pre)_>_code]:pb-[0.1em]
                    text-[length:var(--font-body)] leading-[1.625rem]
                    [&_p]:py-[0.4rem]
                    [&_a:not(.post-row)]:text-[color:var(--link)] [&_a:not(.post-row)]:font-medium [&_a:not(.post-row):hover]:text-[color:var(--link-hover)] [&_a:not(.post-row):hover]:underline [&_a:not(.post-row)]:transition-colors
                    [&_hr]:pt-8 [&_hr]:opacity-60 dark:[&_hr]:opacity-10
                    [&_strong]:font-semibold
                    [&_h1]:mt-8 [&_h1]:mb-1 [&_h1]:text-[length:var(--font-h1)] [&_h1]:font-medium [&_h1]:text-[color:var(--on-background-stronger)]
                    [&_h2]:mt-8 [&_h2]:mb-1 [&_h2]:text-[length:var(--font-h2)] [&_h2]:font-medium [&_h2]:text-[color:var(--on-background-stronger)]
                    [&_h3]:mt-8 [&_h3]:mb-1 [&_h3]:text-[length:var(--font-h3)] [&_h3]:font-medium [&_h3]:text-[color:var(--on-background-stronger)]
                    [&_h4]:mt-8 [&_h4]:mb-1 [&_h4]:text-[length:var(--font-h4)] [&_h4]:font-normal
                    [&_pre]:my-2 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:pl-4 [&_pre]:text-sm [&_pre]:border [&_pre]:border-[var(--outline)] [&_pre]:leading-6 [&_pre]:rounded-md [&_pre]:py-3 [&_pre]:bg-[var(--code-bg)]
                    [&_pre_code]:text-[color:var(--on-code)]
                    [&_blockquote]:relative [&_blockquote]:my-2 [&_blockquote]:pl-3 [&_blockquote]:opacity-80 [&_blockquote]:border-l-white [&_blockquote]:border-l-2 [&_blockquote]:italic
                    [&_blockquote_p]:p-0 [&_blockquote_p]:m-0
                    [&_table]:mx-auto [&_table]:my-4 [&_table]:w-auto [&_table]:max-w-full [&_table]:border-collapse
                    [&_th]:border [&_th]:border-[var(--outline)] [&_th]:px-3 [&_th]:py-2 [&_th]:text-left
                    [&_td]:border [&_td]:border-[var(--outline)] [&_td]:px-3 [&_td]:py-2 [&_td]:text-left
                    [&_th]:bg-[var(--surface)] [&_th]:font-semibold [&_th]:text-[color:var(--on-background-stronger)]
                    [&_ul]:mx-4 [&_ul]:my-2
                    [&_ol]:mx-4 [&_ol]:my-2
                    [&_ul]:list-disc
                    [&_ol]:list-decimal
                    [&_li]:font-light [&_li]:mb-[0.1rem]
                    [&_img]:max-w-full [&_img]:mb-2
                ">
                    <Markdown source={content} components={components} />
                </article>
            </main >
        </div>
    </>
}

export async function generateStaticParams() {
    const posts = await getAllPosts({ recursive: true, self: true, log: true })
    return posts.map((post: PostData) => ({
        slug: post.slug.split(path.sep).slice(1),
    }))
}
