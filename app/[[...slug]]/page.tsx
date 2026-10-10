import { getAllPosts, getPost } from "@/app/actions/posts"
import { notFound } from "next/navigation"
import Markdown from "@/app/components/Markdown/Markdown"

import { getMdAuthors, getMdDirection, getMdLanguage } from "@/app/actions/mdProperties";
import config from "@/config";
import { PostData } from "../types";
import path from "path";
import Header from "../components/Header";
import { getProjectSections } from "../components/Projects";

export async function generateMetadata({ params: routeParams }: { params: Promise<{ slug?: string | string[] }> }) {
    const params = await routeParams
    if (params.slug === undefined)
        params.slug = ""
    else if (Array.isArray(params.slug))
        params.slug = params.slug.join(path.sep)

    const { data } = await getPost(params.slug.startsWith("projects/") ? "projects" : params.slug).catch(() => notFound())

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

    const projectSection = params.slug.startsWith("projects/") ? params.slug.slice("projects/".length) : undefined
    const isProjects = params.slug === "projects" || projectSection !== undefined
    const { data, content, components } = await getPost(isProjects ? "projects" : params.slug).catch(() => { notFound() })
    const isSectionPage = isProjects || config.header.nav_links?.some(link =>
        [link, ...(link.children ?? [])].some(item => item.href === "/" + params.slug))

    return <>
        <div className="flex flex-col items-center max-w-screen-sm mx-8 min-w-0 flex-1">
            <Header />
            <main className={`${params.slug === "" ? "flex flex-col justify-center py-2" : "pt-2 pb-8"} flex-1 w-full`} dir={getMdDirection(data)}>
                {data.image && <img src={data.image} alt={isSectionPage ? "" : data.title} className="w-full mb-4 rounded-md object-cover" />}
                {isProjects && <h1 className="sr-only">{data.title}</h1>}
                {!isProjects && (data.title || data.date) &&
                    <div className={(data.image ? "mb-2" : "my-6")}>
                        {data.title && <h1 className={`text-3xl text-center ${isSectionPage ? "" : "md:text-start"} leading-9 mb-1 block font-medium text-stone-950 dark:text-stone-50`}>{isSectionPage  ? <span className="select-none">•</span> : data.title}</h1>}
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
                    text-base leading-relaxed
                    [&_*]:[unicode-bidi:plaintext]
                    [&_:not(pre)>code]:text-sm [&_:not(pre)>code]:bg-stone-300/30 dark:[&_:not(pre)>code]:bg-stone-500/30 [&_:not(pre)>code]:text-zinc-900 dark:[&_:not(pre)>code]:text-neutral-200 [&_:not(pre)>code]:mx-0.5 [&_:not(pre)>code]:whitespace-normal [&_:not(pre)>code]:rounded [&_:not(pre)>code]:[overflow-wrap:anywhere] [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5
                    [&_p]:py-1.5
                    [&_hr]:pt-8 [&_hr]:opacity-60 dark:[&_hr]:opacity-10
                    [&_strong]:font-semibold
                    [&_h1]:mt-8 [&_h1]:mb-1 [&_h1]:text-3xl [&_h1]:leading-7 [&_h1]:font-medium [&_h1]:text-stone-950 dark:[&_h1]:text-stone-50
                    [&_h2]:mt-8 [&_h2]:mb-1 [&_h2]:text-3xl [&_h2]:leading-7 [&_h2]:font-medium [&_h2]:text-stone-950 dark:[&_h2]:text-stone-50
                    [&_h3]:mt-8 [&_h3]:mb-1 [&_h3]:text-2xl [&_h3]:leading-7 [&_h3]:font-medium [&_h3]:text-stone-950 dark:[&_h3]:text-stone-50
                    [&_h4]:mt-8 [&_h4]:mb-1 [&_h4]:text-xl [&_h4]:leading-7 [&_h4]:font-normal
                    [&_pre]:my-2 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:pl-4 [&_pre]:text-sm [&_pre]:border [&_pre]:border-zinc-300 dark:[&_pre]:border-zinc-800 [&_pre]:leading-6 [&_pre]:rounded-md [&_pre]:py-3 [&_pre]:bg-gray-100 dark:[&_pre]:bg-zinc-900
                    [&_pre_code]:text-neutral-700 dark:[&_pre_code]:text-zinc-100
                    [&_pre_code_span]:text-[color:var(--shiki-light)] dark:[&_pre_code_span]:text-[color:var(--shiki-dark)]
                    [&_pre_[data-highlighted-line]]:-ml-4 [&_pre_[data-highlighted-line]]:pl-3 [&_pre_[data-highlighted-line]]:border-l-4 [&_pre_[data-highlighted-line]]:border-sky-500/90 dark:[&_pre_[data-highlighted-line]]:border-teal-500/90 [&_pre_[data-highlighted-line]]:bg-sky-200/75 dark:[&_pre_[data-highlighted-line]]:bg-teal-900/70 [&_pre_[data-highlighted-line]]:block [&_pre_[data-highlighted-line]]:pr-3.5
                    [&_blockquote]:relative [&_blockquote]:my-2 [&_blockquote]:pl-3 [&_blockquote]:opacity-80 [&_blockquote]:border-l-white [&_blockquote]:border-l-2 [&_blockquote]:italic
                    [&_blockquote_p]:p-0 [&_blockquote_p]:m-0
                    [&_table]:mx-auto [&_table]:my-4 [&_table]:w-auto [&_table]:max-w-full [&_table]:border-collapse
                    [&_th]:border [&_th]:border-zinc-300 dark:[&_th]:border-zinc-800 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left
                    [&_td]:border [&_td]:border-zinc-300 dark:[&_td]:border-zinc-800 [&_td]:px-3 [&_td]:py-2 [&_td]:text-left
                    [&_th]:bg-gray-200 dark:[&_th]:bg-zinc-900 [&_th]:font-semibold [&_th]:text-stone-950 dark:[&_th]:text-stone-50
                    [&_ul]:mx-4 [&_ul]:my-2 [&_ul]:list-disc
                    [&_ol]:mx-4 [&_ol]:my-2 [&_ol]:list-decimal
                    [&_li]:font-light [&_li]:mb-0.5
                    [&_img]:max-w-full [&_img]:mb-2 [&_p_img]:mb-0
                    [&_.katex]:[font-family:inherit] [&_.katex]:text-[length:1em] [&_.katex]:font-normal
                    [&_.katex-display]:max-w-full [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden [&_.katex-display]:py-1 [&_.katex-display>.katex]:text-[length:1.21em]
                ">
                    <Markdown source={content} components={components} projects={isProjects} projectSection={projectSection} />
                </article>
            </main >
        </div>
    </>
}

export async function generateStaticParams() {
    const posts = await getAllPosts({ recursive: true, self: true, log: true })
    const sections = getProjectSections((await getPost("projects")).content)
    return [...posts.map((post: PostData) => ({
        slug: post.slug.split(path.sep).slice(1),
    })), ...sections.map(section => ({ slug: ["projects", section.id] }))]
}
