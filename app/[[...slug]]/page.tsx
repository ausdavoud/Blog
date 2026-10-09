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
        <div className="flex flex-col items-center max-w-post w-[calc(100%-4rem)]">
            <Header />
            <main className={`${params.slug === "" ? "flex flex-col justify-center py-2" : "pt-2 pb-8"} flex-1 w-full`} style={{ direction: getMdDirection(data) }}>
                {data.image && <img src={data.image} alt={isSectionPage ? "" : data.title} className="w-full mb-4 rounded-md object-cover" />}
                {(data.title || data.date) &&
                    <div className={(data.image ? "mb-2" : "my-6")}>
                        {data.title && <h1 className={`text-h2 sm:text-h1 text-center ${isSectionPage ? "" : "tablet:text-start"} leading-9 mb-1 block font-medium text-on-background-stronger`}>{isSectionPage  ? <span className="select-none">•</span> : data.title}</h1>}
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
                <article className="markdown">
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
